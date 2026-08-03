import { execFile } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { promisify } from "node:util";
import { collectRepository } from "../../src/collector/git.js";

const exec = promisify(execFile);

async function commit(repo: string, contents: string, message: string, authoredAt: string): Promise<void> {
  await writeFile(join(repo, "history.txt"), contents);
  await exec("git", ["-C", repo, "add", "."]);
  await exec("git", ["-C", repo, "commit", "-q", "-m", message], {
    env: { ...process.env, GIT_AUTHOR_DATE: authoredAt, GIT_COMMITTER_DATE: authoredAt }
  });
}

test("canonical commits sort by authoredAt rather than traversal order", async () => {
  const repo = await mkdtemp(join(tmpdir(), "anthesis-order-"));
  await exec("git", ["init", "-q", "-b", "main", repo]);
  await exec("git", ["-C", repo, "config", "user.name", "Time Gardener"]);
  await exec("git", ["-C", repo, "config", "user.email", "time@example.test"]);
  await commit(repo, "parent\n", "parent authored later", "2024-01-02T00:00:00Z");
  await commit(repo, "parent\nchild\n", "child authored earlier", "2024-01-01T00:00:00Z");

  const canonical = await collectRepository(repo);

  assert.deepEqual(canonical.commits.map((entry) => entry.authoredAt), [
    "2024-01-01T00:00:00.000Z",
    "2024-01-02T00:00:00.000Z"
  ]);
  assert.equal(canonical.period.start, "2024-01-01T00:00:00.000Z");
  assert.equal(canonical.period.end, "2024-01-02T00:00:00.000Z");
});
