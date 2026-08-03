# 0003. Choose Render deployment target

- **Status:** Accepted
- **Date:** 2026-08-03

## Context

Stage 0 must deploy a real end-to-end result. Its deployable surface is a static
viewer containing a deterministic SVG generated and tested by the CLI. Anthesis does
not yet require a public API, background worker, database, or persistent server.

## Decision

Deploy the viewer to a new private-project service in Sean's Render workspace, built
from the `main` branch of `github.com/seanerama/anthesis`. CI remains the quality
gate; Render publishes the static viewer after the repository build succeeds. The
exact service identifier and URL are recorded only when provisioned.

## Alternatives considered

The architecture guide requires a real walking-skeleton deployment but does not
mandate a host. Render is already configured for Git-driven deploys and matches a
static first surface. Cloudflare Pages in the catalog is tied to another repository;
AWS EC2 adds server and credential operations; the local 3090 is not a suitable
primary public endpoint.

## Consequences

Render makes branch-driven static deployment inexpensive to operate. The CLI itself
is distributed separately and is not executed by the deployed viewer. A future API,
job queue, or private repository ingestion flow will require a new deployment ADR
and security design rather than silently expanding this target.
