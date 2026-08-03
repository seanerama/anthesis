# Assessment: Prove the end-to-end portrait spine

## Decision

**ACCEPT as Stage 1.** This is the mandatory walking skeleton and the smallest slice
that proves all architectural boundaries, CI, and deployment.

## Claim / reality verification

| Claim from the architecture | Live repository reality | Planning effect |
|---|---|---|
| TypeScript/Node is the chosen stack | ADR 0001 is accepted; no package manifest or source exists | Stage 1 must establish and pin the toolchain |
| A modular pipeline can be implemented | ADR 0002 and three v1 contracts exist; no modules exist | Create thin real modules, not stubs or services |
| Existing CI can carry application gates | CI only checks required files and secrets | Add real build, integration, determinism, and viewer gates |
| Render is the deployment target | ADR 0003 and local access guidance exist; no service or URL exists | Provisioning and live smoke are Stage 1 exit conditions |
| A viewer exists | No application or viewer files exist | Build the smallest static viewer behind a default-off flag |

## Impact and contract safety

No new seam is introduced. Stage 1 implements the three frozen v1 contracts at
minimum breadth. Additive optional fields are allowed; incompatible shortcuts are
not. No architectural decision is reopened.

## Deferrals

Only one stem, one tagged flower, and provenance are meaningful in this stage. Full
Git metrics, visual grammar, multiple histories, and forge data remain deferred.
