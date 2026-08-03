# Contract: geometry-scene-v2

- **Status:** frozen v1
- **Owner:** `geometry/v2`

## Exposes

Concrete, renderer-independent, style-independent path geometry plus the selected
composition result.

## Consumes

A valid `BotanicalSceneV2`, composition configuration, geometry version, and named
deterministic streams.

## Schema / wire

The complete TypeScript-oriented shape is defined in
`docs/botanical-grammar-v2/schema.md` under `GeometrySceneV2`.

```ts
type GeometrySceneV2 = {
  schemaVersion: 2;
  geometryVersion: string;
  viewport: { width: number; height: number; safeInset: number };
  layers: Array<{ id: string; zIndex: number; primitives: GeometryPrimitive[] }>;
  featureBounds: Record<string, Bounds>;
  composition: CompositionResult;
  semanticFingerprint: string;
  provenance: { botanicalSceneSha256: string;
    styleIndependent: true; quantization: number };
};
```

Primitives are closed paths, open paths, or clipped mark fields made from finite,
quantized move/line/cubic/close commands. Each references an existing botanical
feature and semantic paint role. No colors or SVG element names are allowed. Axis
topology is attached and acyclic, taper is positive and non-increasing, primary
petals/leaves are cubic closed contours, and composition component scores reproduce
the selected candidate. Serialization is canonical JSON plus one newline.

## Versioning

Frozen at **v1**. Changes are **additive only** — a breaking change is a NEW
contract, not an edit (framework-spec §4.3). Every consumer depends on this shape.
