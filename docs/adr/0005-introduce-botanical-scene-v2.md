# 0005. Introduce a typed Botanical Scene v2

- **Status:** Proposed
- **Date:** 2026-08-03

## Context

Botanical Scene v1 is a flat array with generic metric and intent records. It cannot state axis hierarchy, growth nodes, attachments, petal rings, centers, veins, root systems, maturity, or bounded variation. Geometry therefore reconstructs weak semantics from kind switches.

## Decision

Create `BotanicalSceneV2` as a separate persisted contract. It models plant habit, an acyclic axis/node graph, tangent-relative attachments, typed leaves/buds/flowers/scars/roots, flower rings and centers, archetype traits, provenance, and variation envelopes. It contains biological intent but no coordinates, SVG commands, colors, or fonts. V1 remains supported by the legacy pipeline; there is no lossy v2-to-v1 adapter.

## Alternatives considered

- Add optional fields to frozen v1: legal only if additive, but the flat union and free-form intent would remain ambiguous.
- Put morphology directly in geometry: loses the inspectable semantic boundary and renderer independence.
- Rewrite the whole application: unnecessary because upstream facts and downstream SVG authority are sound.

## Consequences

Botanical interpretation becomes independently testable and expressive. More types and schema migration are required. Grammar dispatch must explicitly select v1 or v2.
