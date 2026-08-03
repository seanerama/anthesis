# Assessment: Solve and generate procedural botanical geometry

## Decision

**ACCEPT as Stage 6, dependent on Stage 5.** Composition and path morphology form one
cohesive stage because the selected support anchors determine the local geometric
frames; final paint and SVG remain separate.

## Claim / reality verification

| Architecture claim | Live repository reality | Planning effect |
|---|---|---|
| Layout must solve composition | `layout` fixes stem x/y, alternates sides, and uses index offsets | Add bounded candidate generation, scoring, and persisted score evidence |
| Branches must support destinations | Branch paths use one fixed quadratic and do not target blooms | Derive tangent-matched axes from parent attachment to organ anchor |
| Primary organs require botanical contours | Geometry is a flat `Shape`; renderer emits circles/ellipses | Produce cubic closed contours, veins, rings, sepals, florets, and roots |
| Roots contribute to composition | Geometry filters root elements out | Generate hierarchical root axes and score root/crown balance |
| Geometry must be style-independent | Current renderer chooses hard-coded color and primitive by kind | Emit path primitives plus semantic paint roles only |

## Impact and contract safety

Stage 6 introduces `geometry-scene-v2` without changing the v1 `Shape` path. The
solver is deterministic candidate generation with integer scoring and stable ties,
as decided in ADR 0007. No renderer or deployed surface changes.

## Deferrals

Botanical Plate tokens, authoritative SVG v2, viewer interaction, additional
archetypes, and default promotion are deferred.
