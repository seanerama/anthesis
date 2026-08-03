# Contract: botanical-scene-model

- **Status:** frozen v1
- **Owner:** `botany/interpreter`

## Exposes

Versioned, renderer-independent JSON emitted by `anthesis grow analysis.json` and
consumed by geometry, SVG rendering, explanation, and future renderers.

## Consumes

A valid `CanonicalRepositoryV1`, normalization configuration, style-independent
grammar version, and deterministic seed inputs.

## Schema / wire

Coordinates are normalized to a unit scene before viewport fitting. Source
references always identify canonical facts; decorative variation cannot add or
remove semantic elements.

```ts
type BotanicalSceneV1 = {
  schemaVersion: 1;
  grammarVersion: string;
  source: {
    repositoryIdentity: string;
    snapshotSha: string;
    canonicalConfigHash: string;
  };
  generation: {
    seed: string;
    scalingMode: "repository-relative" | "globally-comparable";
  };
  phenotype: {
    activity: number; growth: number; pruning: number;
    branching: number; collaboration: number; review: number;
    stability: number; resolution: number; testing: number;
    documentation: number;
  };
  viewport: { width: number; height: number };
  elements: Array<{
    id: string;
    kind: "root" | "stem" | "branch" | "leaf" | "bud" |
          "flower" | "petal" | "seed" | "scar" | "thorn";
    parentId?: string;
    sourceRefs: Array<{
      kind: "commit" | "tag" | "period" | "repository";
      id: string;
    }>;
    metrics: Record<string, number>;
    intent: Record<string, number | string | boolean>;
  }>;                       // stable semantic traversal order
  warnings: Array<{ code: string; message: string }>;
};
```

Phenotype values are finite numbers in `[0, 1]`. Element IDs are stable for the
same canonical input, configuration, grammar version, and seed.

## Versioning

Frozen at **v1**. Changes are **additive only** — a breaking change is a NEW
contract, not an edit (framework-spec §4.3). Every consumer depends on this shape.
