# 0010. Retain SVG as the first authoritative v2 renderer

- **Status:** Proposed
- **Date:** 2026-08-03

## Context

V2 requires compound paths, print scaling, source inspection, metadata, layers, and deterministic output. The existing SVG renderer proves exact-byte authority but its primitive implementation is visually insufficient.

## Decision

Retain deterministic SVG as the first authoritative renderer and replace only its v2 internals. It consumes concrete `GeometrySceneV2` plus validated style tokens, emits canonical ordering and precision, embeds an indexed provenance block, and writes a byte-identical sidecar. Raster previews are derivative artifacts. AI generation, raster texture concealment, browser-layout-dependent geometry, and photorealistic effects are excluded.

## Alternatives considered

- Canvas is convenient for preview but weak for source metadata and authoritative print vectors.
- PDF is strong for print but less accessible and interactive in the viewer.
- Raster authority complicates deterministic inspection and scaling.
- Keeping the existing renderer unchanged cannot express v2 paths/layers/style roles.

## Consequences

Existing operational and viewer boundaries remain valid. SVG serialization needs strict ordering, precision, validity, and cross-runtime tests. Future renderers must consume the same geometry rather than reinterpret botanical semantics.
