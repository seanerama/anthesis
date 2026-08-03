# Stage 3: Render meaningful deterministic repository portraits

- **Type:** feature
- **Depends on:** 2
- **Work item:** https://github.com/seanerama/anthesis/issues/3

## Objectives

Turn the Stage 2 canonical histories into recognizably different, meaningful plants
that satisfy the Git-only MVP, with explainable mappings and exact deterministic SVG.

## What to build

- Implement bounded normalization and a deterministic phenotype from canonical data.
- Interpret the default branch as a stem; significant merges as side stems; tags or
  fallback months as flowers; commit clusters as petals; tests and documentation as
  differently sized leaves; and reverts as scars.
- Map change volume to capped petal dimensions and deletion ratio to non-negative
  curl/cutout intent.
- Implement stable seed derivation from repository identity, snapshot SHA,
  configuration hash, grammar version, renderer version, and style.
- Expand geometry and authoritative SVG rendering with semantic IDs/source refs.
- Add `analyze`, `grow`, `render`, `portrait`, and `explain` CLI flows over persisted
  artifacts; update the viewer with a legend and source/metric inspection.
- Publish one real Anthesis repository portrait through the existing Render viewer.

## Interface contracts

- **Exposes:** the Git-only repository portrait MVP, inspectable intermediate
  artifacts, a visible legend, and a real-repository deployed example.
- **Consumes:** Stage 2 canonical output and all three frozen v1 contracts. It may add
  optional fields but cannot reinterpret or remove existing fields.

## Testing requirements

- Unit-test normalization bounds, seed inputs, significant-branch thresholds,
  release/month fallback, and every initial visual mapping.
- Snapshot canonical botanical JSON and exact SVG bytes for all five fixtures.
- Assert fixture-level semantic traits rather than relying only on image snapshots.
- Test source traceability from every semantic SVG element to canonical input.
- Add a visual-regression review artifact and a UI smoke that exercises the portrait,
  legend, and one source/metric inspection interaction.
- Run the entire pipeline twice and prove byte-identical structural outputs.

## Acceptance conditions

- [ ] `features.mvpGrammar` gates the expanded grammar, defaults OFF, and preserves
      the Stage 1 renderer as the fallback until Stage 3 is accepted
- [ ] UI-smoke "observably-works" check authored for any user-facing surface
- [ ] Additive migration only (no destructive schema change)
- [ ] Existing suite stays green; CI all-green
- [ ] The five fixture portraits satisfy their documented semantic expectations
- [ ] A real Anthesis snapshot produces a deterministic deployed portrait
- [ ] The viewer legend explains every visual mapping included in this stage

## Pipeline test: YES

CI must generate and retain all fixture portraits and the real-repository portrait as
reviewable artifacts before deployment.
