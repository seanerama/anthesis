# Botanical Grammar v2 — architecture assessment

## Decision

**Replace the botanical, geometry, and style layers, incrementally.** Preserve Git collection, the canonical v1 boundary, canonical serialization, provenance, CLI orchestration, SVG authority, viewer, and modular-monolith topology. Botanical Scene v1 remains readable during migration, but it is not expressive enough to be the v2 authoring model. This is not a broader rewrite: the pipeline direction is correct; the three visual stages after canonical analysis are not.

## Investigation performed

On 2026-08-03 the current repository was built, all 18 tests passed, five synthetic portraits and the Anthesis self-portrait were regenerated, and the six SVGs were rasterized for visual inspection. The inspected path was:

```text
test/fixtures/create-histories.sh
  -> collector/git.ts: collectRepository
  -> CanonicalRepositoryV1
  -> botany/model.ts: grow
  -> BotanicalSceneV1
  -> geometry/index.ts: layout
  -> render/svg/index.ts: renderSvg
  -> portrait.svg + provenance sidecar
```

The tests establish a sound deterministic spine. They do not establish botanical quality: exact snapshots currently freeze weak geometry.

## Current strengths

- The one-way modular pipeline and persisted canonical/botanical seams are appropriate. Domain modules do not depend on the viewer.
- `CanonicalRepositoryV1` records stable, sorted Git facts, validates with Zod, and deliberately excludes rendering decisions.
- `canonicalJson` plus SHA-256 gives a simple, inspectable determinism mechanism.
- SVG provenance records snapshot, configuration, grammar, renderer, style, seed, and hashes of both upstream artifacts.
- Git-only collection works without GitHub and handles tags, merge flags, revert detection, rename normalization, path exclusions, contributor aliases, tests, and documentation.
- Synthetic repositories and byte-identical assertions give a safe migration harness.
- SVG is a good authoritative output: vector, printable, accessible, inspectable, and capable of carrying per-feature metadata.

## Where information is lost

| Boundary | Current behavior | Loss or distortion |
|---|---|---|
| Git -> canonical | Only commits reachable from `HEAD`; aggregate numstat per commit; branch refs/topology beyond parent SHAs are absent | Unmerged branches cannot be represented; file-level category magnitude, directory/component structure, rename identity, generated/bot activity, and formatting signals are discarded |
| Canonical -> segmentation | Tags split history; otherwise UTC calendar months | A tag after a long quiet interval can create an empty release; post-last-tag work is dropped; all tags are treated as releases; activity bursts crossing month boundaries split; dormancy inside a month is hidden |
| Analysis -> phenotype | Fixed linear divisors such as commits/24 and changes/500 | Tiny fixtures cluster near zero; large repositories saturate at one; repository-relative mode is declared but not implemented; `review` is permanently zero |
| Phenotype -> botany | Merge = branch, qualifying commit = leaf, segment = flower, commit = petal, revert = scar | Literal cardinality produces malformed blooms and congestion. No episodes, importance, plant-wide morphology, roots, nodes, buds, branch hierarchy, maturity, or archetypes are modeled |
| Botany -> geometry | Every non-root/stem entity becomes a flat `Shape` with x/y/size/width/curl/angle | Parent attachment, topology, contour, orientation, taper profile, veins, petal rings, and occlusion are lost. Root is filtered out entirely |
| Geometry -> SVG | Kind switches emit fixed paths, ellipses, or circles with hard-coded colors | Style and geometry are coupled; leaves and petals are unmodified ellipses; flowers fall through to circles; branches share a fixed curve and do not support their destination |

## Concrete trace: `documentation-heavy`

The fixture creates three commits: one source commit, two documentation commits, and an annotated `v1` tag. Collection yields three commits, one contributor, one tag, and documentation change counts on two commits. `grow` then computes `activity=0.125`, `collaboration=0.125`, `documentation=0.25`, creates one root and one stem, creates **two leaves** (one per documentation commit), creates **one flower** (the release segment), and creates **three petals** (one per commit).

`layout` discards the root, fixes the stem at x=400 from y=880 to y=220, alternates leaf sides at fixed offsets, places the flower at x=300, and distributes three petal centers on a radius of 34. `renderSvg` draws both leaves as detached ellipses, petals as rotated ellipses, the flower fallback as two circles, and the stem with one fixed cubic. The final image communicates “three commits and two documentation touches,” but not a coherent plant. The loss occurs primarily before and within geometry, not in SVG serialization.

The other fixtures expose the same failure modes:

- `steady-growth`: two commits become two opposing elliptical petals, producing a bar-like bloom floating beside the stem.
- `collaborative-release`: a branch exists but terminates below/away from the bloom; three contributors affect only a scalar.
- `major-refactor`: calendar segmentation creates two floating blooms and one detached test leaf; deletion has little compositional effect.
- `chaotic-experimentation`: a revert becomes a slash on the main stem while its episode still becomes an ordinary bloom.
- Anthesis itself: many per-commit petals overlap into an amorphous mass and all leaves float independently.

## Component disposition

| Component | Action | Reason |
|---|---|---|
| TypeScript/Node stack and modular monolith | Preserve | Suitable for deterministic typed models and browser/SVG reuse |
| Git command boundary and stable sorting | Preserve and extend | Correct operational boundary; add richer facts additively or through canonical v2 |
| `CanonicalRepositoryV1` | Preserve frozen; introduce v2 only when facts require it | Existing contract is useful and must not be silently broken |
| Exclusion/alias configuration | Extend | Add generated, bot, formatting, rename, and component reporting; never silently discard totals |
| `analysis/index.ts` | Replace its single clamp with normalization and episode analysis modules | A clamp is not an analysis layer |
| `segmentHistory` in collector | Move and replace | Segmentation is interpretation, not collection; use releases plus activity episodes |
| Phenotype scalar set | Refactor | Retain interpretable axes but compute robust multi-scale profiles and confidence, not fixed divisors |
| Botanical Scene v1 | Preserve as legacy input; replace authoring with v2 | Flat generic elements and free-form intent cannot state botanical morphology or variation bounds |
| `grow` v1 mapping | Replace behind grammar-version dispatch | One-event-to-one-shape mapping is the central semantic failure |
| `Shape` and `Geometry` | Replace | Cannot represent paths, topology, contours, layers, attachment, or bounds |
| SVG provenance contract | Preserve and add fields/version only when necessary | It already protects authoritative reproducibility |
| SVG renderer internals | Refactor | Keep serializer/authority; render typed geometry primitives using style tokens |
| Hard-coded `shape()` switch and colors | Remove after parity window | It couples morphology to output style and forces primitives |
| Viewer and CLI | Preserve and extend | Add version selection and provenance/feature inspection; no SPA is required |
| Exact v1 snapshots | Preserve as legacy tests; add v2 visual baselines | Avoid treating old pixels as v2 acceptance criteria |

## Is the separation sufficient?

The named stages are correct, but two missing boundaries must become explicit:

```text
collection -> canonical facts -> repository analysis
-> development episodes -> phenotype -> botanical scene
-> composition plan -> geometry scene -> style -> SVG
```

Episodes belong after canonical facts and before botanical interpretation. Composition belongs after semantic botanical intent and before final geometry. Style consumes geometry; it must not decide topology or coordinates. Provenance spans every persisted/configured boundary.

## Technical risks

1. **Contract pressure.** Unmerged work and component structure cannot be recovered from canonical v1. Mitigation: implement v2 first from available facts, add canonical v2 through a separate ADR, and represent unavailable facts with capability/confidence metadata.
2. **Determinism drift.** Floating-point math, candidate ordering, or runtime changes can change bytes. Mitigation: named PRNG streams, stable sorting, integer/fixed-precision scoring, coordinate quantization, and pinned runtime.
3. **Solver cost.** Petal-level global collision solving can become quadratic. Mitigation: solve semantic anchors and organ bounds, use a spatial grid, cap candidate counts, then generate local detail.
4. **Overfitting five tiny fixtures.** Their metrics are too small and sparse. Mitigation: ten parameterized synthetic analysis fixtures at multiple scales plus real-repository review artifacts.
5. **False semantics.** Git-only data cannot prove reviews, failed changes, or deleted branches. Mitigation: capability declarations and no invented feature when evidence is unavailable.
6. **Visual regression brittleness.** Exact SVG bytes and visual similarity test different properties. Keep both: bytes for reproducibility, perceptual/diff thresholds for art regressions, semantic invariants for meaning.
7. **Archetype stereotyping.** Species names can imply repository quality. Select from neutral structural axes, expose the mapping, and describe forms rather than ranking repositories.

## Explicit uncertainties and assumptions

- The visual thresholds, 12-unit default budget, 32–64 solver candidates, and blind-review sample are starting hypotheses. Synthetic scale tests and human review must tune them; changing authoritative parameters requires a version change.
- Canonical v1 counts changed **files**, not changed lines, for test/documentation fields. V2 should name that basis accurately until richer classification exists.
- Git numstat and `-M` provide useful rename evidence but not infallible semantic refactor detection. Renewal morphology must be described as change-pattern interpretation, not intent.
- Current collection follows commits reachable from `HEAD` and tags merged into that snapshot. It cannot substantiate deleted or unmerged work, dependency roots, reviews, pull requests, or failed changes. V2 must omit those features unless later Git-only capability data supports them.
- The proposed Aster/Lupine/Vine mapping is architectural art direction, not yet user-validated. Aster is deliberately the only prototype commitment.

## Direct recommendation

Choose **Replace the botanical, geometry, and style layers**. Evolve them behind versioned interfaces and a feature flag while preserving the rest of the system. The evidence does not support a broader rewrite: collection, serialization, provenance, CLI, tests, and SVG authority already perform their intended jobs. Replacing geometry and style alone is insufficient because the current botanical model has already reduced episodes to literal petals/leaves and cannot express the morphology a new geometry engine needs.
