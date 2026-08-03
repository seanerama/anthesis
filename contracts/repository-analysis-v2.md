# Contract: repository-analysis-v2

- **Status:** frozen v1
- **Owner:** `analysis/v2`

## Exposes

Canonical JSON emitted by the v2 analysis pipeline and consumed by Botanical
Grammar v2. It summarizes canonical Git facts into normalized signals and bounded
development episodes without introducing botanical, geometry, or style decisions.

## Consumes

`CanonicalRepositoryV1`, analysis configuration, normalization reference-data
version, episode-algorithm version, and explicit capability declarations.

## Schema / wire

The complete TypeScript-oriented shape is defined in
`docs/botanical-grammar-v2/schema.md` under `RepositoryAnalysisV2`. Required
top-level fields are:

```ts
type RepositoryAnalysisV2 = {
  schemaVersion: 2;
  source: { repositoryIdentity: string; snapshotSha: string;
    canonicalSchemaVersion: number; canonicalSha256: string; configHash: string };
  capabilities: string[];
  period: { start: string; end: string; activeDays: number };
  totals: ChangeProfile;
  contributors: ContributorProfile;
  chronology: ChronologyProfile;
  releases: ReleaseLandmark[];
  landmarks: Landmark[];
  episodes: DevelopmentEpisode[];
  phenotype: RepositoryPhenotype;
  exclusions: ExclusionReport;
  summarization: SummarizationRecord[];
  warnings: AnalysisWarning[];
};
```

Episodes are ordered by ordinal and time; source references use stable kind/id
ordering. All normalized values are finite in `[0,1]`, include confidence and the
normalization basis, and never form an overall repository score. Every included
commit appears in an episode or an explicit summarization record. Unknown facts are
represented by absent capabilities and warnings, never inferred. Serialization is
canonical JSON plus one newline.

## Versioning

Frozen at **v1**. Changes are **additive only** — a breaking change is a NEW
contract, not an edit (framework-spec §4.3). Every consumer depends on this shape.
