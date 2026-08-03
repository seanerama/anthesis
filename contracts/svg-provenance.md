# Contract: svg-provenance

- **Status:** frozen v1
- **Owner:** `render/svg`

## Exposes

The authoritative deterministic SVG artifact and its identical JSON provenance
sidecar, emitted by `anthesis render plant.json --output portrait.svg`.

## Consumes

A valid `BotanicalSceneV1`, renderer version, selected style, viewport, and the
canonical analysis mode/provider metadata.

## Schema / wire

The SVG root has `data-anthesis-contract="svg-provenance-v1"`. It contains one
`<metadata id="anthesis-provenance">` element whose text is the canonical JSON form
of this object. The adjacent `portrait.provenance.json` file contains identical
bytes followed by one newline.

```ts
type SvgProvenanceV1 = {
  schemaVersion: 1;
  project: "Anthesis";
  repository: string;
  snapshotSha: string;
  periodStart: string;
  periodEnd: string;
  analysisMode: "git-only" | "forge-enriched";
  provider?: string;
  scalingMode: "repository-relative" | "globally-comparable";
  rendererVersion: string;
  grammarVersion: string;
  style: string;
  configurationHash: string;
  seed: string;
  canonicalModelSha256: string;
  botanicalSceneSha256: string;
};
```

Canonical JSON uses UTF-8, lexicographically sorted object keys, preserved array
order, no insignificant whitespace, and no HTML escaping beyond valid JSON. SVG
element and attribute ordering is deterministic. Wall-clock generation time is not
part of this contract or the SVG bytes.

## Versioning

Frozen at **v1**. Changes are **additive only** — a breaking change is a NEW
contract, not an edit (framework-spec §4.3). Every consumer depends on this shape.
