# Stage 4: Summarize repository history into development episodes

- **Type:** feature
- **Depends on:** 3
- **Work item:** https://github.com/seanerama/anthesis/issues/8

## Objectives

Create a deterministic, renderer-independent analysis layer that converts canonical
Git facts into normalized development episodes. This is the first v2 dark-launched
slice and must not alter legacy portraits.

## What to build

- Add `src/analysis/v2/model.ts`, `normalization.ts`, `episodes.ts`,
  `phenotype.ts`, and serialization/validation.
- Consume `CanonicalRepositoryV1`; emit `RepositoryAnalysisV2` canonical JSON.
- Segment on qualifying releases, robust inactivity gaps, and density valleys;
  include post-last-release work and no-release histories.
- Coalesce micro/high-count episodes to a bounded visual budget while protecting
  releases, reverts, and robust change landmarks.
- Record capability flags, confidence, normalization bases, exclusions, and every
  aggregation in a summarization ledger.
- Add `--grammar botanical-v2`/internal enum dispatch behind a default-off flag, but
  stop after writing the analysis artifact in this stage.
- Keep `segmentHistory` and all v1 outputs unchanged for legacy grammar paths.

## Interface contracts

- **Exposes:** frozen `contracts/repository-analysis-v2.md`.
- **Consumes:** frozen `contracts/canonical-repository-model.md`; the normalization,
  episode, and phenotype rules in `docs/botanical-grammar-v2/specification.md`.

## Testing requirements

- Schema and canonical-byte determinism in two clean executions.
- Synthetic histories with 1, 3, 8, 20, and 60 source units; tiny/huge/outlier
  values; no tags; many tags; post-last-tag work; dormancy; same-time commits.
- Assert stable episode IDs/order, protected landmarks, visual budget, finite bounded
  normalization, and source-to-episode/ledger coverage.
- Assert repository-relative and globally comparable modes record their basis and
  do not produce a quality score.
- Regression tests proving existing canonical, botanical v1, and SVG snapshots are
  byte-identical while the flag is off.
- No UI changes; document the CLI artifact check as the observable smoke.

## Acceptance conditions

- [ ] Kill-switch / dark-launch flag (default OFF) for this net-new feature
- [ ] UI-smoke "observably-works" check authored for any user-facing surface
- [ ] Additive migration only (no destructive schema change)
- [ ] Existing suite stays green; CI all-green
- [ ] `RepositoryAnalysisV2` is schema-valid and byte-identical across clean runs
- [ ] Every included commit is represented by an episode or ledger record
- [ ] 60 input units summarize within the configured visual budget without losing protected landmarks
- [ ] Unsupported facts are capability-gated and never inferred
- [ ] Legacy portrait bytes remain unchanged with the v2 flag OFF

## Pipeline test: YES

Run a real Git fixture through collection and v2 analysis twice, compare exact
bytes, and validate the resulting contract. No viewer/deployment surface is changed.
