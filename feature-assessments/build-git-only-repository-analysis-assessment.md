# Assessment: Build Git-only repository analysis

## Decision

**ACCEPT as Stage 2, dependent on Stage 1.** Analysis is isolated from visual grammar
so factual Git behavior and exclusions can become trustworthy before art mappings
multiply the debugging surface.

## Claim / reality verification

| Claim from the vision | Live repository reality | Planning effect |
|---|---|---|
| Local Git is the MVP data source | Only the design brief describes collection; no collector exists | Implement and integration-test the real Git boundary |
| Canonical facts are renderer-independent | CanonicalRepositoryV1 is frozen and owns factual data | Emit that contract without geometry or style fields |
| Synthetic histories are required | Five fixtures are specified but none exist | Generate all five as deterministic repositories |
| Exclusions prevent distorted metrics | Example rules exist only in the brief | Implement config, accounting, and negative tests |
| Forge data is optional | No forge adapter or contract exists | Keep Stage 2 strictly Git-only; warn on unknowable history |

## Impact and contract safety

The stage broadens producers of CanonicalRepositoryV1 without changing its required
shape. It introduces no network seam, authentication, database, or provider contract.

## Deferrals

Botanical normalization, rich SVG, forge enrichment, and interactive inspection are
not part of this stage.
