import { z } from "zod";
import type { CanonicalRepositoryV1 } from "../canonical/model.js";
import { canonicalJson, sha256 } from "../shared/canonical-json.js";
import { clamp } from "../analysis/index.js";
import { segmentHistory } from "../collector/git.js";
const sourceRef = z.object({
  kind: z.enum(["commit", "tag", "period", "repository"]),
  id: z.string(),
});
export const botanicalSceneSchema = z
  .object({
    schemaVersion: z.literal(1),
    grammarVersion: z.string(),
    source: z.object({
      repositoryIdentity: z.string(),
      snapshotSha: z.string().regex(/^[0-9a-f]{40}$/),
      canonicalConfigHash: z.string().regex(/^[0-9a-f]{64}$/),
    }),
    generation: z.object({
      seed: z.string(),
      scalingMode: z.enum(["repository-relative", "globally-comparable"]),
    }),
    phenotype: z.object({
      activity: z.number().min(0).max(1),
      growth: z.number().min(0).max(1),
      pruning: z.number().min(0).max(1),
      branching: z.number().min(0).max(1),
      collaboration: z.number().min(0).max(1),
      review: z.number().min(0).max(1),
      stability: z.number().min(0).max(1),
      resolution: z.number().min(0).max(1),
      testing: z.number().min(0).max(1),
      documentation: z.number().min(0).max(1),
    }),
    viewport: z.object({ width: z.number(), height: z.number() }),
    elements: z.array(
      z.object({
        id: z.string(),
        kind: z.enum([
          "root",
          "stem",
          "branch",
          "leaf",
          "bud",
          "flower",
          "petal",
          "seed",
          "scar",
          "thorn",
        ]),
        parentId: z.string().optional(),
        sourceRefs: z.array(sourceRef),
        metrics: z.record(z.number()),
        intent: z.record(z.union([z.number(), z.string(), z.boolean()])),
      }),
    ),
    warnings: z.array(z.object({ code: z.string(), message: z.string() })),
  })
  .strict();
export type BotanicalSceneV1 = z.infer<typeof botanicalSceneSchema>;
export type GrammarOptions = {
  enabled?: boolean;
  grammarVersion?: string;
  rendererVersion?: string;
  style?: string;
  scalingMode?: "repository-relative" | "globally-comparable";
};
export const SIGNIFICANT_MERGE_CHANGE_THRESHOLD = 1;
const total = (
  c: CanonicalRepositoryV1,
  key: "additions" | "deletions" | "testChanges" | "documentationChanges",
) => c.commits.reduce((n, x) => n + x[key], 0);
export function deriveSeed(
  c: CanonicalRepositoryV1,
  o: GrammarOptions = {},
): string {
  return sha256(
    canonicalJson({
      repositoryIdentity: c.repository.identity,
      snapshotSha: c.repository.snapshotSha,
      configurationHash: c.analysis.configHash,
      grammarVersion: o.grammarVersion ?? "mvp-grammar-v1",
      rendererVersion: o.rendererVersion ?? "mvp-svg-v1",
      style: o.style ?? "herbarium",
    }),
  );
}
export function grow(
  c: CanonicalRepositoryV1,
  o: GrammarOptions = {},
): BotanicalSceneV1 {
  const changes = total(c, "additions") + total(c, "deletions"),
    deletions = total(c, "deletions"),
    merges = c.commits.filter(
      (x) =>
        x.isMerge &&
        x.parentShas.slice(1).reduce((sum, sha) => {
          const parent = c.commits.find((commit) => commit.sha === sha);
          return sum + (parent?.additions ?? 0) + (parent?.deletions ?? 0);
        }, 0) >= SIGNIFICANT_MERGE_CHANGE_THRESHOLD,
    ),
    reverts = c.commits.filter((x) => x.isRevert);
  const phenotype = {
    activity: clamp(c.commits.length / 24),
    growth: clamp(changes / 500),
    pruning: clamp(deletions / 250),
    branching: clamp(merges.length / 5),
    collaboration: clamp(c.contributors.length / 8),
    review: 0,
    stability: clamp(1 - reverts.length / Math.max(1, c.commits.length)),
    resolution: clamp(c.commits.length / 12),
    testing: clamp(total(c, "testChanges") / 8),
    documentation: clamp(total(c, "documentationChanges") / 8),
  };
  if (!o.enabled) {
    const seed = sha256(
      `${c.repository.identity}:${c.repository.snapshotSha}:${c.analysis.configHash}:stage-0`,
    );
    return botanicalSceneSchema.parse({
      schemaVersion: 1,
      grammarVersion: "stage-0-v1",
      source: {
        repositoryIdentity: c.repository.identity,
        snapshotSha: c.repository.snapshotSha,
        canonicalConfigHash: c.analysis.configHash,
      },
      generation: { seed, scalingMode: "repository-relative" },
      phenotype,
      viewport: { width: 800, height: 1000 },
      elements: [
        {
          id: "main-stem",
          kind: "stem",
          sourceRefs: c.commits.map((x) => ({ kind: "commit", id: x.sha })),
          metrics: { commitCount: c.commits.length },
          intent: { height: 0.72 },
        },
        ...c.tags.map((t, i) => ({
          id: `flower-${i + 1}`,
          kind: "flower" as const,
          parentId: "main-stem",
          sourceRefs: [{ kind: "tag" as const, id: t.name }],
          metrics: { tagIndex: i },
          intent: { label: t.name, position: 0.75 },
        })),
      ],
      warnings: [],
    });
  }
  const elements: BotanicalSceneV1["elements"] = [
    {
      id: "root-repository",
      kind: "root",
      sourceRefs: [{ kind: "repository", id: c.repository.identity }],
      metrics: { commitCount: c.commits.length },
      intent: { defaultBranch: c.repository.defaultBranch },
    },
    {
      id: "main-stem",
      kind: "stem",
      parentId: "root-repository",
      sourceRefs: c.commits.map((x) => ({ kind: "commit", id: x.sha })),
      metrics: { commitCount: c.commits.length, changeVolume: changes },
      intent: {
        height: 0.55 + 0.4 * phenotype.activity,
        width: 8 + 18 * phenotype.growth,
      },
    },
  ];
  merges.forEach((m, i) =>
    elements.push({
      id: `branch-${i + 1}-${m.sha.slice(0, 8)}`,
      kind: "branch",
      parentId: "main-stem",
      sourceRefs: [{ kind: "commit", id: m.sha }],
      metrics: { parentCount: m.parentShas.length },
      intent: {
        position: (i + 1) / (merges.length + 1),
        side: i % 2 ? "right" : "left",
      },
    }),
  );
  c.commits
    .filter((x) => x.testChanges || x.documentationChanges)
    .forEach((m, i) =>
      elements.push({
        id: `leaf-${i + 1}-${m.sha.slice(0, 8)}`,
        kind: "leaf",
        parentId: "main-stem",
        sourceRefs: [{ kind: "commit", id: m.sha }],
        metrics: {
          testChanges: m.testChanges,
          documentationChanges: m.documentationChanges,
        },
        intent: {
          size: Math.min(
            1,
            0.25 + (m.testChanges * 2 + m.documentationChanges) / 8,
          ),
          type:
            m.testChanges >= m.documentationChanges
              ? "testing"
              : "documentation",
          side: i % 2 ? "right" : "left",
        },
      }),
    );
  const segments = segmentHistory(c);
  segments.forEach((s, i) => {
    const tag = c.tags.find((t) => t.name === s.name),
      fid = `flower-${i + 1}-${sha256(s.name).slice(0, 8)}`;
    elements.push({
      id: fid,
      kind: "flower",
      parentId: "main-stem",
      sourceRefs: [{ kind: tag ? "tag" : "period", id: s.name }],
      metrics: { commitCount: s.commitShas.length },
      intent: { label: s.name, position: (i + 1) / (segments.length + 1) },
    });
    s.commitShas.forEach((sha, j) => {
      const m = c.commits.find((x) => x.sha === sha)!;
      const volume = m.additions + m.deletions,
        ratio = m.deletions / Math.max(1, volume);
      elements.push({
        id: `petal-${i + 1}-${j + 1}-${sha.slice(0, 8)}`,
        kind: "petal",
        parentId: fid,
        sourceRefs: [{ kind: "commit", id: sha }],
        metrics: { changeVolume: volume, deletionRatio: ratio },
        intent: {
          length: Math.min(1, 0.25 + Math.log1p(volume) / 7),
          width: Math.min(1, 0.2 + Math.sqrt(volume) / 20),
          curl: Math.max(0, ratio),
          angle: (360 * j) / Math.max(1, s.commitShas.length),
        },
      });
    });
  });
  reverts.forEach((m, i) =>
    elements.push({
      id: `scar-${i + 1}-${m.sha.slice(0, 8)}`,
      kind: "scar",
      parentId: "main-stem",
      sourceRefs: [{ kind: "commit", id: m.sha }],
      metrics: { deletions: m.deletions },
      intent: { position: (i + 1) / (reverts.length + 1) },
    }),
  );
  return botanicalSceneSchema.parse({
    schemaVersion: 1,
    grammarVersion: o.grammarVersion ?? "mvp-grammar-v1",
    source: {
      repositoryIdentity: c.repository.identity,
      snapshotSha: c.repository.snapshotSha,
      canonicalConfigHash: c.analysis.configHash,
    },
    generation: {
      seed: deriveSeed(c, o),
      scalingMode: o.scalingMode ?? "repository-relative",
    },
    phenotype,
    viewport: { width: 800, height: 1000 },
    elements,
    warnings: [],
  });
}
export function serializeBotanical(v: BotanicalSceneV1): string {
  return `${canonicalJson(botanicalSceneSchema.parse(v))}\n`;
}
