import { z } from "zod";
import { canonicalJson } from "../../shared/canonical-json.js";

const sourceRefSchema = z.object({ kind: z.enum(["repository", "commit", "tag", "ref", "period"]), id: z.string().min(1) }).strict();
const changeProfileSchema = z.object({
  commits: z.number().int().nonnegative(), additions: z.number().int().nonnegative(), deletions: z.number().int().nonnegative(),
  filesChanged: z.number().int().nonnegative(), tests: z.number().int().nonnegative(), documentation: z.number().int().nonnegative(),
  generated: z.number().int().nonnegative(), formatting: z.number().int().nonnegative(), renames: z.number().int().nonnegative(),
  byComponent: z.array(z.object({ componentId: z.string(), share: z.number().min(0).max(1) }).strict())
}).strict();
const normalizedValueSchema = z.object({ raw: z.number().finite(), transformed: z.number().finite(), repositoryRelative: z.number().min(0).max(1), globalPercentile: z.number().min(0).max(1).optional(), clipped: z.boolean(), confidence: z.number().min(0).max(1) }).strict();
const contributorProfileSchema = z.object({ count: z.number().int().nonnegative(), effectiveCount: z.number().finite().nonnegative(), entropy: z.number().min(0).max(1), ids: z.array(z.string()) }).strict();
const provenanceSchema = z.object({ sourceRefs: z.array(sourceRefSchema), metricRefs: z.array(z.object({ metricId: z.string(), value: z.number().finite(), normalization: z.enum(["raw", "ratio", "repository-relative", "global-percentile"]), distributionVersion: z.string().optional(), inputs: z.array(sourceRefSchema) }).strict()), summaryRef: z.string().optional(), derivation: z.string(), confidence: z.number().min(0).max(1), capabilities: z.array(z.string()) }).strict();
const axisSchema = z.object({ value: z.number().min(0).max(1), confidence: z.number().min(0).max(1), metricRefs: z.array(z.string()) }).strict();

export const repositoryAnalysisV2Schema = z.object({
  schemaVersion: z.literal(2),
  source: z.object({ repositoryIdentity: z.string(), snapshotSha: z.string(), canonicalSchemaVersion: z.number().int(), canonicalSha256: z.string().regex(/^[0-9a-f]{64}$/), configHash: z.string().regex(/^[0-9a-f]{64}$/) }).strict(),
  capabilities: z.array(z.enum(["reachable-commits", "tags", "merge-parents", "file-categories", "branch-refs", "unmerged-refs", "components", "dependencies"])),
  period: z.object({ start: z.string(), end: z.string(), activeDays: z.number().int().nonnegative() }).strict(),
  totals: changeProfileSchema,
  contributors: contributorProfileSchema,
  chronology: z.object({ activeDays: z.number().int().nonnegative(), spanDays: z.number().int().positive(), inactivityGaps: z.number().int().nonnegative(), medianGapDays: z.number().finite().nonnegative(), maxGapDays: z.number().finite().nonnegative() }).strict(),
  releases: z.array(z.object({ id: z.string(), name: z.string(), occurredAt: z.string(), targetSha: z.string(), sourceRefs: z.array(sourceRefSchema), protected: z.literal(true) }).strict()),
  landmarks: z.array(z.object({ id: z.string(), kind: z.enum(["release", "revert", "change-volume"]), occurredAt: z.string(), sourceRefs: z.array(sourceRefSchema), protected: z.literal(true) }).strict()),
  episodes: z.array(z.object({ id: z.string(), ordinal: z.number().int().positive(), interval: z.object({ start: z.string(), end: z.string(), durationDays: z.number().int().positive() }).strict(), boundary: z.object({ start: z.enum(["repository-start", "release", "dormancy", "density-valley", "landmark"]), end: z.enum(["repository-end", "release", "dormancy", "density-valley", "landmark"]) }).strict(), releaseRefs: z.array(sourceRefSchema), sourceRefs: z.array(sourceRefSchema), metrics: changeProfileSchema, normalized: z.record(normalizedValueSchema), contributors: contributorProfileSchema, salience: z.object({ release: z.number().min(0).max(1), volume: z.number().min(0).max(1), contributorNovelty: z.number().min(0).max(1), topology: z.number().min(0).max(1), reversal: z.number().min(0).max(1), categoryShift: z.number().min(0).max(1), duration: z.number().min(0).max(1), protected: z.boolean() }).strict(), character: z.array(z.enum(["steady", "burst", "renewal", "collaborative", "documentary", "testing"])), status: z.enum(["released", "unreleased"]), summarizedFrom: z.array(z.string()), provenance: provenanceSchema }).strict()),
  phenotype: z.object({ axes: z.object({ stature: axisSchema, tempo: axisSchema, ramification: axisSchema, collaboration: axisSchema, renewal: axisSchema, resilience: axisSchema, seasonality: axisSchema, releaseRhythm: axisSchema, modularity: axisSchema, foliation: z.object({ testing: axisSchema, documentation: axisSchema }).strict() }).strict(), noOverallScore: z.literal(true) }).strict(),
  exclusions: z.object({ configured: z.array(z.string()), excludedChanges: z.number().int().nonnegative(), unsupported: z.array(z.string()) }).strict(),
  summarization: z.array(z.object({ id: z.string(), operation: z.enum(["cluster", "split", "merge-small", "coalesce-budget", "protect-landmark"]), inputRefs: z.array(sourceRefSchema), inputEpisodeIds: z.array(z.string()), outputEpisodeIds: z.array(z.string()), reasonCode: z.string(), discardedDetail: z.array(z.enum(["per-commit-shape", "exact-bin", "minor-landmark"])) }).strict()),
  warnings: z.array(z.object({ code: z.string(), message: z.string(), sourceSha: z.string().optional() }).strict())
}).strict();

export type RepositoryAnalysisV2 = z.infer<typeof repositoryAnalysisV2Schema>;
export type ChangeProfile = z.infer<typeof changeProfileSchema>;
export type ContributorProfile = z.infer<typeof contributorProfileSchema>;
export type SourceRef = z.infer<typeof sourceRefSchema>;
export function serializeRepositoryAnalysisV2(value: RepositoryAnalysisV2): string { return `${canonicalJson(repositoryAnalysisV2Schema.parse(value))}\n`; }
