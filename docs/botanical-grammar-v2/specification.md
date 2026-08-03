# Botanical Grammar v2 specification

## Product intent

Anthesis produces a botanical portrait whose silhouette and internal rhythm emerge from repository history. It is generative artwork first and an explorable record second. A distant viewer should see a coherent plant; a close viewer should discover traceable history. No quality score, moral ranking, or fabricated forge fact is permitted.

The authoritative transformation is:

```text
Git facts -> normalized signals -> development episodes -> repository phenotype
-> archetype recipe -> botanical scene -> composition candidates
-> geometry scene -> style tokens -> deterministic SVG
```

## Three classes of input

- **Semantic:** facts and derived signals that may change feature count or meaning: episode boundaries, release count, significant merged branches, observed unmerged refs, tests/docs share, deletion episodes, reverts, contributors.
- **Structural:** grammar decisions constrained by semantics: stem hierarchy, organ allocation, petal-ring count, leaf arrangement, bloom maturity, root architecture, allowable attachment intervals.
- **Decorative:** seeded choices inside declared bounds: sub-pixel contour jitter, petal length offsets, vein placement, texture marks, minor rotations. Decorative seed changes must not add/remove/reparent semantic organs or alter their source references.

## Visual summarization

### Development episode

A development episode is a maximal, chronologically ordered cluster of included repository activity representing one sustained growth phase. It has a stable ID, time interval, source refs, aggregate metrics, contributor distribution, change-type distribution, release boundary relation, salience, confidence, and recorded omissions.

### Detection algorithm

1. Sort commits by authored time then SHA, preserving graph facts separately.
2. Mark hard boundaries at qualifying release tags. A configurable tag classifier accepts semver/release patterns; non-release tags remain landmarks.
3. Compute consecutive time gaps. A soft boundary occurs when a gap exceeds `max(14 days, 3 * median positive gap)`; use deterministic duration arithmetic.
4. Within each release interval, detect activity-density valleys using fixed UTC bins chosen from history span (day/week/month). Split only when both sides meet minimum evidence (default two commits or 5% interval volume).
5. Keep significant merge/revert/large-change landmarks in the containing episode; a landmark may force a boundary only when its robust z-score exceeds the configured threshold.
6. Merge adjacent micro-episodes below the evidence floor into the nearest neighbor using temporal distance, then metric-profile distance, then earlier episode as deterministic tie-break.
7. If there are no releases, gaps and density valleys define episodes. If there is one commit, emit one episode. Always include post-last-release activity as an unreleased episode.
8. If episode count exceeds the visual budget, hierarchically coalesce the least-salient adjacent pair. Store every coalescence in a summarization ledger.

Default visible budgets are scale-sensitive: 1–8 episodes map directly; 9–20 become primary and secondary nodes; 21–60 coalesce to at most 12 visible units while retaining landmark buds/scars; larger histories use the same cap unless an alternate composition format is selected.

### Salience and preservation

Salience is a vector, not a quality score. Components include release boundary, robust change-volume percentile, contributor novelty, merge/revert landmark, category shift, and duration. Major releases, the largest robust change episode, and explicit reverts are protected from coalescence. Small commits contribute to episode aggregates and texture/density; they do not become individual petals.

Every episode records `sourceRefs`, exact aggregate formulas, exclusions, and `summarizedFrom`. The summarization ledger records input IDs, operation, retained feature ID, discarded detail classes, and reason. Thus information is compressed but never silently lost.

## Metric and phenotype model

The phenotype is a set of independent interpretable axes with value, confidence, local/global context, and evidence—never one score.

Recommended axes:

- `stature`: log-scaled included activity and active span
- `tempo`: cadence and burstiness
- `ramification`: significant branch/merge topology
- `collaboration`: effective contributor diversity using entropy, not raw count alone
- `renewal`: deletion/refactor share with rename awareness
- `resilience`: revert/scar pattern (descriptive, not “bad”)
- `foliation.testing` and `foliation.documentation`: category shares and continuity
- `seasonality`: active/dormant rhythm
- `releaseRhythm`: count, spacing, and size distribution
- `modularity`: component distribution when canonical facts support it

For a positive measure `x`, compute `log1p(x)`. Repository-relative values use robust ranks or median/MAD within episodes. Globally comparable values use versioned reference distributions bundled with the grammar; values are percentile-clipped (default 2nd–98th) and mapped to [0,1]. Both values may be stored; rendering selects one mode. Ratios use shrinkage toward a declared prior for tiny samples. Outliers remain landmarks even when their size is clipped.

Tiny repositories receive minimum viable morphology and low-confidence signals, not near-invisible plants. Large repositories saturate detail budgets rather than geometry. Hundreds of releases are clustered by release eras while protected major releases remain blooms. Solo/collaborative differences affect symmetry and grouping, not attractiveness. Deletion-dominant work affects contour curl, negative space, scars, and root/stem renewal without shrinking the plant into nothing. Documentation and testing affect distinct leaf morphology and distribution, not raw leaf count.

Generated paths, dependency bots, formatting-only commits, binary churn, and configured exclusions are separately reported as excluded/down-weighted/unknown. Renames use Git similarity results and do not count as deletion plus addition where recoverable. Contributor aliases are resolved before entropy. Monorepositories derive component profiles from stable top-level/module boundaries and allocate branch clusters without drawing every package. All heuristics and reference-distribution versions enter the configuration hash.

## Botanical intermediate representation

Botanical Scene v2 expresses biological intent, topology, provenance, and bounded variation, but contains no SVG commands, colors, fonts, pixels, or filter IDs.

- Plant phenotype defines stature, habit, symmetry tendency, density, seasonality, root/crown ratio, archetype recipe, and confidence.
- Axial organs form a tree of roots, main stem, secondary stems, and growth nodes. Attachments use parent axis plus normalized arc position and tangent-relative angle.
- Terminal/lateral organs include leaves, buds, flowers, scars, knots, and thorns.
- A flower owns maturity, orientation, receptacle, sepals, one or more petal-ring specifications, materialized individual petal intents, and center/floret/seed arrangements.
- Individual petals and leaves describe contour controls and biological landmarks. Their concrete cubic paths belong to geometry, keeping the botanical model independent of SVG while preserving per-organ morphology and interaction IDs.
- Every major organ owns provenance and a `VariationEnvelope` keyed by semantic ID.

The TypeScript-oriented contract is in `schema.md`.

## Archetype model

Archetypes are neutral structural recipes, not labels of repository merit. V2 begins with three composable families:

| Recipe | Repository phenotype | Structural traits |
|---|---|---|
| **Aster** | Several release/episode landmarks; steady or moderately distributed activity | Branched herbaceous habit, one to three composite radial blooms, visible disk florets, alternate leaves |
| **Lupine** | Many compact episodes, contributor/component grouping, rhythmic bursts | Upright raceme; episodes group into florets along an axis; palmate foliage; good high-count compression |
| **Vine** | Branch-heavy, irregular, long-lived or burst/dormancy history | Climbing curved axes, tendrils/buds, distributed small blooms, asymmetric negative space |

The initial prototype implements Aster only. Aster validates the hardest shared primitives—tapered axes, branch attachment, path petals, rings, centers, leaves, roots—before selection complexity is introduced.

Archetypes are composable at the trait level, not by pasting species together. A recipe declares compatible `growthHabit`, `inflorescence`, `phyllotaxy`, `rootHabit`, and contour families. Semantic phenotype selects a primary recipe using a versioned decision table and stable tie-break hash. Near-boundary cases may borrow compatible secondary traits. Decorative seed never selects the primary archetype. Structural properties include topology, inflorescence, phyllotaxy, organ budgets, and attachment rules; palette, hatch, edge, and line are style properties.

## Morphological mapping

- Default-branch history forms the main axis; chronological position maps monotonically from root collar to apex.
- Significant merged topology forms supported lateral axes. If canonical data cannot establish a branch, the scene must not claim one.
- Observed unmerged refs become terminal buds with capability/confidence metadata. Canonical v1 cannot supply them, so v2-from-v1 emits none.
- Releases become mature blooms or protected florets depending on archetype and count. Unreleased salient episodes become buds or opening blooms.
- Episode composition determines petal-ring traits; no petal corresponds to a single commit. Contributor distribution influences controlled radial grouping/asymmetry.
- Tests produce narrower, serrated or lanceolate foliage with strong venation; documentation produces broader, smoother foliage. Mixed episodes interpolate contour families.
- Deletion/refactor share shapes recurvature, lacunae, pruning nodes, and reduced local density. Reverts produce scars/knots only when observed.
- Roots reflect history span and, when supported, component/dependency foundations. Until dependencies exist in canonical data, root branching uses component/activity stability and declares that derivation.

## Geometry system

### Axes and attachments

Stems and roots are cubic Bézier chains parameterized by arc length. A centerline has points, tangents, growth nodes, and a monotone taper profile. The rendered stem is a closed outline formed from sampled normals, not a constant-width stroke. Curvature and lean come from phenotype plus bounded variation. Branch start tangent matches the parent tangent, then bends toward its destination anchor; base width is limited by parent width and tapers to the supported organ. Branch duration/significance controls length and thickness. The axis tree establishes back-to-front ordering; crossings incur solver penalties and explicit occlusion order.

### Flowers

A flower uses a local coordinate frame attached to its support tangent. Each ring declares petal count range, radial offset, phase, overlap, length/width profiles, and curvature. A petal is a closed cubic contour from basal left/right points through shoulder and tapered tip controls; a separate centerline controls cup/reflex. Rings render back-to-front, with bounded radial asymmetry and deterministic overlap. Sepals sit behind the corolla. Centers use phyllotactic florets/seeds (`angle = n * goldenAngle`) clipped to a non-circular receptacle contour. Orientation foreshortens the local frame; maturity controls enclosure, spread, and center visibility. Primary flowers and centers are compound paths/groups, never plain circles.

### Leaves

A leaf grows from a node in a tangent-relative frame. Two cubic margins join base to tip around a curved midrib. Contour family controls lanceolate/ovate/serrated/lobed shape. Secondary veins branch from sampled midrib arc positions and terminate before the margin. Scale and angle derive from foliation signals and local space; deterministic variation affects minor angle, contour, and veins. A petiole visibly joins the parent axis.

### Roots

Roots are a downward hierarchical axis tree with a primary root and laterals. Root/crown ratio contributes to balance. Branch density reflects supported foundation/component signals; otherwise it derives from activity continuity and is labeled as such. Roots taper faster than stems, curve around occupied bounds, and may be partially interrupted by a baseline convention in styles that request it.

## Deterministic organic variation

Use a small specified PRNG with cross-runtime test vectors (recommended `xoshiro128**` seeded from four 32-bit words of SHA-256). Never consume one global random stream sequentially. Derive named streams by hashing:

```text
master structural seed = H(snapshot, canonical config, grammar, composition config)
decorative seed         = configured value or H(master, "decorative")
stream                  = H(seed, semanticFeatureId, concern, algorithmVersion)
```

Named concerns include `stem/wave`, `branch/bend`, `flower/ring/rotation`, `petal/{id}/contour`, `leaf/{id}/angle`, `vein/{id}`, `root/{id}/direction`, and `texture/{id}`. Adding texture marks cannot shift petal geometry because streams are isolated. Values are sampled only inside scene-declared envelopes. Quantize authoritative coordinates (default 0.001 scene units) and scores before comparison.

Changing only decorative seed may alter petal length within its envelope, rotations within ring constraints, leaf angles, veins, root meander, and texture. It may not alter episode ordering/count, release representation, archetype, axial topology, parentage, major organ count, or source references. A semantic fingerprint excluding decorative fields enforces this.

## Composition solver

V2 uses **deterministic candidate generation and scoring with greedy local repair**. This is simpler to inspect and stabilize than force simulation or annealing and gives predictable TypeScript performance.

1. Generate 32–64 candidates from named structural streams. Each proposes global lean, crown scale, main-axis controls, bloom side/order, branch attachment intervals, leaf phyllotactic phase, and root spread.
2. Build coarse organ bounds and branch polylines; use a uniform spatial grid for overlap queries.
3. Score with fixed integer weights. Hard invalidity covers canvas overflow, reversed chronological nodes, unsupported destination, disconnected organ, or primary bloom overlap above threshold.
4. Soft costs cover bloom/petal collision, leaf congestion, branch crossing, stem occlusion, left/right mass imbalance, center-of-gravity distance, negative-space variance, bloom separation, root/crown imbalance, and annotation clearance. Reward readable main-stem length and bounded silhouette variety.
5. Select lowest score; ties resolve by candidate index. Apply a fixed number of greedy repairs to leaves and small buds only. Re-score and retain the better result.
6. Persist candidate count, selected index, component scores, weights/version, rejected hard constraints, and final bounds in geometry provenance.

Flower internal rings use local collision rules after global anchor selection. At 20 or 60 episodes the solver still sees a bounded number of major organs because summarization occurs first.

## Style architecture: Botanical Plate

Geometry outputs paths, layers, semantic roles, bounds, and optional normalized texture regions. A style resolves semantic roles to paint; it cannot change coordinates, topology, or provenance.

Initial `BotanicalPlateStyleV1` tokens:

- Background: warm paper `#F3EBDD`; optional subtle deterministic fiber marks below the plant.
- Ink: near-black umber `#2B2924`; outlines 0.7–1.4 pt at print scale; interior veins 0.35–0.65 pt.
- Stem/root fills: restrained olive and umber families; foliage uses two related greens; blooms use one muted accent family plus ochre centers. Palette assignment is semantic-role based.
- Fill: flat or two-tone layered fills; no generic gradients. Small deterministic stipple/hatch masks may be clipped to paths.
- Edge: round joins where botanical, tapered contour geometry, slight bounded contour modulation—not SVG blur.
- Opacity: primary organs 0.88–1; rear petals/sepals 0.72–0.92; texture 0.08–0.2.
- Depth: layer order, overlap, line-weight hierarchy, and sparse offset hatching; no raster drop shadow.
- Annotation: optional humanist serif/sans pair supplied as explicit font stack, 8–11 pt; labels remain outside authoritative plant geometry and reserve solver clearance.
- Print: CSS physical-size metadata, viewBox-independent point-equivalent widths, minimum 300-DPI-safe texture spacing, no reliance on screen blend behavior.

Style token and renderer versions enter provenance. Future ink, nocturne, or monochrome styles reuse exactly the same `GeometrySceneV2`.

## Traceability and interaction

Every major botanical feature carries `featureId`, `semanticRole`, `sourceRefs`, `derivedMetricRefs`, and `summaryRef`. Geometry primitives carry `featureId` but do not duplicate all source facts. SVG groups emit stable IDs plus `data-feature-id`; a canonical metadata index maps feature IDs to provenance records. The viewer can traverse feature -> botanical intent -> episode -> commits/tags/configured exclusions. Minor decorative marks reference their owning feature and need no direct Git event.

Major features are stems, branches, roots, leaves/leaf clusters, buds, flowers, scars, knots, and thorns. Individual florets/veins are explainable as grammar-generated children, not falsely attributed to commits.

## Validation gates

The v2 grammar is not the default until all acceptance criteria in `implementation-plan.md` pass, including blind botanical recognition, distinct fixture silhouettes, coherent 1/3/8/20/60-unit scenes, path-based primary organs, attached support topology, visible roots, semantic fingerprint stability across decorative seeds, byte-identical output, traceability, and style-independent geometry.
