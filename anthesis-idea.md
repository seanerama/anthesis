# Anthesis

## A Generative Botanical Art Engine for Git Repositories

> **Every repository grows differently.**

**Status:** Concept and design brief  
**Audience:** Software architect or advanced coding agent  
**Purpose:** Define the product vision, design language, technical boundaries, and first implementation goals for Anthesis.

---

## 1. Executive Summary

Anthesis is a generative art engine that transforms the history of a Git repository into botanical artwork.

The system interprets software development as organic growth:

- The default branch becomes the main stem.
- Feature branches become side stems.
- Commits become growth events.
- Pull requests become petals or blooms.
- Releases become flowers.
- Additions become growth.
- Deletions become pruning or negative space.
- Issues become seeds, buds, or unresolved growth.
- Contributors influence symmetry, texture, and variation.
- Tests and documentation become leaves and supporting structures.
- Reverts, failed releases, and regressions become scars, knots, or thorns.

The goal is not to create a conventional Git graph with a floral skin. Anthesis should create a mathematically grounded visual artifact that can be appreciated as art while still preserving meaningful characteristics of the repository that produced it.

The same repository snapshot, renderer version, configuration, and seed must always produce the same structural result.

---

## 2. Product Vision

Anthesis should make the history of software feel tangible.

A repository is more than its final source tree. It contains evidence of growth, pruning, experimentation, collaboration, abandoned ideas, releases, corrections, and long periods of maintenance. Traditional Git tools expose these events analytically, but they rarely communicate the overall character of the work.

Anthesis should create a visual phenotype for a repository.

Each repository should produce a distinct plant whose form reflects:

- How long the project has existed
- How frequently it changes
- How much it grows and contracts
- How work is divided among contributors
- How often branches are created and merged
- How releases are distributed over time
- How much effort goes into tests and documentation
- How many issues are opened, resolved, or left outstanding
- How concentrated or distributed development activity is
- Whether development is steady, episodic, chaotic, or highly structured

The final work should function at two levels:

1. **At a distance:** a visually compelling botanical artwork.
2. **Up close:** a compressed and inspectable history of the repository.

---

## 3. Core Product Principles

### 3.1 Meaning Before Decoration

Every major visual feature should correspond to repository data.

Decorative noise may make the image feel organic, but it must not alter or obscure the underlying data model.

### 3.2 Deterministic Generation

Given the same:

- Repository
- Commit or snapshot SHA
- Analysis configuration
- Renderer version
- Art style
- Random seed

Anthesis must generate the same structural artwork.

This allows generated pieces to act as historical artifacts rather than disposable illustrations.

### 3.3 Organic, Not Diagrammatic

The output should not resemble a standard Git graph with flowers attached to it.

The system should use botanical growth rules, curved geometry, asymmetry, phyllotaxis, procedural texture, and controlled variation so the result feels grown rather than plotted.

### 3.4 Honest Scaling

Large repositories and small repositories must both produce useful artwork.

Raw line counts cannot map directly to visual size because software metrics are highly skewed. Anthesis must normalize and cap extreme values while retaining meaningful differences.

### 3.5 Deletion Is Not Damage

Removing code is often a sign of improvement.

Deletions should be represented as pruning, curling, refinement, cutouts, or negative space rather than automatically appearing as decay or injury.

### 3.6 Art First, Inspection Available

The default output should be aesthetically coherent without requiring a legend.

Interactive or annotated modes may expose the underlying data for users who want to inspect the history represented by each feature.

---

## 4. Primary User Experiences

### 4.1 Repository Portrait

Generate one complete plant representing the lifetime of a repository.

Best suited for:

- README artwork
- Project websites
- Posters
- Retrospectives
- Portfolio pieces
- Repository comparisons

### 4.2 Release Bouquet

Generate one flower per release and arrange the flowers chronologically as a bouquet.

Best suited for:

- Comparing releases
- Annual project reports
- Product evolution timelines
- Release retrospectives

### 4.3 Growth Timelapse

Animate the repository from its first commit to the selected snapshot.

The plant should visibly:

- Establish roots
- Extend its main stem
- Produce branches
- Form buds
- Bloom at releases
- Gain leaves from tests and documentation
- Carry scars from reverts or failed milestones

The animation should be pausable at any point and exportable as a still image.

### 4.4 Interactive Exploration

Allow users to click or hover over botanical elements to inspect the underlying event.

Examples:

- Click a petal to open its pull request.
- Hover over a stem node to view a commit.
- Click a flower center to inspect issue activity.
- Select a release to view its metrics.
- Toggle contributors, branches, tests, documentation, or issue overlays.

### 4.5 Herbarium

A collection view for generated repository portraits.

Each entry should include:

- Artwork
- Repository name
- Snapshot SHA
- Generation date
- Renderer version
- Summary metrics
- Configuration
- Provenance metadata

---

## 5. Initial Visual Grammar

The following mappings define the first design hypothesis. They should be treated as configurable rules rather than permanent assumptions.

| Repository signal | Botanical representation |
|---|---|
| Default branch | Main stem |
| Repository age | Overall stem height |
| Commit cadence | Distance between growth nodes |
| Feature branch | Side stem |
| Branch lifespan | Side-stem length |
| Branch commit count | Side-stem thickness |
| Merge event | Side stem reconnecting to main growth |
| Unmerged branch | Open branch ending in a bud |
| Release or milestone | Flower |
| Pull request | Petal |
| PR additions | Petal length |
| PR deletions | Petal curl, cutout, or negative space |
| PR files changed | Petal width |
| PR commits | Petal veins or subdivisions |
| Contributor distribution | Symmetry and petal grouping |
| Review activity | Surface texture or edge detail |
| Open issues | Unfilled seeds or unopened buds |
| Closed issues | Filled seeds |
| Reopened issues | Ringed, split, or layered seeds |
| Test changes | Leaves |
| Documentation changes | Smaller supporting leaves |
| Revert | Scar, knot, or thorn |
| Failed release | Broken bloom ring or visible interruption |
| Dependency foundation | Root density |
| Major component or directory | Root or vascular branch family |

---

## 6. Recommended Composition

The first implementation should use one plant for the repository lifetime.

Time flows vertically from bottom to top.

- The first commit begins near the root crown.
- The default branch forms the central stem.
- Significant feature branches emerge from the point in time where they diverged.
- Merged branches reconnect or visually feed into the main structure.
- Releases bloom along the vertical timeline.
- Recent activity appears near the top.
- Unmerged work ends as buds or unfinished branches.

This creates a visual reading that is understandable without reproducing the complete commit graph.

The artwork should preserve important topology while simplifying unimportant detail.

---

## 7. Repository Phenotype Model

Anthesis should calculate a normalized feature vector describing the repository.

An initial phenotype may include:

\[
F =
[
activity,
growth,
pruning,
branching,
collaboration,
review,
stability,
resolution,
testing,
documentation
]
\]

These values can influence plant-wide properties.

| Feature | Possible visual effect |
|---|---|
| Activity | Plant height and node density |
| Growth | Stem extension and bloom scale |
| Pruning | Negative space and curvature |
| Branching | Number and complexity of side stems |
| Collaboration | Radial symmetry and grouping |
| Review | Surface detail and texture |
| Stability | Regularity and continuity |
| Resolution | Seed completion and flower-center density |
| Testing | Leaf density |
| Documentation | Supporting leaf forms |

The phenotype should not attempt to assign an overall quality score. It describes the character of development, not whether that development was good or bad.

---

## 8. Metric Normalization

Repository metrics are extremely uneven. A single generated file, dependency lock update, or migration may otherwise dominate the artwork.

Anthesis should use logarithmic normalization with configurable percentile clipping.

A possible normalization function is:

\[
N(x) =
clamp
\left(
\frac{\log(1+x)}
{\log(1+Q_{95})},
0,
1
\right)
\]

Where:

- \(x\) is the raw metric.
- \(Q_{95}\) is the 95th percentile for the relevant dataset.
- `clamp` limits the output to the range 0 through 1.

For a pull request \(j\):

\[
PetalLength_j =
L_{min} + (L_{max}-L_{min})N(A_j + D_j)
\]

\[
PetalWidth_j =
W_{min} + (W_{max}-W_{min})N(F_j)
\]

\[
PetalCurl_j =
\frac{D_j}{A_j+D_j+\epsilon}
\]

Where:

- \(A_j\) is additions.
- \(D_j\) is deletions.
- \(F_j\) is files changed.
- \(\epsilon\) prevents division by zero.

Anthesis should support two scaling modes:

### Repository-Relative Scaling

Metrics are normalized against the repository's own history.

Advantages:

- Produces visually expressive individual works.
- Small repositories still generate detailed artwork.

Disadvantages:

- Artwork from different repositories is not directly comparable.

### Globally Comparable Scaling

Metrics use shared thresholds or a reference corpus.

Advantages:

- Repository size and activity remain comparable.
- Useful for galleries, dashboards, and project portfolios.

Disadvantages:

- Small repositories may appear visually sparse.

The renderer should record the selected scaling mode in the output metadata.

---

## 9. Collaboration Model

Contributor distribution can influence flower symmetry and structure.

A normalized entropy score may be used:

\[
H =
\frac{-\sum_i p_i\log(p_i)}
{\log(n)}
\]

Where:

- \(p_i\) is the proportion of work attributed to contributor \(i\).
- \(n\) is the number of contributors.

Possible interpretation:

- Low entropy: directional or asymmetrical growth.
- High entropy: more radially distributed growth.
- Contributor clusters: grouped petals, vein patterns, or repeated forms.

This mapping must remain descriptive rather than judgmental. Solo development and broad collaboration should produce different visual identities, not good and bad versions of the same plant.

Contributor identity should not depend solely on raw Git email addresses. The system should support alias merging.

---

## 10. Flower-Center and Issue Model

Issue activity may be represented through phyllotaxis.

Seed positions can follow the golden angle:

\[
\theta_i = i \times 137.5^\circ
\]

\[
r_i = c\sqrt{i}
\]

Possible mappings:

- Closed issue: filled seed.
- Open issue: hollow seed.
- Reopened issue: ringed seed.
- Issue age: seed size or distance from center.
- Issue label: subtle geometric variation.
- Milestone completion: proportion of filled center.

A basic issue-resolution ratio may be:

\[
R =
\frac{issues\ closed}
{issues\ opened + issues\ closed + \epsilon}
\]

Issue volume and resolution should be shown separately. A project with many resolved issues should not look identical to one with very little issue activity.

---

## 11. Data Sources

### 11.1 Git-Only Data

A local Git repository can provide:

- Commits
- Commit parents
- Merge commits
- Authors
- Timestamps
- Additions and deletions
- Files changed
- Renames
- Tags
- Reachable branch references
- Directory and file-type activity

### 11.2 Forge-Enriched Data

GitHub, GitLab, or another forge may provide:

- Pull requests or merge requests
- Historical branch names
- Reviews
- Review comments
- Issues
- Issue labels
- Milestones
- CI checks
- Releases
- Contributors
- Bots
- Merge strategy
- Links to source events

The architecture should not assume GitHub is the only forge.

Use a provider abstraction so support can be added for:

- GitHub
- GitLab
- Gitea
- Forgejo
- Bitbucket
- Other compatible systems

### 11.3 Important Limitations

Git does not permanently preserve all historical branch names.

Deleted branches may leave commits and topology behind without retaining their original names. Squash merges and rebases may also remove or flatten development structure.

Anthesis should therefore support:

- **Git-only mode:** derives visual units from commits, tags, and merge topology.
- **Forge-enriched mode:** uses actual pull requests, issues, reviews, and historical branch metadata.

The generated artwork must record which data mode was used.

---

## 12. Data Cleaning and Exclusions

Lines-of-code metrics can be distorted by:

- Generated code
- Vendored dependencies
- Lock files
- Minified assets
- Build output
- Binary files
- Formatting-only commits
- Large renames
- Dependency update bots
- Database migrations
- Imported source trees

Anthesis should support configurable exclusion rules.

Example:

```yaml
exclude:
  paths:
    - vendor/**
    - dist/**
    - generated/**
    - node_modules/**
  files:
    - package-lock.json
    - poetry.lock
  patterns:
    - "*.min.js"
    - "*.map"
```

The analysis layer should separately track excluded activity so users can understand how much data was omitted.

Renames should use Git similarity detection where practical to avoid counting file movement as complete deletion and addition.

---

## 13. Proposed System Architecture

Anthesis should be divided into clear stages.

```text
Repository / Forge
        |
        v
+------------------+
| Data Collectors  |
+------------------+
        |
        v
+------------------+
| Canonical Model  |
+------------------+
        |
        v
+------------------+
| Metric Analysis  |
+------------------+
        |
        v
+------------------+
| Botanical Model  |
+------------------+
        |
        v
+------------------+
| Geometry Engine  |
+------------------+
        |
        v
+------------------+
| Style Renderer   |
+------------------+
        |
        v
 SVG / PNG / Web / Animation
```

### 13.1 Data Collectors

Responsibilities:

- Read local Git history.
- Query forge APIs when configured.
- Resolve contributors.
- Collect commits, branches, tags, releases, PRs, issues, reviews, and checks.
- Cache collected data.
- Preserve source identifiers and URLs.

### 13.2 Canonical Repository Model

Provider-specific data should be converted into a stable internal schema.

Core entities may include:

- Repository
- Snapshot
- Commit
- Branch
- Merge
- PullRequest
- Release
- Issue
- Review
- Contributor
- FileChange
- TimePeriod

The canonical model must separate factual source data from derived metrics.

### 13.3 Metric Analysis

Responsibilities:

- Apply exclusions.
- Aggregate activity by release, PR, branch, contributor, and time.
- Calculate additions, deletions, churn, cadence, duration, issue resolution, review activity, and contributor distribution.
- Normalize values.
- Identify significant events.
- Produce the repository phenotype.

### 13.4 Botanical Model

The botanical model is an intermediate representation between repository data and graphics.

Possible entities:

- Plant
- Root
- Stem
- Node
- Branch
- Leaf
- Bud
- Flower
- Petal
- Seed
- Scar
- Thorn

Each botanical entity should contain:

- Geometry intent
- Source event references
- Normalized metric inputs
- Semantic role
- Deterministic seed
- Optional interaction metadata

This layer is essential. It prevents repository analysis from becoming tightly coupled to one renderer.

### 13.5 Geometry Engine

Responsibilities:

- Convert the botanical model into paths and coordinates.
- Generate stems using Bézier curves.
- Arrange petals.
- Apply phyllotaxis.
- Avoid excessive overlap.
- Simplify dense histories.
- Create deterministic procedural variation.
- Produce scene geometry independent of final art style.

### 13.6 Style Renderer

The first renderer should target SVG.

Later renderers may add:

- Canvas
- PNG
- WebGL
- Animated SVG
- Video
- High-resolution print output
- Plotter or pen-drawing formats

Art styles should be applied after structural geometry is created.

Possible styles:

- Botanical scientific illustration
- Watercolor
- Ink
- Engraving
- Oil paint
- Blueprint
- Stained glass
- Minimal vector
- Mechanical botanical
- Steampunk botanical

---

## 14. Deterministic Seed Model

The render seed should be derived from stable inputs.

Example:

```text
seed = hash(
  repository_identity
  + snapshot_sha
  + analysis_config_hash
  + renderer_version
  + style_name
)
```

The seed may control:

- Minor petal rotation
- Stem waviness
- Vein placement
- Brush direction
- Texture noise
- Leaf orientation
- Small compositional offsets

It must not change:

- Number of major branches
- Number of releases
- Event ordering
- Metric-derived proportions
- Source-event relationships

---

## 15. Technology Direction

The first version should favor inspectability and iteration speed over photorealism.

A practical initial stack may include:

- A CLI for analysis and rendering
- Local Git access through Git commands or a Git library
- Optional GitHub provider
- A typed canonical data model
- SVG as the primary output
- JSON as the persisted analysis and botanical intermediate formats
- A small web viewer for interactivity
- Snapshot tests for deterministic geometry

Possible implementation languages:

### Python

Advantages:

- Strong data-processing ecosystem
- Fast experimentation
- Easy CLI development
- Good graph and numerical libraries

Potential libraries:

- GitPython or direct Git subprocess calls
- Pydantic
- NetworkX
- NumPy
- svgwrite or custom SVG generation
- FastAPI for an optional local service

### TypeScript

Advantages:

- Natural fit for interactive SVG and web tooling
- Shared types between CLI, renderer, and browser
- Strong GitHub API tooling
- Easier interactive frontend integration

Potential libraries:

- simple-git
- Octokit
- D3
- SVG.js
- Zod
- React or a lightweight viewer

### Recommended Initial Decision

Use whichever language best supports the coding agent and expected maintainer workflow, but preserve the architectural boundaries in this document.

The most important early decision is not Python versus TypeScript. It is maintaining separation between:

1. Data collection
2. Canonical repository history
3. Metric analysis
4. Botanical interpretation
5. Geometry
6. Art style

---

## 16. Proposed CLI

A possible interface:

```bash
anthesis analyze ./repository
anthesis analyze ./repository --provider github
anthesis grow analysis.json
anthesis render plant.json --style botanical
anthesis render plant.json --style watercolor
anthesis portrait ./repository --output portrait.svg
anthesis timelapse ./repository --output growth.mp4
anthesis explain portrait.svg
```

Possible concepts:

- `analyze`: collect and normalize repository history.
- `grow`: convert repository metrics into the botanical model.
- `render`: create art from a botanical model.
- `portrait`: run the complete still-image pipeline.
- `timelapse`: generate an animated history.
- `explain`: produce a legend or provenance report.

---

## 17. Output Provenance

Every generated work should include machine-readable provenance.

Example:

```json
{
  "project": "Anthesis",
  "repository": "owner/repository",
  "snapshot_sha": "7f31c92",
  "period_start": "2025-01-01T00:00:00Z",
  "period_end": "2026-08-03T00:00:00Z",
  "analysis_mode": "forge-enriched",
  "provider": "github",
  "scaling_mode": "repository-relative",
  "renderer_version": "0.1.0",
  "style": "botanical",
  "configuration_hash": "abc123",
  "seed": "..."
}
```

A human-readable genome card may accompany exported artwork:

```text
ANTHESIS

Repository: owner/repository
Snapshot: 7f31c92
Period: January 2025 – August 2026
Commits: 1,247
Pull requests: 186
Contributors: 14
Additions: 328,410
Deletions: 149,220
Renderer: Botanical Grammar v1
```

---

## 18. Minimum Viable Product

The first MVP should prove that repositories with different histories produce recognizably different and meaningful plants.

### MVP Scope

1. Accept a local Git repository.
2. Read commits, parents, merges, authors, timestamps, tags, additions, deletions, and files changed.
3. Support configurable file exclusions.
4. Divide history into releases when tags exist.
5. Fall back to monthly blooms when releases do not exist.
6. Render the default branch as the main stem.
7. Render significant merge branches as side stems.
8. Render one flower per release or month.
9. Use commit clusters as petals in Git-only mode.
10. Map additions and deletions to petal geometry.
11. Map test activity to leaves.
12. Map documentation activity to supporting leaves.
13. Represent reverts as scars or thorns.
14. Export deterministic SVG.
15. Export analysis data and botanical-model JSON.
16. Include a visible or embedded provenance record.

### MVP Non-Goals

Do not require the first version to include:

- Multiple forge providers
- Photorealistic rendering
- AI image generation
- Full commit-level graph fidelity
- Perfect historical branch recovery
- Video export
- Real-time Git monitoring
- Collaboration dashboards
- Marketplace or print ordering
- Automated aesthetic optimization

---

## 19. Suggested First Prototype Grammar

To keep the first renderer understandable:

1. The default branch is the central stem.
2. Time runs bottom to top.
3. Tags create flowers.
4. Months create flowers when tags are absent.
5. Significant merged branches create side stems.
6. Commit clusters create petals.
7. Total changed lines control petal length.
8. Files changed control petal width.
9. Deletion ratio controls petal curl or cutout.
10. Tests create large leaves.
11. Documentation creates smaller leaves.
12. Reverts create small scars.
13. The snapshot SHA seeds decorative variation.

A branch or event should be considered significant only after crossing configurable thresholds. Rendering every branch and commit will create visual noise.

---

## 20. Design Questions for the Architecture Phase

The coding agent should explicitly investigate and document decisions for the following questions.

### Data and Semantics

- What is the canonical definition of a release?
- How should repositories without tags be segmented?
- How should squash merges be interpreted?
- How should rebased or deleted branches be represented?
- What qualifies as a significant branch?
- How should bots and automated dependency updates be handled?
- How should contributor aliases be merged?
- Should line changes be measured at commit, PR, release, or file level?
- How should renames and formatting-only changes be detected?

### Visual Grammar

- How many flowers can be displayed before the plant becomes unreadable?
- When should multiple releases be grouped?
- How should extremely large PRs or commits be capped?
- How can deletion be visually distinct without appearing negative?
- What information belongs in geometry versus texture?
- How should the system preserve aesthetics across very different repositories?
- Which mappings are intuitive enough to survive without a legend?

### Architecture

- What belongs in the canonical repository model?
- What belongs in the botanical intermediate representation?
- Should analysis and rendering be separate packages?
- Which renderer should be authoritative for deterministic tests?
- How should renderer-version changes affect reproducibility?
- How should provider adapters expose missing or uncertain data?
- What cache format should be used for forge data?

### Testing

- How will deterministic output be verified?
- Which synthetic repositories should be created as fixtures?
- How will visual regressions be detected?
- How should normalization be tested against extreme values?
- How will the system verify that excluded files do not influence geometry?
- How will source events be traced from artwork back to repository data?

---

## 21. Required Test Repositories

Create small synthetic repositories whose histories intentionally exercise specific visual behaviors.

### Fixture A: Steady Growth

- One contributor
- Frequent small commits
- Few branches
- Regular tags
- Mostly additions

Expected result:

- Tall, regular stem
- Consistent flower spacing
- Directional but orderly blooms

### Fixture B: Collaborative Release

- Several contributors
- Multiple merged branches
- Similar contribution sizes
- High review activity

Expected result:

- Greater radial symmetry
- More side stems
- Richer flower texture

### Fixture C: Major Refactor

- Large deletions
- Reduced final code size
- Strong test activity
- Few new features

Expected result:

- Refined bloom with substantial negative space
- Strong leaf structure
- No visual implication of failure

### Fixture D: Chaotic Experimentation

- Many short-lived branches
- Reverts
- Irregular commit cadence
- Unmerged work

Expected result:

- Irregular branching
- Buds that do not bloom
- Visible scars
- Uneven node spacing

### Fixture E: Documentation-Heavy Project

- Frequent documentation changes
- Modest source changes
- Regular releases

Expected result:

- Smaller blooms
- Rich supporting foliage

---

## 22. Acceptance Criteria for the First Design

The design phase is complete when the coding agent produces:

1. A proposed repository structure.
2. A canonical data schema.
3. A botanical intermediate schema.
4. A documented normalization strategy.
5. A deterministic seed strategy.
6. A first-pass SVG rendering architecture.
7. A provider abstraction design.
8. A clear Git-only MVP boundary.
9. Synthetic repository fixtures.
10. A test strategy covering metrics, determinism, and visual regressions.
11. A phased implementation plan.
12. At least one generated prototype from a real repository.
13. A legend explaining how visible features map to source data.
14. A list of known ambiguities and intentionally deferred decisions.

---

## 23. Proposed Development Phases

### Phase 1: Research and Schema Design

- Inspect Git history edge cases.
- Define canonical entities.
- Define botanical entities.
- Establish normalization rules.
- Build synthetic fixtures.
- Decide language and package boundaries.

### Phase 2: Git-Only Analyzer

- Read local repository history.
- Collect commit and diff statistics.
- Detect tags and merges.
- Apply exclusions.
- Export canonical analysis JSON.

### Phase 3: Botanical Interpreter

- Convert history into stems, branches, flowers, petals, leaves, and scars.
- Implement deterministic seeding.
- Produce botanical-model JSON.
- Add explainability metadata.

### Phase 4: SVG Renderer

- Draw stems with Bézier curves.
- Arrange petals and seeds.
- Add leaves and scars.
- Export scalable deterministic SVG.
- Add visual snapshot tests.

### Phase 5: Interactive Viewer

- Load the SVG and provenance data.
- Add hover and click interactions.
- Link visual elements to commits, tags, or source events.
- Provide a legend and metric inspector.

### Phase 6: Forge Enrichment

- Add a GitHub provider first.
- Incorporate PRs, issues, reviews, and releases.
- Replace inferred events with authoritative forge data when available.

### Phase 7: Art Styles and Animation

- Add multiple rendering styles.
- Add growth animation.
- Add high-resolution print output.
- Add bouquet and herbarium modes.

---

## 24. Long-Term Possibilities

Anthesis could eventually support:

- Repository portraits embedded in README files
- Release art generated by CI
- Annual project-growth reports
- Team and contributor gardens
- Open-source ecosystem herbariums
- Side-by-side repository phenotype comparisons
- Printed posters and archival editions
- Animated release histories
- Physical pen-plotter output
- NFT-like provenance without requiring blockchain
- Museum-style exhibits of major open-source projects
- A GitGraph integration that switches between analytical and artistic views
- A plugin API for custom visual grammars
- Domain-specific plants for infrastructure, data science, web applications, or AI systems

---

## 25. Final Product Definition

**Anthesis is a deterministic generative botanical art engine that converts Git repository history into a living visual phenotype.**

It should not simply decorate source-control data. It should create an artwork whose growth, branching, pruning, foliage, flowers, seeds, scars, and symmetry emerge from the actual history of the software.

The system succeeds when two repositories with meaningfully different development histories produce plants that are visibly different, aesthetically coherent, reproducible, and explainable.

> **Every repository grows differently.**

