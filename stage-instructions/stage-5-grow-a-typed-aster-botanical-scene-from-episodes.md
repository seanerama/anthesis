# Stage 5: Grow a typed Aster botanical scene from episodes

- **Type:** feature
- **Depends on:** 4
- **Work item:** https://github.com/seanerama/anthesis/issues/9

## Objectives

Interpret episodes as one coherent, typed Aster plant before any coordinates or SVG
are generated. Prove semantic morphology, provenance, and deterministic variation
bounds using synthetic analysis data.

## What to build

- Add `src/botany/v2/model.ts`, `interpreter.ts`, `variation.ts`,
  `fingerprint.ts`, and `archetypes/aster.ts`.
- Implement typed plant habit, root systems, axes, nodes, tangent-relative
  attachments, leaves, buds, flowers, rings, individual petals/florets, sepals,
  scars, knots, and thorns.
- Map episodes to a bounded organ budget: releases to mature blooms, salient
  unreleased work to buds/opening blooms, tests/docs to aggregated foliage, renewal
  to contour intent/negative space, and observed reverts to scars.
- Derive named structural/decorative streams using the specified PRNG and store typed
  variation envelopes; do not generate geometry yet.
- Compute a semantic fingerprint excluding decorative values.
- Check in the six-episode Aster synthetic analysis fixture described in the
  prototype recommendation.

## Interface contracts

- **Exposes:** frozen `contracts/botanical-scene-v2.md`.
- **Consumes:** frozen `contracts/repository-analysis-v2.md` and ADRs 0005, 0006,
  and 0009.

## Testing requirements

- Zod boundary, canonical serialization, stable IDs, parent-before-child order, and
  byte-identical output.
- Acyclic axes, valid parent node attachments, monotonic chronology, bounded organ
  counts, provenance for every major feature, and no per-commit petal allocation.
- PRNG cross-runtime test vectors and named-stream isolation.
- Two decorative seeds must preserve semantic fingerprint, archetype, features,
  topology, episode order, and source refs while changing eligible bounded values.
- Legacy v1 scene and SVG regression snapshots unchanged when flag is off.
- No UI changes; botanical JSON schema/semantic fingerprint is the smoke artifact.

## Acceptance conditions

- [ ] Kill-switch / dark-launch flag (default OFF) for this net-new feature
- [ ] UI-smoke "observably-works" check authored for any user-facing surface
- [ ] Additive migration only (no destructive schema change)
- [ ] Existing suite stays green; CI all-green
- [ ] Synthetic Aster contains roots, curved-axis intent, supported branches, leaves, one to three blooms/buds, sepals, rings, petals, and florets
- [ ] Every major feature resolves to episodes/source refs/metrics/rules
- [ ] Decorative seed changes do not change semantic structure
- [ ] Botanical scene contains no coordinates, SVG commands, colors, fonts, or filters
- [ ] Legacy pipeline remains byte-identical with the v2 flag OFF

## Pipeline test: YES

Run the checked-in synthetic analysis through botanical interpretation twice and
validate exact bytes, topology, provenance, and decorative-seed isolation.
