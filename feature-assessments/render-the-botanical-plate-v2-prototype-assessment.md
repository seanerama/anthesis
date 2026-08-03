# Assessment: Render the Botanical Plate v2 prototype

## Decision

**ACCEPT as Stage 7, dependent on Stage 6.** This closes the thin backlog with an
art-direction proof while keeping the legacy renderer as production default.

## Claim / reality verification

| Architecture claim | Live repository reality | Planning effect |
|---|---|---|
| SVG should remain authoritative | Exact SVG/provenance tests and viewer already exist | Reuse the operational boundary with a separate v2 renderer/provenance contract |
| Style must be separate from geometry | `shape()` hard-codes palette and element primitives | Introduce validated paint-role tokens and prove with a monochrome style |
| Botanical Plate needs print-quality vector detail | Current SVG has constant strokes, ellipses, circles, and no veins/roots | Serialize Stage 6 paths with fine outlines, layering, vector texture, and print tokens |
| Output should be inspectable | V1 embeds source data on primitive elements | Add an indexed feature-to-episode/source provenance block |
| Art must work before legend | Current fixtures visually resemble diagrams | Gate on annotations-off review and blind botanical recognition |

## Impact and contract safety

Stage 7 introduces `svg-provenance-v2`; frozen v1 SVG provenance and exact snapshots
remain unchanged. The v2 renderer consumes concrete geometry and cannot reinterpret
botanical semantics. The explicit v2 flag is default-off and its viewer smoke is
separate from the deployed default artifact.

## Deferrals

Production-default promotion, richer Git collection, GitHub integration, raster
authority, animation, Lupine/Vine, and broad viewer redesign require later intake.
