import { z } from "zod";
import { canonicalJson } from "../shared/canonical-json.js";

const sha = z.string().regex(/^[0-9a-f]{40}$/);
const nonnegativeInteger = z.number().int().nonnegative();
export const canonicalRepositorySchema = z.object({
  schemaVersion: z.literal(1),
  repository: z.object({ identity: z.string().min(1), defaultBranch: z.string().min(1), snapshotSha: sha }),
  analysis: z.object({ mode: z.literal("git-only"), generatedAt: z.string().datetime(), configHash: z.string().regex(/^[0-9a-f]{64}$/), exclusions: z.array(z.string()) }),
  period: z.object({ start: z.string().datetime(), end: z.string().datetime() }),
  contributors: z.array(z.object({ id: z.string(), displayName: z.string(), aliases: z.array(z.string()) })),
  commits: z.array(z.object({ sha, parentShas: z.array(sha), authorId: z.string(), authoredAt: z.string().datetime(), additions: nonnegativeInteger, deletions: nonnegativeInteger, filesChanged: nonnegativeInteger, testChanges: nonnegativeInteger, documentationChanges: nonnegativeInteger, excludedChanges: nonnegativeInteger, isMerge: z.boolean(), isRevert: z.boolean() })),
  tags: z.array(z.object({ name: z.string(), targetSha: sha, occurredAt: z.string().datetime() })),
  warnings: z.array(z.object({ code: z.string(), message: z.string(), sourceSha: sha.optional() }))
}).strict();
export type CanonicalRepositoryV1 = z.infer<typeof canonicalRepositorySchema>;
export function serializeCanonical(value: CanonicalRepositoryV1): string { return `${canonicalJson(canonicalRepositorySchema.parse(value))}\n`; }
