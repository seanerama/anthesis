import { execFile } from "node:child_process";
import { realpath } from "node:fs/promises";
import { promisify } from "node:util";
import { sha256 } from "../shared/canonical-json.js";
import type { CanonicalRepositoryV1 } from "../canonical/model.js";
const exec = promisify(execFile);

async function git(repo: string, args: string[]): Promise<string> {
  try { return (await exec("git", ["-C", repo, ...args], { encoding: "utf8" })).stdout.trim(); }
  catch { throw new Error(`Not a Git repository: ${repo}`); }
}
const iso = (seconds: string): string => new Date(Number(seconds) * 1000).toISOString();

export async function collectRepository(input: string): Promise<CanonicalRepositoryV1> {
  const repo = await realpath(input).catch(() => { throw new Error(`Not a Git repository: ${input}`); });
  await git(repo, ["rev-parse", "--is-inside-work-tree"]);
  const snapshotSha = await git(repo, ["rev-parse", "HEAD"]);
  const branch = await git(repo, ["symbolic-ref", "--short", "HEAD"]);
  const rows = (await git(repo, ["log", "--reverse", "--format=%H%x1f%P%x1f%ae%x1f%an%x1f%at%x1f%s", "--numstat"])).split(/\n(?=[0-9a-f]{40}\x1f)/);
  const contributors = new Map<string, string>();
  const commits = rows.map((row) => {
    const lines = row.split("\n"); const header = lines.shift()?.split("\x1f");
    if (!header || header.length < 6) throw new Error("Unable to parse Git history");
    const [commitSha = "", parents = "", email = "", name = "", seconds = "", subject = ""] = header;
    const authorId = sha256(email.toLowerCase()).slice(0, 16); contributors.set(authorId, name);
    let additions = 0, deletions = 0, filesChanged = 0, testChanges = 0, documentationChanges = 0;
    for (const line of lines) { const [a, d, file] = line.split("\t"); if (!file) continue; additions += a === "-" ? 0 : Number(a); deletions += d === "-" ? 0 : Number(d); filesChanged++; if (/(^|\/)(test|tests)\//.test(file)) testChanges++; if (/(^|\/)(docs?\/|README)/i.test(file)) documentationChanges++; }
    return { sha: commitSha, parentShas: parents ? parents.split(" ") : [], authorId, authoredAt: iso(seconds), additions, deletions, filesChanged, testChanges, documentationChanges, excludedChanges: 0, isMerge: parents.split(" ").filter(Boolean).length > 1, isRevert: /^revert/i.test(subject) };
  });
  if (!commits.length) throw new Error(`Git repository has no commits: ${repo}`);
  const tagsRaw = await git(repo, ["for-each-ref", "--sort=creatordate", "--format=%(refname:short)%00%(*objectname)%00%(objectname)%00%(creatordate:unix)", "refs/tags"]);
  const tags = tagsRaw ? tagsRaw.split("\n").map((line) => { const [name = "", peeled = "", object = "", seconds = ""] = line.split("\0"); return { name, targetSha: peeled || object, occurredAt: iso(seconds) }; }).sort((a,b) => a.occurredAt.localeCompare(b.occurredAt) || a.name.localeCompare(b.name)) : [];
  return { schemaVersion: 1, repository: { identity: repo, defaultBranch: branch, snapshotSha }, analysis: { mode: "git-only", generatedAt: commits.at(-1)!.authoredAt, configHash: sha256("anthesis-v1:git-only:[]"), exclusions: [] }, period: { start: commits[0]!.authoredAt, end: commits.at(-1)!.authoredAt }, contributors: [...contributors].map(([id, displayName]) => ({ id, displayName, aliases: [] })).sort((a,b) => a.id.localeCompare(b.id)), commits, tags, warnings: [] };
}
