import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { DOMParser } from "@xmldom/xmldom";
import { svgProvenanceV2Schema } from "../../src/render/svg/v2/metadata.js";
import { COARSE_ACCEPTANCE_V1 } from "../../src/composition/model.js";

const exec = promisify(execFile);
async function pipeline(dir:string,style="botanical-plate",suffix="one") {
  const analysis="test/fixtures/botanical-v2/six-episode-analysis.json", plant=join(dir,"plant.json"), geometry=join(dir,"geometry.json"), svg=join(dir,`${suffix}.svg`);
  if(suffix==="one") await exec(process.execPath,["dist/cli/index.js","grow",analysis,"--output",plant,"--grammar","botanical-v2","--structural-seed","plate-structure","--decorative-seed","plate-detail"]);
  await exec(process.execPath,["dist/cli/index.js","geometry",plant,"--output",geometry,"--grammar","botanical-v2"]);
  await exec(process.execPath,["dist/cli/index.js","render-v2",plant,"--geometry",geometry,"--analysis",analysis,"--output",svg,"--grammar","botanical-v2","--style",style,...(suffix==="one"?["--contact-sheet",join(dir,"contact.svg")]:[])]);
  return {svg:await readFile(svg,"utf8"),provenance:await readFile(svg.replace(/\.svg$/,".provenance.json"),"utf8"),geometry:await readFile(geometry,"utf8"),plant:JSON.parse(await readFile(plant,"utf8"))};
}

test("authoritative SVG v2 pipeline is deterministic, accessible, traceable and style-independent",async()=>{
  const dir=await mkdtemp(join(tmpdir(),"anthesis-svg-v2-")), a=await pipeline(dir), b=await pipeline(dir,"botanical-plate","two"), mono=await pipeline(dir,"monochrome","mono");
  assert.equal(a.svg,b.svg); assert.equal(a.provenance,b.provenance); assert.equal(a.geometry,mono.geometry);
  const doc=new DOMParser().parseFromString(a.svg,"image/svg+xml"), root=doc.documentElement;
  assert.ok(root); assert.equal(root.getAttribute("data-anthesis-contract"),"svg-provenance-v2"); assert.equal(root.getAttribute("role"),"img");
  assert.ok(doc.getElementById("anthesis-title")); assert.ok(doc.getElementById("anthesis-description")); assert.equal(doc.getElementsByTagName("parsererror").length,0);
  assert.equal(doc.getElementsByTagName("circle").length,0); assert.equal(doc.getElementsByTagName("ellipse").length,0); assert.equal(doc.getElementsByTagName("text").length,0);
  const provenance=svgProvenanceV2Schema.parse(JSON.parse(a.provenance)); assert.equal(root.getAttribute("data-geometry-sha256"),provenance.artifactHashes.geometry);
  assert.equal(doc.getElementById("anthesis-provenance")!.textContent,a.provenance.trimEnd());
  const index=JSON.parse(doc.getElementById("anthesis-feature-provenance")!.textContent!);
  const groups=Array.from(doc.getElementsByTagName("g")).filter(g=>g.hasAttribute("data-feature-id")); assert.ok(groups.length>20);
  for(const group of groups){const id=group.getAttribute("data-feature-id")!; assert.ok(index[id].derivation); assert.ok(index[id].sourceRefs.length||index[id].metricRefs.length); assert.equal(group.getAttribute("tabindex"),"0");}
  const geometry=JSON.parse(a.geometry); assert.ok(geometry.composition.componentScores.collision<=COARSE_ACCEPTANCE_V1.collisionScoreMax); assert.ok(geometry.composition.componentScores.congestion<=COARSE_ACCEPTANCE_V1.congestionScoreMax); assert.ok(geometry.composition.componentScores.crossings<=COARSE_ACCEPTANCE_V1.crossingScoreMax);
  assert.ok(a.svg.includes('width="210mm" height="297mm"')); assert.ok(!a.svg.includes("NaN")&&!a.svg.includes("Infinity")); assert.ok((await readFile(join(dir,"contact.svg"),"utf8")).includes("Top four deterministic composition candidates")); assert.equal(a.plant.source.snapshotSha,provenance.snapshotSha);
});

test("SVG v2 stays dark-launched and annotations are opt-in",async()=>{
  const dir=await mkdtemp(join(tmpdir(),"anthesis-svg-off-")),analysis="test/fixtures/botanical-v2/six-episode-analysis.json",plant=join(dir,"plant.json"),geometry=join(dir,"geometry.json"),svg=join(dir,"off.svg");
  await exec(process.execPath,["dist/cli/index.js","grow",analysis,"--output",plant,"--grammar","botanical-v2"]); await exec(process.execPath,["dist/cli/index.js","geometry",plant,"--output",geometry,"--grammar","botanical-v2"]);
  await assert.rejects(exec(process.execPath,["dist/cli/index.js","render-v2",plant,"--geometry",geometry,"--analysis",analysis,"--output",svg]));
});
