# Botanical Grammar v2 — implementation plan

The migration is additive and feature-flagged. `stage-0-v1` and `mvp-grammar-v1` remain runnable until v2 passes the exit gates. Each increment ends with a working CLI and authoritative legacy output.

## Increment 0 — freeze evidence and quality gates

**Objective:** Preserve current behavior as legacy evidence and add an explicit v2 flag without changing output.

- Files/modules: `src/cli`, `src/botany/model.ts`, tests, review-artifact script.
- Interfaces: `GrammarSelection = "stage-0-v1" | "mvp-v1" | "botanical-v2"`.
- Migration: translate existing booleans at CLI boundary; warn on ambiguous combinations.
- Tests: current exact snapshots unchanged; grammar dispatch; invalid combinations.
- Acceptance: default and MVP v1 bytes remain identical; `--grammar botanical-v2` reports unavailable until increment 2.
- Dependencies: none.
- Risks: feature-flag ambiguity; mitigate with one enum internally.

## Increment 1 — analysis, normalization, and episodes

**Objective:** Turn canonical facts into robust `RepositoryAnalysisV2` and bounded development episodes without rendering them.

- Files/modules: add `src/analysis/model.ts`, `normalization.ts`, `episodes.ts`, `exclusions.ts`; move segmentation responsibility out of collector while retaining the old export for v1.
- Interfaces: `RepositoryAnalysisV2`, `DevelopmentEpisode`, `NormalizedValue`, `SummarizationRecord`, capability flags.
- Migration: adapter consumes `CanonicalRepositoryV1`; do not break frozen canonical v1. Include post-last-tag activity and classify release tags.
- Tests: 1/3/8/20/60-unit histories; no tags; many tags; dormancy; same-time commits; outliers; tiny and huge values; coalescence ledger; exclusions and confidence.
- Acceptance: stable episode IDs/order, maximum visible budget, protected landmarks retained, every source commit represented by an episode or explicit ledger record, byte-identical analysis JSON.
- Dependencies: increment 0.
- Risks: heuristic overfitting; keep versioned parameters and synthetic table tests.

## Increment 2 — botanical scene v2 and Aster recipe

**Objective:** Produce one coherent semantic plant from synthetic analysis before richer Git facts.

- Files/modules: add `src/botany/v2/model.ts`, `interpreter.ts`, `archetypes/aster.ts`, `variation.ts`, `fingerprint.ts`.
- Interfaces: `BotanicalSceneV2`, `PlantIntent`, axis/node/attachment types, flowers/rings/centers/leaves/roots, `VariationRange`.
- Migration: v1 `grow` remains untouched behind dispatch. Do not coerce Scene v2 into Scene v1.
- Tests: schema, acyclic parent graph, chronological nodes, release-to-bloom and unreleased-to-bud mappings, foliage aggregation, root basis, provenance completeness, semantic fingerprint invariance across decorative seeds.
- Acceptance: synthetic 1–3 bloom Aster has a main stem, supporting branches, roots, leaves, sepals, multi-ring flower intent, and no per-commit petals.
- Dependencies: increment 1.
- Risks: free-form intent reappearing; prohibit `Record<string, unknown>` in persisted morphology.

## Increment 3 — deterministic geometry kernel

**Objective:** Convert Aster intent into renderer-independent path geometry.

- Files/modules: add `src/geometry/v2/{model,prng,bezier,axes,leaves,flowers,roots,spatial-index}.ts`.
- Interfaces: `GeometrySceneV2`, cubic/path primitives, width profiles, bounds, local frames.
- Migration: preserve `src/geometry/index.ts` as v1 entry point; add versioned dispatcher.
- Tests: PRNG test vectors; finite/quantized coordinates; taper monotonicity; tangent-continuous attachments; closed contours; petal/leaf non-ellipse assertions; phyllotaxis ordering; source feature references.
- Acceptance: one synthetic plant generates curved tapered stem/root outlines, attached branches, path leaves with veins, flowers with sepals/rings/phyllotactic centers, and deterministic bytes.
- Dependencies: increment 2.
- Risks: numerical instability; use fixed sampling counts, explicit rounding, and no platform-dependent geometry library.

## Increment 4 — composition candidates and scoring

**Objective:** Select coherent plant layout rather than fixed coordinates.

- Files/modules: add `src/composition/{candidate,score,repair,model}.ts`; geometry dispatcher invokes it before detailed contours.
- Interfaces: `CompositionConfig`, `CompositionCandidate`, `CompositionResult`, score component registry.
- Migration: v1 layout unchanged. V2 solver operates on coarse semantic bounds before local geometry.
- Tests: deterministic candidate set/ties; hard overflow/support constraints; score fixtures for collisions, crossings, balance, negative space, annotation clearance; performance ceiling.
- Acceptance: no disconnected supported organ; primary bloom overlap and overflow below specified thresholds; stored component scores reproduce the chosen candidate; coherent output for 1/3/8/20/60 summarized units.
- Dependencies: increments 2–3.
- Risks: scoring to tests instead of aesthetics; retain blind review gate and multiple candidate contact sheets.

## Increment 5 — style tokens and Botanical Plate SVG

**Objective:** Render the same geometry as a contemporary scientific botanical plate.

- Files/modules: add `src/style/model.ts`, `src/style/botanical-plate.ts`, `src/render/svg/v2/{renderer,metadata,serializer}.ts`.
- Interfaces: `StyleTokensV1`, paint-role resolver, `SvgProvenanceV2`.
- Migration: retain SVG provenance v1 for legacy grammar. V2 creates a versioned sidecar with hashes for analysis and geometry. No style values in geometry.
- Tests: Zod style validation, all paint roles resolved, XML validity, accessibility metadata, exact SVG bytes, geometry hash unchanged across styles, print-size/precision assertions, no primary `ellipse` or plain-circle flower.
- Acceptance: Botanical Plate output uses warm paper, fine outlines, restrained palette, veins, layered organs, deterministic vector texture, and remains legible at target print size.
- Dependencies: increments 3–4.
- Risks: renderer smuggling geometry decisions; renderer accepts only concrete primitives and paint roles.

## Increment 6 — traceability and viewer inspection

**Objective:** Preserve art-first output while making major features explainable.

- Files/modules: provenance index, SVG metadata, `viewer/src/main.ts`, viewer styles.
- Interfaces: feature lookup payload and summary-ledger view model.
- Migration: viewer detects provenance version; legacy inspection continues.
- Tests: feature click/keyboard navigation, feature -> episode -> source refs, decorative child ownership, metadata/sidecar equality, no visible legend required for composition.
- Acceptance: every major visible feature resolves to sources/metrics/rule; viewer enhancement does not change authoritative SVG bytes.
- Dependencies: increment 5.
- Risks: metadata bloat; store one indexed canonical block and feature IDs, not repeated commit lists on every path.

## Increment 7 — canonical enrichment within Git-only operation

**Objective:** Improve facts needed for branching/components without making GitHub mandatory.

- Files/modules: collector ref/topology and file-classification modules; propose `CanonicalRepositoryV2` contract before implementation.
- Interfaces: reachable refs, observed unmerged refs, file-level/component aggregates, rename records, generated/bot/format classifications, exclusion report.
- Migration: v1 emitter remains available; analysis v2 capability flags allow gradual adoption.
- Tests: unreachable/deleted limitations, unmerged local refs, rename similarity, generated files, dependency bots, formatting-only commits, aliases, monorepo components.
- Acceptance: unavailable facts are never inferred; every excluded/down-weighted class reports counts and rule; Git-only CLI remains complete offline.
- Dependencies: increment 1; can follow visual prototype rather than block it.
- Risks: Git traversal cost and privacy; use bounded commands, no content persistence by default, and performance fixtures.

## Increment 8 — additional archetypes

**Objective:** Add Lupine and Vine only after Aster quality is proven.

- Files/modules: `src/botany/v2/archetypes/{lupine,vine,selection}.ts`, matching geometry recipes.
- Interfaces: trait compatibility and versioned archetype decision table.
- Migration: Aster remains deterministic fallback. Rule-version changes require grammar version change.
- Tests: decision boundaries/ties, seed independence, neutral explanations, silhouette distinctness.
- Acceptance: archetypes differ structurally, share style tokens, and never depend on a repository quality label.
- Dependencies: increments 2–6; benefits from 7.
- Risks: decorative species catalog; require each archetype to solve a demonstrated phenotype/composition need.

## Synthetic repository suite and expected phenotype

These are data builders, not ten checked-in `.git` directories. Each emits canonical facts with fixed SHAs/times and optionally materializes a Git repository for collector integration.

| Fixture | Expected visible phenotype |
|---|---|
| Steady solo growth | Tall readable main stem, regular nodes, moderate symmetric rhythm, one mature terminal bloom, sparse orderly foliage |
| Broad collaboration | Grouped/radially varied bloom structure, balanced lateral axes, fuller crown; contributor diversity does not merely increase size |
| Large refactor | Strong renewal node, recurved/negative-space petals or pruned lateral, visible scar/knot, subsequent fresh foliage |
| Chaotic experimentation | Asymmetric alternating growth, knots/scars, variable internodes and buds, still compositionally balanced |
| Documentation-heavy | Broad smooth leaves with fine veins distributed along episodes; blooms remain subordinate to foliation |
| Test-heavy | Narrower serrated/lanceolate leaves with pronounced midribs and repeated supporting rhythm |
| Many small releases | Lupine-like compressed release rhythm or clustered florets; no dozens of colliding primary blooms |
| One very large release | One dominant supported mature bloom with richer rings/center, secondary buds restrained |
| Branch-heavy development | Wider hierarchical crown, tangent-attached supporting branches, merge nodes and any observed unmerged work as buds |
| Dormancy then bursts | Long clear internodes/negative space separating dense growth clusters; chronological direction remains readable |

Every fixture has small and large variants and explicit expected ranges, not only pixel snapshots.

## Test matrix

- **Determinism:** two clean processes produce byte-identical analysis, botanical, geometry, SVG, and provenance artifacts; PRNG vectors are pinned.
- **Stable model:** canonicalized JSON snapshots plus semantic fingerprints; schema round trips.
- **Geometry invariants:** finite values, bounds, taper, attachments, topology, closed paths, quantization, layer references.
- **Variation:** same seed same bytes; decorative-seed change moves eligible controls but preserves semantic fingerprint and bounded ranges.
- **Normalization:** zero/one/huge counts, percent clipping, global distribution version, ratios with tiny denominators, all-excluded input.
- **Exclusions:** generated, bot, formatting, binary, rename, alias, patterns; reports reconcile raw = included + excluded/down-weighted as defined.
- **Traceability:** major feature to episode/source and all source facts to an episode/ledger record.
- **Composition:** collision/overflow/crossing limits, balance and negative-space score reproduction, fixed time/candidate budget.
- **Archetypes:** decision table and hash tie-break; decorative seed has no effect.
- **SVG:** XML parse, IDs, ARIA, metadata hashes, no forbidden primary primitives, print constraints.
- **Visual regression:** deterministic PNG rendering in pinned Chromium, perceptual/diff threshold plus human-reviewed baseline updates. Exact SVG snapshots remain the stronger reproducibility gate.

## Smallest visual prototype

Build increments 2–5 against one hand-authored `RepositoryAnalysisV2` containing six episodes, two tagged releases, one unreleased salient episode, mixed documentation/testing foliage, and one renewal landmark. Do not invoke Git collection.

It must render one Aster-like plant with a curved tapered main stem, two tangent-attached branches, one to three supported blooms/buds, path leaves and veins, multi-layer flowers with sepals and phyllotactic center marks, visible hierarchical roots, 32 scored composition candidates, and Botanical Plate styling. Emit botanical JSON, geometry JSON, SVG, provenance, and a contact sheet of the top four candidates for architectural review. Run with two decorative seeds to demonstrate identical semantic fingerprints and bounded visual variation.

Prototype success requires:

1. Five viewers who are not told the Git premise identify it as a plant/botanical illustration; at least four succeed.
2. Reviewers prefer the selected candidate over the median candidate in a blind pairwise comparison more often than chance.
3. All automated geometry, determinism, traceability, and forbidden-primitive gates pass.
4. The plant remains visually effective with annotations disabled.

The prototype is disposable only at the fixture level; its schemas, PRNG, geometry primitives, solver, style tokens, and tests are production increments.

## V2 release acceptance checklist

- Blind botanical recognition gate passes.
- Fixture phenotypes have materially different silhouette descriptors and pass human review.
- 1, 3, 8, 20, and 60 summarized units remain coherent.
- No primary flower is a plain circle; no primary petal or leaf is an unmodified ellipse.
- Branches attach tangentially and terminate at supported organs; main stem is curved and tapered.
- Roots materially contribute to occupied bounds and root/crown balance.
- Decorative variation is deterministic and semantic fingerprint invariant.
- Every major visible feature is traceable to events/metrics/rules.
- Botanical Plate style can be replaced without changing geometry bytes.
- Same snapshot/config/runtime produces byte-identical authoritative output.
- Output succeeds with legend/annotations disabled.
