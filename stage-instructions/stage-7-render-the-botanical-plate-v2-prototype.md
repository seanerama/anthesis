# Stage 7: Render the Botanical Plate v2 prototype

- **Type:** feature
- **Depends on:** 6
- **Work item:** https://github.com/seanerama/anthesis/issues/11

## Objectives

Render the v2 Aster geometry as authoritative, traceable Botanical Plate SVG and
validate the new visual direction without switching production defaults.

## What to build

- Add `src/style/model.ts` and `src/style/botanical-plate.ts` with validated palette,
  line, fill, texture, opacity, edge, background, annotation, depth, and print tokens.
- Add `src/render/svg/v2/{renderer,serializer,metadata}.ts`; consume only concrete
  geometry primitives and semantic paint roles.
- Emit `portrait.svg` plus identical canonical provenance sidecar with hashes and all
  grammar/analysis/solver/geometry/style/renderer/PRNG versions.
- Embed one feature provenance index; SVG groups use stable feature IDs for viewer
  inspection. Keep annotations/legend optional and outside plant geometry.
- Add a non-authoritative top-four candidate contact sheet and pinned Chromium PNG
  baseline for review.
- Add a minimal monochrome test style to prove geometry/style separation.
- Do not change the default grammar. Publish the prototype only through the explicit
  v2 flag/review-artifact command.

## Interface contracts

- **Exposes:** frozen `contracts/svg-provenance-v2.md`; Botanical Plate style token
  API; explicit v2 review artifact.
- **Consumes:** frozen `contracts/canonical-repository-model.md`,
  `contracts/repository-analysis-v2.md`, `contracts/botanical-scene-v2.md`, and
  `contracts/geometry-scene-v2.md`; ADRs 0008 and 0010.

## Testing requirements

- Byte-identical SVG/provenance in two clean executions and XML/ARIA validity.
- All semantic paint roles resolve; geometry hash is identical under Botanical Plate
  and monochrome styles.
- Assert no primary flower/center is a plain circle and no primary petal/leaf is an
  ellipse element; validate line/precision/physical print constraints.
- Feature -> botanical intent -> episode -> source ref traceability test.
- Pinned-browser visual regression with reviewed threshold and contact-sheet smoke.
- Author a viewer/review-artifact smoke that loads the v2 SVG under the flag, checks
  metadata, and confirms it remains legible with annotations disabled.
- Conduct the five-person blind recognition check recorded in the prototype brief;
  at least four must identify botanical subject matter without the Git explanation.

## Acceptance conditions

- [ ] Kill-switch / dark-launch flag (default OFF) for this net-new feature
- [ ] UI-smoke "observably-works" check authored for any user-facing surface
- [ ] Additive migration only (no destructive schema change)
- [ ] Existing suite stays green; CI all-green
- [ ] Botanical Plate SVG and provenance are byte-identical across clean runs
- [ ] Geometry JSON/hash is identical across Botanical Plate and monochrome styles
- [ ] Every major visible feature is interactively traceable
- [ ] Output passes forbidden-primitive, collision, print, validity, and visual-regression gates
- [ ] At least four of five blind viewers recognize a botanical illustration
- [ ] Artwork remains effective with legend and annotations disabled
- [ ] Production default remains legacy until a separate promotion stage is accepted

## Pipeline test: YES

Run synthetic analysis through botanical interpretation, composition, geometry, and
both SVG styles; verify exact artifacts and execute the explicit v2 viewer smoke.
