# Contract: svg-provenance-v2

- **Status:** frozen v1
- **Owner:** `render/svg/v2`

## Exposes

The authoritative v2 SVG artifact and its identical canonical JSON provenance
sidecar. The SVG root uses `data-anthesis-contract="svg-provenance-v2"` and embeds
one indexed feature-provenance metadata block.

## Consumes

Canonical repository bytes, `RepositoryAnalysisV2`, `BotanicalSceneV2`,
`GeometrySceneV2`, validated style tokens, renderer configuration, and all versioned
seed inputs.

## Schema / wire

```ts
type SvgProvenanceV2 = {
  schemaVersion: 2;
  project: "Anthesis";
  repository: string;
  snapshotSha: string;
  artifactHashes: { canonical: string; analysis: string;
    botanical: string; geometry: string };
  versions: { grammar: string; episodeAlgorithm: string;
    normalization: string; archetypeRules: string; compositionSolver: string;
    geometry: string; style: string; renderer: string; prng: string };
  configurationHash: string;
  structuralSeed: string;
  decorativeSeed: string;
  scalingMode: "repository-relative" | "globally-comparable";
  semanticFingerprint: string;
};
```

Canonical JSON uses UTF-8, lexically sorted object keys, stable arrays, no
insignificant whitespace, and one trailing newline in the sidecar. SVG attributes,
elements, numeric precision, definitions, and metadata are emitted in canonical
order. Wall-clock time and environment paths do not affect authoritative bytes.

## Versioning

Frozen at **v1**. Changes are **additive only** — a breaking change is a NEW
contract, not an edit (framework-spec §4.3). Every consumer depends on this shape.
