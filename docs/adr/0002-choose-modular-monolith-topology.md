# 0002. Choose modular-monolith topology

- **Status:** Accepted
- **Date:** 2026-08-03

## Context

Anthesis has distinct pipeline stages, but the Git-only MVP is a single local
workflow with one maintainer, one release cadence, and no independent scaling or
security boundary. Splitting stages into services would multiply CI, images,
deployment surfaces, and contract coordination before those costs buy anything.

## Decision

Build one deployable repository as a modular monolith. Keep collector, canonical
model, analysis, botanical interpretation, geometry, rendering, CLI, and viewer as
explicit modules with dependency direction matching the pipeline. Persisted JSON
crosses the canonical-model and botanical-scene seams. The static viewer is a build
artifact of the same application, not an independently owned service.

## Alternatives considered

The topology guide recommends beginning with a modular monolith. A multi-service
analyzer/rendering API/viewer topology would permit independent scaling, while a
single undifferentiated package would minimize setup. There is no current scaling or
ownership boundary to justify services, while an undifferentiated package would
erode the pipeline boundaries required by the product brief.

## Consequences

One CI matrix and one release simplify Stage 0 and preserve fast local execution.
Module APIs and frozen persisted contracts leave extraction possible. In-process
coupling remains a risk, so imports must follow the documented dependency direction;
a service is extracted only for measured scaling, runtime, or ownership needs.
