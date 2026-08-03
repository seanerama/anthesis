# Stage 6: Solve and generate procedural botanical geometry

- **Type:** feature
- **Depends on:** 5
- **Work item:** https://github.com/seanerama/anthesis/issues/10

## Objectives

Turn the typed Aster scene into coherent, style-independent path geometry using a
deterministic candidate composition solver. This stage proves morphology and layout,
not final art direction.

## What to build

- Add `src/composition/{model,candidate,score,repair}.ts`.
- Add `src/geometry/v2/{model,prng,bezier,axes,leaves,flowers,roots,spatial-index}.ts`.
- Generate exactly 32 coarse candidates for the prototype; reject overflow,
  disconnected support, chronology reversal, and severe primary bloom collision.
- Score collision, congestion, crossings, main-stem readability, balance, center of
  gravity, negative space, bloom separation, root/crown balance, and annotation
  clearance with fixed integer weights and stable tie-breaking.
- Generate cubic Bézier centerlines and tapered closed axis contours, tangent-matched
  branches, cubic leaf contours/midribs/veins, layered petal contours, sepals,
  non-circular receptacles, phyllotactic florets, and hierarchical roots.
- Emit canonical `geometry-v2.json` with bounds, selected candidate, component
  scores, layers, paint roles, and semantic fingerprint. No palette or SVG names.

## Interface contracts

- **Exposes:** frozen `contracts/geometry-scene-v2.md`.
- **Consumes:** frozen `contracts/botanical-scene-v2.md` and ADRs 0006–0008.

## Testing requirements

- Exact candidate set/score/selection determinism and stable tie tests.
- Finite quantized coordinates, closed contours, positive monotone taper, acyclic
  layers, tangent-continuous attachments, bounds, and feature-reference invariants.
- Assert primary flower is compound, primary petals/leaves are multi-cubic paths,
  and roots materially affect occupied bounds.
- Collision/overflow/crossing threshold fixtures and performance ceiling using a
  spatial grid.
- Coherent geometry for 1, 3, 8, 20, and 60 pre-summarization units.
- Style-independence test: no color/font/filter/SVG concepts in geometry JSON.
- No UI changes; a diagnostic monochrome renderer may exist only as a test utility.

## Acceptance conditions

- [ ] Kill-switch / dark-launch flag (default OFF) for this net-new feature
- [ ] UI-smoke "observably-works" check authored for any user-facing surface
- [ ] Additive migration only (no destructive schema change)
- [ ] Existing suite stays green; CI all-green
- [ ] Main stem and roots are curved tapered closed contours
- [ ] Every supported branch visibly terminates at its destination anchor
- [ ] Primary petals and leaves cannot be represented as unmodified ellipses
- [ ] Selected candidate has no hard constraint violation and reproducible component scores
- [ ] 1/3/8/20/60-unit inputs remain within collision and overflow limits
- [ ] Geometry bytes are independent of style choice

## Pipeline test: YES

Run the synthetic Aster through botanical and geometry stages twice, compare exact
bytes, and assert all geometry/composition invariants.
