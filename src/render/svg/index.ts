import type { CanonicalRepositoryV1 } from "../../canonical/model.js";
import type { BotanicalSceneV1 } from "../../botany/model.js";
import { canonicalJson, sha256 } from "../../shared/canonical-json.js";
import { layout, type Shape } from "../../geometry/index.js";
export type SvgProvenanceV1 = {
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
const esc = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
function shape(s: Shape): string {
  const data = `id="${esc(s.id)}" data-kind="${s.kind}" data-source-kind="${s.sourceKind}" data-source-ref="${esc(s.source)}" data-metrics="${esc(canonicalJson(s.intent))}"`;
  if (s.kind === "branch")
    return `  <path ${data} d="M 400 ${s.y} Q ${s.x} ${s.y - 50} ${s.x} ${s.y - 100}" fill="none" stroke="#46754b" stroke-width="12"><title>${esc(s.source)}</title></path>`;
  if (s.kind === "leaf")
    return `  <ellipse ${data} cx="${s.x}" cy="${s.y}" rx="${s.size}" ry="${s.size / 2}" fill="${s.intent.type === "testing" ? "#4f8b68" : "#7aa35b"}"><title>${esc(s.source)}</title></ellipse>`;
  if (s.kind === "scar")
    return `  <path ${data} d="M 382 ${s.y} L 418 ${s.y - 12}" stroke="#70483c" stroke-width="7"><title>${esc(s.source)}</title></path>`;
  if (s.kind === "petal") {
    const cutout =
      s.curl > 0
        ? `<circle cx="${s.x + s.size * 0.35}" cy="${s.y - s.width * 0.35}" r="${Math.max(1, s.curl * s.width * 0.45)}" fill="#f8f3e7"/>`
        : "";
    return `  <g ${data} data-curl="${s.curl}" transform="rotate(${s.angle} ${s.x} ${s.y})"><ellipse cx="${s.x}" cy="${s.y}" rx="${s.size}" ry="${s.width}" fill="#d45b78"/>${cutout}<title>${esc(s.source)}</title></g>`;
  }
  return `  <g ${data}><circle cx="${s.x}" cy="${s.y}" r="${s.size}" fill="#d45b78"/><circle cx="${s.x}" cy="${s.y}" r="12" fill="#f2c14e"/><title>${esc(s.source)}</title></g>`;
}
export function renderSvg(
  c: CanonicalRepositoryV1,
  b: BotanicalSceneV1,
  canonicalBytes: string,
  botanicalBytes: string,
): { svg: string; provenance: string } {
  const legacy = b.grammarVersion === "stage-0-v1",
    rendererVersion = legacy ? "stage-0-v1" : "mvp-svg-v1",
    p: SvgProvenanceV1 = {
      schemaVersion: 1,
      project: "Anthesis",
      repository: c.repository.identity,
      snapshotSha: c.repository.snapshotSha,
      periodStart: c.period.start,
      periodEnd: c.period.end,
      analysisMode: c.analysis.mode,
      scalingMode: b.generation.scalingMode,
      rendererVersion,
      grammarVersion: b.grammarVersion,
      style: "herbarium",
      configurationHash: c.analysis.configHash,
      seed: b.generation.seed,
      canonicalModelSha256: sha256(canonicalBytes),
      botanicalSceneSha256: sha256(botanicalBytes),
    },
    provenance = canonicalJson(p),
    g = layout(b);
  if (legacy) {
    const flowers = g.shapes
      .map(
        (f) =>
          `  <g id="${esc(f.id)}" data-source-kind="tag" data-source-ref="${esc(f.source)}"><circle cx="${f.x}" cy="${f.y}" r="${f.size}" fill="#d45b78"/><circle cx="${f.x}" cy="${f.y}" r="18" fill="#f2c14e"/><title>Tag ${esc(f.source)}</title></g>`,
      )
      .join("\n");
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" role="img" aria-labelledby="title description" data-anthesis-contract="svg-provenance-v1">\n  <title id="title">Anthesis repository portrait</title>\n  <description id="description">A main stem and tagged flower derived from Git history</description>\n  <metadata id="anthesis-provenance">${esc(provenance)}</metadata>\n  <rect width="800" height="1000" fill="#f8f3e7"/>\n  <path id="main-stem" d="M ${g.stem.x} ${g.stem.y1} C 350 680 450 440 ${g.stem.x} ${g.stem.y2}" fill="none" stroke="#315b3a" stroke-width="24" stroke-linecap="round"/>\n${flowers}\n</svg>\n`,
      provenance: `${provenance}\n`,
    };
  }
  const shapes = g.shapes.map(shape).join("\n");
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" role="img" aria-labelledby="title description" data-anthesis-contract="svg-provenance-v1">\n  <title id="title">Anthesis repository portrait</title>\n  <description id="description">Git history represented as deterministic botanical structure</description>\n  <metadata id="anthesis-provenance">${esc(provenance)}</metadata>\n  <rect width="800" height="1000" fill="#f8f3e7"/>\n  <path id="main-stem" data-kind="stem" data-source-kind="repository" data-source-ref="${esc(c.repository.identity)}" d="M ${g.stem.x} ${g.stem.y1} C 350 680 450 440 ${g.stem.x} ${g.stem.y2}" fill="none" stroke="#315b3a" stroke-width="${g.stem.width}" stroke-linecap="round"/>\n${shapes}\n</svg>\n`,
    provenance: `${provenance}\n`,
  };
}
