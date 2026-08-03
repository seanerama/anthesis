# 0007. Use candidate generation and scoring for composition

- **Status:** Proposed
- **Date:** 2026-08-03

## Context

Fixed x/y formulas create floating flowers, disconnected branches, congestion, and nearly identical silhouettes. Anthesis needs deterministic global composition without an opaque or expensive optimizer.

## Decision

Generate a bounded set of candidates from named structural streams, evaluate hard constraints and fixed integer-weight soft scores, select the minimum with candidate-index tie-breaking, then perform a fixed number of greedy repairs for minor organs. Score overflow, support connectivity, bloom/leaf collision, crossings, stem readability, balance, center of gravity, negative space, bloom separation, root/crown ratio, and annotation clearance. Persist the selected index and component scores.

## Alternatives considered

- Force-directed layout is sensitive to iteration and floating-point details and poorly matches axial botany.
- Simulated annealing adds temperature/schedule complexity and is harder to explain.
- Greedy placement alone is fast but commits too early to poor global structure.
- General constraint solvers add dependency and reproducibility costs before need is proven.

## Consequences

Composition is inspectable, reproducible, and bounded. Scoring weights become art direction and require visual review, not only unit tests. Coarse bounds and a spatial grid limit cost.
