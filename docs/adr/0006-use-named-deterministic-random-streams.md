# 0006. Use named deterministic random streams

- **Status:** Proposed
- **Date:** 2026-08-03

## Context

The MVP derives a seed but does not use it for organic variation. A single sequential PRNG would make unrelated geometry change when a new random draw is inserted and could let decoration alter semantics.

## Decision

Specify `xoshiro128**` with pinned test vectors. Derive each stream by SHA-256 of seed, semantic feature ID, named concern, and algorithm version. Separate structural and decorative seeds. Sample only within typed variation envelopes. Quantize output coordinates. Compute a semantic fingerprint that excludes eligible decorative values and assert it is invariant when only decorative seed changes.

## Alternatives considered

- `Math.random()` is neither seedable nor cross-runtime authoritative.
- One global seeded stream is deterministic but order-coupled.
- Noise fields alone are useful for contours but do not replace discrete named choices.

## Consequences

Features vary organically without random-consumption cascades. Stream names and algorithm versions become durable API/provenance. Renaming a semantic ID intentionally changes that feature’s variation.
