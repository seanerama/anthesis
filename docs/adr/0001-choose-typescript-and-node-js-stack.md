# 0001. Choose TypeScript and Node.js stack

- **Status:** Accepted
- **Date:** 2026-08-03

## Context

Anthesis needs one deterministic implementation of repository analysis, botanical
interpretation, SVG rendering, a CLI, and an interactive browser viewer. The
canonical and botanical models must remain typed across those boundaries, while the
first release must stay easy for one maintainer to inspect and operate.

## Decision

Use TypeScript in strict mode on the active Node.js LTS line. Use Zod at persisted
JSON boundaries, a conventional command-line parser for the CLI, a custom SVG
renderer as the authoritative renderer, and Vite for a lightweight browser viewer.
Pin the runtime in the repository, pin dependencies, and commit the package-manager
lockfile. Do not introduce React unless viewer complexity demonstrates a need for it.

## Alternatives considered

The stack guide recommends a boring, supported stack and progressive enhancement
before a SPA. This decision follows that recommendation.

- Python offers excellent data and graph libraries and faster numerical
  experimentation, but would duplicate model definitions across the CLI and viewer.
- Rust offers strong determinism and performance, but would slow early visual and
  schema iteration without a demonstrated performance constraint.
- A React SPA would provide a mature component model, but the initial viewer only
  needs to load, display, and inspect an SVG artifact.

## Consequences

The CLI and viewer share types and validation, and contributors need only one
toolchain. SVG behavior must avoid engine-dependent APIs and unstable object
iteration. Heavy numerical work may eventually justify an isolated native or WASM
module, but that requires a new ADR and must preserve the frozen contracts.
