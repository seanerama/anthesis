# Botanical Grammar v2 — prototype recommendation

## Recommendation

Build a single **Aster study** from hand-authored synthetic `RepositoryAnalysisV2`. Do not enrich Git collection and do not make v2 the default during this study. Its purpose is to prove that the proposed semantic, composition, geometry, variation, and style boundaries can produce botanical art.

## Input

Use six ordered development episodes over eighteen months:

- two tagged released episodes with different salience;
- one salient unreleased episode;
- one documentation-led episode and one testing-led episode;
- one deletion-led renewal episode containing an observed revert landmark;
- two contributor groupings with a deliberately uneven distribution;
- one long dormant gap.

The data is checked-in canonical JSON with artificial source refs. A second parameter set collapses it to one episode; other table-driven variants expand it to 3, 8, 20, and 60 pre-summarization units.

## Output

The primary portrait is one coherent plant containing:

- one curved, closed-contour, tapered main stem;
- two tangent-continuous side branches that terminate at the organs they support;
- one mature terminal bloom, one smaller lateral bloom, and one opening bud;
- multi-ring cubic-path petals with overlap, sepals, and a phyllotactic floret center;
- four to eight path-based leaves attached by petioles, with midribs and secondary veins;
- a primary root and at least four tapering hierarchical laterals;
- one renewal scar integrated at a growth node;
- deterministic minor asymmetry from named decorative streams;
- Botanical Plate paint roles and tokens.

Emit `analysis.json`, `plant-v2.json`, `geometry-v2.json`, `portrait.svg`, and `portrait.provenance.json`. Also emit a non-authoritative contact sheet of the four lowest-scoring candidates with score components for review.

## Solver scope

Generate exactly 32 candidates in the first study. Vary main-axis lean and controls, two bloom-side arrangements, branch attachment intervals, leaf phase, crown scale, and root spread. Reject overflow, disconnected support, chronology reversal, and severe primary-bloom overlap. Score the remaining candidates for crossings, congestion, stem readability, lateral mass, center of gravity, negative-space distribution, bloom separation, root/crown balance, and annotation clearance. Use integer scores and candidate-index tie-breaking.

Do not optimize every petal globally. Solve bloom bounds and local frames globally, then build petal rings with local deterministic overlap rules.

## Proof matrix

Run the same semantic scene four ways:

1. Botanical Plate, decorative seed A.
2. Botanical Plate, decorative seed A again: all artifacts must be byte-identical.
3. Botanical Plate, decorative seed B: semantic fingerprint, features, topology, and source refs must match; eligible contours and minor angles must differ within bounds.
4. A minimal monochrome diagnostic style: `geometry-v2.json` must be byte-identical to runs 1–3.

## Exit criteria

- At least four of five viewers who are not told the Git premise call it a plant, flower, or botanical illustration.
- The selected composition beats the median candidate in blind pairwise review more often than chance.
- It remains effective without annotations or legend.
- No primary flower or center is a plain circle; no primary petal or leaf is an unmodified ellipse.
- Main stem and roots are tapered closed paths; attachments are visibly continuous.
- Every major organ resolves to episode/source/metric/rule provenance.
- Exact determinism, semantic seed isolation, geometry invariants, SVG validity, and print checks pass.

## Explicit non-goals

No GitHub API, new repository metrics, Lupine/Vine implementation, interactive viewer redesign, raster effects, animation, or production-default switch belongs in this prototype. If this constrained Aster cannot pass the recognition and composition gates, revise the grammar or geometry before increasing data breadth.
