# Assessment: Grow a typed Aster botanical scene from episodes

## Decision

**ACCEPT as Stage 5, dependent on Stage 4.** A typed semantic plant must be proven
before geometry can be judged independently.

## Claim / reality verification

| Architecture claim | Live repository reality | Planning effect |
|---|---|---|
| Botanical intent should be renderer-independent | Scene v1 is persisted and upstream of geometry | Preserve the seam but introduce a separate typed v2 contract |
| V1 cannot express morphology | Elements are flat with free-form `metrics`/`intent` records | Model axes, nodes, attachments, roots, rings, petals, florets, veins, and maturity explicitly |
| Seeded variation must be organic but factual structure stable | A seed is hashed but never consumed by geometry | Specify named PRNG streams, variation envelopes, and semantic fingerprint |
| Archetypes must solve phenotype needs | No archetype model exists | Implement only Aster; defer selection/catalog breadth |
| Major features require provenance | V1 elements contain source refs | Retain and strengthen provenance through episode/metric/rule references |

## Impact and contract safety

Stage 5 consumes the new analysis seam and introduces `botanical-scene-v2`. It does
not mutate frozen Botanical Scene v1 and does not add geometry or style fields to
semantic intent. The v2 route remains default-off.

## Deferrals

Coordinates, composition, SVG, Lupine/Vine, Git enrichment, viewer changes, and
production promotion are deferred.
