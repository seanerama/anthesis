# Stage 2: Build Git-only repository analysis

- **Type:** feature
- **Depends on:** 1
- **Work item:** https://github.com/seanerama/anthesis/issues/2

## Objectives

Replace the fixture-minimal collector with useful Git-only analysis across ordinary
local repositories while leaving the Stage 1 renderer and deployment path intact.
Produce trustworthy, inspectable canonical data before adding richer visual grammar.

## What to build

- Read commits, parent topology, authors, timestamps, tags, additions, deletions,
  files changed, merges, renames, and revert signals using Git without forge APIs.
- Identify the default branch robustly and pin analysis to a snapshot SHA.
- Apply configurable path/file/pattern exclusions and report excluded activity.
- Classify test and documentation changes; derive stable contributor identities.
- Segment tagged histories into releases and untagged histories into UTC months.
- Add `anthesis analyze`, and make `portrait` consume its output through the existing
  canonical seam.
- Build the five synthetic history shapes named in the vision as reusable fixtures,
  while keeping visual expectations for Stage 3.

## Interface contracts

- **Exposes:** schema-valid `CanonicalRepositoryV1` for arbitrary local Git
  repositories and stable synthetic fixtures for downstream interpretation.
- **Consumes:** Stage 1 CLI/toolchain and
  `contracts/canonical-repository-model.md`; changes to the frozen v1 shape are
  additive only.

## Testing requirements

- Unit-test default-branch detection, rename handling, revert classification,
  exclusions, file categories, contributor aliases, tag/month segmentation, stable
  ordering, and malformed input/config diagnostics.
- Integration-test real Git subprocess behavior against every synthetic fixture.
- Contract-test every emitted document against CanonicalRepositoryV1.
- Prove excluded files do not influence included counts and repeated analysis is
  byte-identical except for fields the contract explicitly marks informational.
- Keep the Stage 1 deployed-viewer smoke green with its known fixture.

## Acceptance conditions

- [ ] `features.fullAnalysis` gates expanded analysis, defaults OFF, and has an
      explicit CLI/config opt-in until Stage 2 is accepted
- [ ] UI-smoke "observably-works" check authored for any user-facing surface
- [ ] Additive migration only (no destructive schema change)
- [ ] Existing suite stays green; CI all-green
- [ ] Tagged and untagged repositories both produce valid deterministic analysis
- [ ] All five synthetic fixture histories are reproducible from source definitions
- [ ] Git-only limitations and warnings are visible in emitted analysis

## Pipeline test: YES

CI must exercise the platform Git binary and all five generated histories; mocked
Git output alone is insufficient.
