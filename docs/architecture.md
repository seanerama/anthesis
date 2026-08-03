# Anthesis architecture

## System shape

Anthesis is a TypeScript modular monolith. Data flows in one direction:

```text
Git collector -> canonical model -> analysis -> botanical model
              -> geometry -> SVG renderer -> viewer
```

The authoritative renderer is deterministic SVG. JSON artifacts at the canonical
and botanical boundaries make runs inspectable, cacheable, and reproducible.

## Repository structure

```text
src/
  collector/       local Git facts
  canonical/       canonical model validation and serialization
  analysis/        exclusions, aggregation, normalization
  botany/          botanical interpretation
  geometry/        renderer-independent paths and coordinates
  render/svg/      authoritative SVG and provenance renderer
  cli/             analyze, grow, render, portrait, explain commands
  viewer/          progressively enhanced static artifact viewer
test/
  fixtures/        synthetic Git repositories and expected traits
  integration/     end-to-end and determinism tests
contracts/         frozen persisted interface contracts
docs/adr/          accepted architectural decisions
```

These are logical boundaries; Stage 0 may begin in one package. Imports follow the
pipeline direction and never import the viewer into domain modules.

## Operational boundary

The first deployed surface is a static viewer on Render. It receives only checked-in
or build-generated demonstration artifacts and cannot read arbitrary repositories.
The local CLI performs repository access. No application secrets, database, remote
execution, or ingestion API exists in Stage 0.

## Determinism boundary

Structural output is a pure function of repository identity, snapshot SHA, analysis
configuration hash, grammar version, renderer version, style, and seed. Tests compare
canonicalized JSON and exact SVG bytes across two independent executions.

## Feature catalog decision

The `helper-bot` drop-in feature is declined for the initial backlog. Anthesis has no
chat/LLM loop, and adding one would not help prove the product's rendering spine. It
may be reconsidered through a future ADR if an interactive support surface becomes a
real product requirement.
