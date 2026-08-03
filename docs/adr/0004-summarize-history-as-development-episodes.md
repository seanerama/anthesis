# 0004. Summarize history as development episodes

- **Status:** Proposed
- **Date:** 2026-08-03

## Context

The MVP uses tags or calendar months as flower segments and creates one petal per commit. This is unstable across repository scale, omits post-last-tag work, splits bursts at arbitrary month boundaries, and produces malformed or congested flowers.

## Decision

Insert a versioned development-episode layer between canonical facts and phenotype. Release tags are hard landmarks, not the only segmentation method. In their absence—or within long release intervals—deterministic inactivity gaps and activity-density valleys form boundaries. Micro-episodes merge by deterministic temporal/profile distance. A fixed visual budget coalesces adjacent low-salience episodes while protecting releases, reverts, and robust outliers. Every aggregation writes a summarization ledger and preserves source references.

## Alternatives considered

- One shape per event preserves literal detail but cannot scale or compose.
- Fixed calendar bins are deterministic but insensitive to actual development rhythm.
- Statistical topic modeling would need commit text/content and produce harder-to-explain, less stable results.

## Consequences

Morphological complexity is bounded independently of history size, and visible units correspond to development phases. The algorithm and thresholds become provenance/version inputs. Some detail is compressed, so the ledger and viewer trace are mandatory.
