# 0008. Separate style tokens from geometry

- **Status:** Proposed
- **Date:** 2026-08-03

## Context

The MVP SVG kind switch chooses shapes, coordinates, and hard-coded colors together. A palette change cannot be isolated from rendering logic, and future styles would duplicate geometry.

## Decision

`GeometrySceneV2` contains concrete paths, layers, bounds, feature IDs, and semantic paint roles only. A validated `StyleTokensV1` maps paint roles to palette, line weights, fills, texture, opacity, edge, background, typography, depth, and print behavior. The SVG renderer serializes geometry using those tokens and may not change topology or coordinates. Botanical Plate is the first complete token set.

## Alternatives considered

- CSS classes alone separate colors but not line/texture/print policy and do not create a validated style contract.
- Per-style renderers would drift in geometry and provenance.
- Styling inside botanical intent couples semantic interpretation to one visual treatment.

## Consequences

The same geometry supports future styles and geometry hashes prove separation. Semantic paint roles must be sufficiently expressive, and renderer tests must reject unresolved roles.
