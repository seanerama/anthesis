# Stage 1: Prove the end-to-end portrait spine

- **Type:** feature
- **Depends on:** none
- **Work item:** https://github.com/seanerama/anthesis/issues/1

## Objectives

Deliver the Stage 0 walking skeleton: one real tagged Git fixture travels through
collection, canonical JSON, botanical JSON, deterministic SVG, a browser viewer,
CI, and a Render deployment. This proves every architectural boundary without
attempting the full repository grammar.

## What to build

- Pin the Node.js LTS runtime and package manager; add strict TypeScript, frozen
  dependency installation, build, test, and lint/type-check commands.
- Create the module boundaries documented in `docs/architecture.md` in one package.
- Create a deterministic synthetic Git fixture with two commits and one tag.
- Implement `anthesis portrait <repo> --output <file>` for the fixture-sized path.
- Emit v1 canonical JSON, botanical JSON, SVG, and provenance sidecar.
- Render one main stem and one tagged flower in a static Vite viewer.
- Extend CI to execute the actual build, tests, two-run byte comparison, SVG
  validation, and viewer production build.
- Add the Render static-site configuration and a post-deploy HTTP/UI smoke asset.

## Interface contracts

- **Exposes:** runnable CLI spine, module boundaries, generated fixture artifacts,
  deployed viewer, and CI/deploy gates inherited by every later stage.
- **Consumes:** `contracts/canonical-repository-model.md`,
  `contracts/botanical-scene-model.md`, and `contracts/svg-provenance.md` exactly as
  frozen at v1.

## Testing requirements

- Unit-test v1 serialization and validation at every persisted boundary.
- Run an integration test from a real temporary Git repository through SVG output.
- Run the CLI twice from clean output directories and compare canonical JSON,
  botanical JSON, SVG, and provenance bytes.
- Assert the SVG is well-formed and includes a visible stem, flower, tag source
  reference, and valid embedded provenance identical to the sidecar.
- Build the viewer and author a smoke check that verifies HTTP 200 plus the visible
  portrait and provenance identifier on the deployed Render URL.

## Acceptance conditions

- [ ] `ANTHESIS_VIEWER_ENABLED` gates the viewer, defaults OFF, and is enabled only
      in the Stage 0 Render environment after CI passes
- [ ] UI-smoke "observably-works" check authored for any user-facing surface
- [ ] Additive migration only (no destructive schema change)
- [ ] Existing suite stays green; CI all-green
- [ ] A clean checkout installs from the frozen lockfile and builds without warnings
- [ ] A non-repository path fails non-zero with a useful diagnostic
- [ ] The Render deployment serves the exact tested fixture portrait

## Pipeline test: YES

This is the pipeline-proving stage. It is not complete until the live Render smoke
check succeeds.
