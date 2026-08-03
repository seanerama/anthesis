# Assessment: Summarize repository history into development episodes

## Decision

**ACCEPT as Stage 4, dependent on Stage 3.** This is the smallest v2 slice that fixes
literal event cardinality before any new morphology is built.

## Claim / reality verification

| Architecture claim | Live repository reality | Planning effect |
|---|---|---|
| History needs semantic episodes | `segmentHistory` uses all tags or UTC months | Replace only on the v2 path; retain v1 behavior |
| Thousands of events must not become shapes | `grow` creates one petal per segment commit and one leaf per qualifying commit | Bound episode count before botany |
| Releases should guide segmentation | Tagged segmentation omits work after the last tag and does not classify release tags | Add release landmarks plus explicit unreleased tail |
| Normalization must support repository-relative/global modes | `analysis/index.ts` only exports `clamp`; phenotype uses fixed linear divisors | Introduce robust versioned normalization with confidence |
| Information loss must be inspectable | Canonical facts have source IDs, but no aggregation ledger exists | Persist source coverage and summarization records |

## Impact and contract safety

Stage 4 consumes frozen `CanonicalRepositoryV1` unchanged and introduces the new
`repository-analysis-v2` seam. Legacy segmentation and all frozen v1 outputs remain
available. Unsupported branch/review/dependency facts are declared absent through
capabilities rather than guessed.

## Deferrals

Botanical entities, geometry, SVG, richer canonical facts, GitHub enrichment, and
production-default changes are deferred.
