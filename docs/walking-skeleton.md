# Stage 0 — walking skeleton

## Outcome

Prove that Anthesis can inspect a real tiny Git history, derive a botanical scene,
render a deterministic SVG, show it in a browser, pass CI, and deploy the same tested
artifact to Render.

## Thin slice

1. Pin Node.js and the package manager; enable strict TypeScript and committed locks.
2. Create one synthetic repository fixture with two commits and one tag.
3. Implement the minimum `portrait <repo> --output <file>` path through every module.
4. Emit valid canonical-model and botanical-scene JSON matching frozen v1 contracts.
5. Map the history to one stem and one tagged flower; render deterministic SVG with
   embedded and sidecar provenance.
6. Serve the generated fixture portrait in a progressively enhanced static viewer.
7. In CI, type-check, run unit tests, run the CLI twice, assert byte-identical output,
   validate the SVG, build the viewer, and retain the generated artifacts.
8. Provision the Render static site from `main`, deploy, and perform an HTTP/UI smoke
   check against the live URL.

## Acceptance criteria

- A clean checkout installs from the frozen lockfile and builds without warnings.
- The CLI rejects a non-repository path with a non-zero status and useful message.
- The fixture produces schema-valid canonical and botanical JSON.
- Two clean executions produce byte-identical JSON, SVG, and provenance sidecar.
- The SVG contains a visible stem and flower tied to the fixture tag.
- At least one real integration test exercises Git collection through SVG output.
- CI is green on `main`; no test or deploy step is a placeholder.
- The Render URL returns HTTP 200 and displays the exact CI-built portrait.

## Explicitly deferred

Full-history metrics, exclusions, merge branches, untagged monthly blooms, multiple
styles, GitHub enrichment, interactive source inspection, PNG/video, and the full
five-fixture suite begin only after this spine is proven.

## Planner handoff

`$verity-plan` should decompose Stage 0 into the smallest dependency-ordered backlog,
then fold in the Git-only MVP from the design brief. All work must preserve the three
frozen v1 contracts and the accepted ADRs.
