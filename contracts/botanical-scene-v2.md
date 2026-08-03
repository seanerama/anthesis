# Contract: botanical-scene-v2

- **Status:** frozen v1
- **Owner:** `botany/v2`

## Exposes

Versioned, style- and renderer-independent botanical intent consumed by composition,
geometry, explanation, and future renderers.

## Consumes

A valid `RepositoryAnalysisV2`, grammar/archetype rule versions, scaling mode,
structural seed, decorative seed, and variation policy.

## Schema / wire

The complete TypeScript-oriented shape is defined in
`docs/botanical-grammar-v2/schema.md` under `BotanicalSceneV2`. Required top-level
fields are:

```ts
type BotanicalSceneV2 = {
  schemaVersion: 2;
  grammarVersion: string;
  source: RepositoryAnalysisV2["source"];
  generation: { structuralSeed: string; decorativeSeed: string;
    prng: "xoshiro128ss-v1"; scalingMode: ScalingMode; quantization: number };
  phenotype: RepositoryPhenotype;
  archetype: ArchetypeRecipe;
  plant: PlantIntent;
  provenanceIndex: Record<string, Provenance>;
  warnings: AnalysisWarning[];
};
```

`PlantIntent` contains plant habit, root system, acyclic axes, growth nodes,
tangent-relative attachments, leaves, buds, flowers, materialized petals/florets,
scars, knots, and thorns. Every major feature has provenance and typed variation
bounds. No SVG commands, viewport coordinates, palette values, fonts, or filter IDs
are allowed. Stable semantic traversal order is parent-before-child. Serialization
is canonical JSON plus one newline.

## Versioning

Frozen at **v1**. Changes are **additive only** — a breaking change is a NEW
contract, not an edit (framework-spec §4.3). Every consumer depends on this shape.
