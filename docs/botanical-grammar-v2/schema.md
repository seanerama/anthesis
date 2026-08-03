# Botanical Grammar v2 — schema proposal

These interfaces are implementation-oriented pseudocode. Persisted boundaries use Zod, strict objects, stable array ordering, finite numbers, explicit schema versions, canonical JSON, and SHA-256 artifact hashes. Coordinates are normalized scene units. IDs are stable hashes of semantic identity, never array offsets alone.

## Shared provenance

```ts
type SourceRef =
  | { kind: "repository"; id: string }
  | { kind: "commit"; id: string }
  | { kind: "tag"; id: string }
  | { kind: "ref"; id: string }
  | { kind: "period"; id: string };

interface MetricRef {
  metricId: string;                 // e.g. episode.changeVolume.log1p
  value: number;
  normalization: "raw" | "ratio" | "repository-relative" | "global-percentile";
  distributionVersion?: string;
  inputs: SourceRef[];
}

interface Provenance {
  sourceRefs: SourceRef[];          // stable kind/id order
  metricRefs: MetricRef[];
  summaryRef?: string;
  derivation: string;               // versioned rule ID, not prose-only logic
  confidence: number;               // evidence availability, not quality
  capabilities: string[];
}

interface SummarizationRecord {
  id: string;
  operation: "cluster" | "split" | "merge-small" | "coalesce-budget" | "protect-landmark";
  inputRefs: SourceRef[];
  inputEpisodeIds: string[];
  outputEpisodeIds: string[];
  reasonCode: string;
  discardedDetail: Array<"per-commit-shape" | "exact-bin" | "minor-landmark">;
}
```

## Repository analysis and episodes

`RepositoryAnalysisV2` may initially be derived from `CanonicalRepositoryV1`. Facts unavailable in v1 are absent and declared in `capabilities`.

```ts
interface RepositoryAnalysisV2 {
  schemaVersion: 2;
  source: {
    repositoryIdentity: string;
    snapshotSha: string;
    canonicalSchemaVersion: number;
    canonicalSha256: string;
    configHash: string;
  };
  capabilities: Array<
    "reachable-commits" | "tags" | "merge-parents" | "file-categories" |
    "branch-refs" | "unmerged-refs" | "components" | "dependencies"
  >;
  period: { start: string; end: string; activeDays: number };
  totals: ChangeProfile;
  contributors: ContributorProfile;
  chronology: ChronologyProfile;
  releases: ReleaseLandmark[];
  landmarks: Landmark[];
  episodes: DevelopmentEpisode[];
  phenotype: RepositoryPhenotype;
  exclusions: ExclusionReport;
  summarization: SummarizationRecord[];
  warnings: AnalysisWarning[];
}

interface ChangeProfile {
  commits: number;
  additions: number;
  deletions: number;
  filesChanged: number;
  tests: number;
  documentation: number;
  generated: number;
  formatting: number;
  renames: number;
  byComponent: Array<{ componentId: string; share: number }>;
}

interface DevelopmentEpisode {
  id: string;
  ordinal: number;
  interval: { start: string; end: string; durationDays: number };
  boundary: {
    start: "repository-start" | "release" | "dormancy" | "density-valley" | "landmark";
    end: "repository-end" | "release" | "dormancy" | "density-valley" | "landmark";
  };
  releaseRefs: SourceRef[];
  sourceRefs: SourceRef[];
  metrics: ChangeProfile;
  normalized: Record<string, NormalizedValue>;
  contributors: ContributorProfile;
  salience: SalienceVector;
  character: Array<"steady" | "burst" | "renewal" | "collaborative" | "documentary" | "testing">;
  status: "released" | "unreleased";
  summarizedFrom: string[];
  provenance: Provenance;
}

interface NormalizedValue {
  raw: number;
  transformed: number;
  repositoryRelative: number;
  globalPercentile?: number;
  clipped: boolean;
  confidence: number;
}

interface SalienceVector {
  release: number;
  volume: number;
  contributorNovelty: number;
  topology: number;
  reversal: number;
  categoryShift: number;
  duration: number;
  protected: boolean;
}

interface RepositoryPhenotype {
  axes: {
    stature: PhenotypeAxis;
    tempo: PhenotypeAxis;
    ramification: PhenotypeAxis;
    collaboration: PhenotypeAxis;
    renewal: PhenotypeAxis;
    resilience: PhenotypeAxis;
    seasonality: PhenotypeAxis;
    releaseRhythm: PhenotypeAxis;
    modularity: PhenotypeAxis;
    foliation: { testing: PhenotypeAxis; documentation: PhenotypeAxis };
  };
  noOverallScore: true;
}

interface PhenotypeAxis {
  value: number;                    // [0,1]
  confidence: number;
  metricRefs: string[];
}
```

## Botanical scene

```ts
interface BotanicalSceneV2 {
  schemaVersion: 2;
  grammarVersion: string;
  source: RepositoryAnalysisV2["source"];
  generation: {
    structuralSeed: string;
    decorativeSeed: string;
    prng: "xoshiro128ss-v1";
    scalingMode: "repository-relative" | "globally-comparable";
    quantization: number;
  };
  phenotype: RepositoryPhenotype;
  archetype: ArchetypeRecipe;
  plant: PlantIntent;
  provenanceIndex: Record<string, Provenance>;
  warnings: AnalysisWarning[];
}

interface ArchetypeRecipe {
  id: "aster-v1" | "lupine-v1" | "vine-v1";
  selectedByRule: string;
  traits: {
    growthHabit: "erect-herb" | "raceme" | "climbing";
    inflorescence: "capitulum" | "spike" | "distributed";
    phyllotaxy: "alternate" | "opposite" | "whorled";
    rootHabit: "taproot" | "fibrous" | "adventitious";
  };
  borrowedTraits: Array<{ from: ArchetypeRecipe["id"]; trait: string }>;
}

interface VariationRange {
  min: number;
  max: number;
  distribution: "uniform" | "triangular";
  concern: string;                  // named PRNG stream suffix
  class: "structural" | "decorative";
}

interface PlantIntent {
  id: string;
  habit: {
    stature: number;
    crownSpread: number;
    lean: number;
    symmetry: number;
    density: number;
    rootCrownRatio: number;
  };
  rootSystem: RootSystemIntent;
  axes: AxisIntent[];               // parent-before-child traversal
  nodes: GrowthNodeIntent[];
  leaves: LeafIntent[];
  buds: BudIntent[];
  flowers: FlowerIntent[];
  scars: ScarIntent[];
  knots: KnotIntent[];
  thorns: ThornIntent[];
  provenance: Provenance;
}

interface AxisIntent {
  id: string;
  kind: "main-stem" | "secondary-stem" | "root" | "lateral-root";
  parentAttachment?: Attachment;
  chronology: { startEpisodeId: string; endEpisodeId: string };
  length: number;
  baseRadius: number;
  tipRadius: number;
  taperExponent: number;
  lean: number;
  curvature: number;
  nodeIds: string[];
  supportsFeatureIds: string[];
  variation: Record<"waviness" | "bend" | "torsion", VariationRange>;
  provenance: Provenance;
}

interface Attachment {
  parentAxisId: string;
  arcPosition: number;              // [0,1]
  tangentAngle: number;
  side: "left" | "right" | "front" | "back";
  nodeId: string;
}

interface GrowthNodeIntent {
  id: string;
  axisId: string;
  arcPosition: number;
  episodeId: string;
  organIds: string[];
  provenance: Provenance;
}

interface RootSystemIntent {
  primaryAxisId: string;
  lateralAxisIds: string[];
  density: number;
  spread: number;
  depth: number;
  basis: "components" | "dependencies" | "activity-continuity";
  provenance: Provenance;
}

interface LeafIntent {
  id: string;
  attachment: Attachment;
  contour: "lanceolate" | "ovate" | "serrated" | "lobed";
  role: "testing" | "documentation" | "mixed";
  length: number;
  width: number;
  curvature: number;
  vein: { secondaryPairs: number; branchAngle: number; prominence: number };
  variation: Record<"angle" | "contour" | "veins", VariationRange>;
  provenance: Provenance;
}

interface FlowerIntent {
  id: string;
  support: Attachment;
  episodeIds: string[];
  maturity: "bud" | "opening" | "mature" | "spent";
  orientation: { azimuth: number; elevation: number };
  receptacle: { radius: number; asymmetry: number };
  sepals: { count: number; length: number; spread: number };
  rings: PetalRingIntent[];
  petals: PetalIntent[];            // individual semantic contours; concrete cubics live in geometry
  center: FlowerCenterIntent;
  florets: FloretIntent[];          // bounded grammar children, not commit-to-floret mappings
  provenance: Provenance;
}

interface PetalRingIntent {
  id: string;
  order: number;
  petalCount: number;
  phase: number;
  radius: number;
  overlap: number;
  contour: "ray" | "spatulate" | "tepal";
  length: number;
  basalWidth: number;
  shoulderWidth: number;
  taper: number;
  cup: number;
  reflex: number;
  radialAsymmetry: number;
  variation: Record<"length" | "rotation" | "curvature", VariationRange>;
  provenance: Provenance;           // episode/rule refs, not one commit per petal
}

interface PetalIntent {
  id: string;
  ringId: string;
  ordinal: number;
  radialAngle: number;
  lengthScale: number;
  widthScale: number;
  cup: number;
  reflex: number;
  tipBias: number;
  variation: Record<"contour" | "rotation", VariationRange>;
  provenance: Provenance;
}

interface FlowerCenterIntent {
  arrangement: "phyllotactic-florets" | "phyllotactic-seeds";
  count: number;
  goldenAngle: number;
  radius: number;
  floretShape: "tubular" | "seed";
}

interface FloretIntent {
  id: string;
  ordinal: number;
  radialPosition: number;
  angle: number;
  scale: number;
  stage: "closed" | "open" | "seed";
  provenance: Provenance;           // owning episode/rule; never falsely one commit
}

interface BudIntent { id: string; support: Attachment; maturity: number; provenance: Provenance }
interface ScarIntent { id: string; attachment: Attachment; severity: number; provenance: Provenance }
interface KnotIntent { id: string; attachment: Attachment; radius: number; provenance: Provenance }
interface ThornIntent { id: string; attachment: Attachment; length: number; provenance: Provenance }
```

## Geometry scene

Geometry is renderer-independent but concrete. It contains no palette values or SVG-specific element names.

```ts
type Point = Readonly<{ x: number; y: number }>;
type Cubic = Readonly<{ p0: Point; c1: Point; c2: Point; p1: Point }>;
type PathCommand =
  | { op: "M" | "L"; p: Point }
  | { op: "C"; c1: Point; c2: Point; p: Point }
  | { op: "Z" };

interface GeometrySceneV2 {
  schemaVersion: 2;
  geometryVersion: string;
  viewport: { width: number; height: number; safeInset: number };
  layers: GeometryLayer[];
  featureBounds: Record<string, Bounds>;
  composition: CompositionResult;
  semanticFingerprint: string;
  provenance: {
    botanicalSceneSha256: string;
    styleIndependent: true;
    quantization: number;
  };
}

interface GeometryLayer {
  id: string;
  zIndex: number;
  primitives: GeometryPrimitive[];
}

type GeometryPrimitive =
  | { kind: "closed-path"; id: string; featureId: string; role: PaintRole; commands: PathCommand[] }
  | { kind: "open-path"; id: string; featureId: string; role: PaintRole; commands: PathCommand[]; widthProfile?: WidthSample[] }
  | { kind: "mark-field"; id: string; featureId: string; role: PaintRole; marks: Mark[]; clipFeatureId: string };

type PaintRole =
  | "stem" | "root" | "leaf" | "leaf-vein" | "sepal" | "petal-back" |
    "petal-front" | "receptacle" | "floret" | "scar" | "thorn" | "texture";

interface CompositionResult {
  solverVersion: string;
  candidateCount: number;
  selectedIndex: number;
  totalScore: number;
  componentScores: Record<string, number>;
  hardViolations: string[];
  centerOfGravity: Point;
  occupiedBounds: Bounds;
}
```

## Style tokens and SVG provenance

```ts
interface StyleTokensV1 {
  schemaVersion: 1;
  id: "botanical-plate-v1" | string;
  palette: Record<PaintRole | "paper" | "ink", string>;
  line: {
    outer: number;
    interior: number;
    vein: number;
    root: number;
    join: "round" | "miter";
    cap: "round" | "butt";
  };
  fill: { opacityByRole: Partial<Record<PaintRole, number>>; twoToneOffset: number };
  texture: { mode: "none" | "stipple" | "hatch"; density: number; opacity: number; minSpacing: number };
  edge: { modulation: number; doubledContourOpacity: number };
  background: { color: string; fiberDensity: number };
  depth: { rearOpacity: number; hatchOffset: number; rasterShadow: false };
  annotation: { fontFamily: string; sizePt: number; lineHeight: number; color: string };
  print: { nominalWidthMm: number; nominalHeightMm: number; minDpi: 300; coordinatePrecision: number };
}

interface SvgProvenanceV2 {
  schemaVersion: 2;
  project: "Anthesis";
  repository: string;
  snapshotSha: string;
  artifactHashes: {
    canonical: string;
    analysis: string;
    botanical: string;
    geometry: string;
  };
  versions: {
    grammar: string;
    episodeAlgorithm: string;
    normalization: string;
    archetypeRules: string;
    compositionSolver: string;
    geometry: string;
    style: string;
    renderer: string;
    prng: string;
  };
  configurationHash: string;
  structuralSeed: string;
  decorativeSeed: string;
  scalingMode: "repository-relative" | "globally-comparable";
  semanticFingerprint: string;
}
```

## Required invariants

- All IDs and arrays have documented stable ordering.
- Axial graph is acyclic; every non-primary axis and attached organ references an existing parent node.
- Axis taper is positive and non-increasing; endpoints and path coordinates are finite and quantized.
- Episode ordinal and stem arc position are monotonic.
- Primary blooms contain sepals, at least one petal ring, and a compound center; primary petals/leaves are closed paths with at least two cubic segments.
- Every major botanical feature has provenance; every geometry primitive references an existing feature.
- Changing only decorative seed leaves `semanticFingerprint`, parentage, feature IDs/counts, episode order, archetype, and source refs identical.
- Style changes leave canonical geometry bytes identical.
