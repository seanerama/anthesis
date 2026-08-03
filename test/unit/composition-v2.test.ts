import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {repositoryAnalysisV2Schema} from "../../src/analysis/v2/model.js";
import {interpretAster} from "../../src/botany/v2/interpreter.js";
import {COARSE_ACCEPTANCE_V1,type CandidateFeature} from "../../src/composition/model.js";
import {evaluateCandidate,selectCandidate} from "../../src/composition/score.js";
import {buildCandidateGeometry,evaluateSceneCandidate,generateCandidates,generateGeometryV2} from "../../src/geometry/v2/index.js";
import {axisCurves} from "../../src/geometry/v2/axes.js";
import {leafGeometry} from "../../src/geometry/v2/leaves.js";
import {canonicalJson} from "../../src/shared/canonical-json.js";

async function fixture(){return repositoryAnalysisV2Schema.parse(JSON.parse(await readFile("test/fixtures/botanical-v2/six-episode-analysis.json","utf8")));}
function units(base:Awaited<ReturnType<typeof fixture>>,count:number){const a=structuredClone(base),source=a.episodes;a.episodes=Array.from({length:count},(_,i)=>{const e=structuredClone(source[i%source.length]!);e.id=`episode-${String(i+1).padStart(3,"0")}`;e.status=i===count-1?"unreleased":"released";e.sourceRefs=e.sourceRefs.map((r,j)=>({...r,id:`${r.id}-${i}-${j}`}));e.provenance.sourceRefs=e.sourceRefs;return e;});return a;}

test("versioned thresholds gate 1/3/8/20/60 fixtures and scores reproduce independently",async()=>{
 assert.deepEqual(COARSE_ACCEPTANCE_V1,{version:"coarse-acceptance-v1",collisionScoreMax:500,congestionScoreMax:300,crossingScoreMax:80,severeBloomOverlapAreaMax:900});
 const base=await fixture(),expected:ReadonlyArray<readonly[number,number,number,number,number]>=[[1,1,41,13,23],[3,24,114,3,18],[8,10,129,0,11],[20,17,122,16,16],[60,8,101,23,54]];
 for(const[count,index,collision,congestion,crossings]of expected){const scene=interpretAster(units(base,count),{structuralSeed:`units-${count}`,decorativeSeed:"fixed"}),geometry=generateGeometryV2(scene,{enabled:true}),candidate=generateCandidates(scene)[geometry.composition.selectedIndex]!,reproduced=evaluateSceneCandidate(scene,candidate);assert.deepEqual([count,geometry.composition.selectedIndex,geometry.composition.componentScores.collision,geometry.composition.componentScores.congestion,geometry.composition.componentScores.crossings],[count,index,collision,congestion,crossings]);assert.deepEqual(reproduced.componentScores,geometry.composition.componentScores);assert.equal(reproduced.totalScore,geometry.composition.totalScore);assert.deepEqual(reproduced.hardViolations,[]);assert.ok(collision<=COARSE_ACCEPTANCE_V1.collisionScoreMax);assert.ok(congestion<=COARSE_ACCEPTANCE_V1.congestionScoreMax);assert.ok(crossings<=COARSE_ACCEPTANCE_V1.crossingScoreMax);const b=geometry.composition.occupiedBounds;assert.ok(b.minX>=geometry.viewport.safeInset&&b.maxX<=geometry.viewport.width-geometry.viewport.safeInset&&b.minY>=geometry.viewport.safeInset&&b.maxY<=geometry.viewport.height-geometry.viewport.safeInset);}
});

test("every candidate control changes concrete layout and repair changes congested foliage",async()=>{
 const scene=interpretAster(await fixture(),{structuralSeed:"controls",decorativeSeed:"fixed"}),base=generateCandidates(scene)[0]!,wire=(c:typeof base)=>canonicalJson([...buildCandidateGeometry(scene,c).layers].map(([id,p])=>[id,p]));
 for(const key of["lean","crownScale","verticalScale","bloomScale","branchSpread","rootSpread","phase"]as const)assert.notEqual(wire(base),wire({...base,[key]:base[key]+.07}),`${key} must affect geometry`);
 const crowded={...base,phase:0,crownScale:1},axes=axisCurves(scene,crowded),raw=scene.plant.leaves.map(x=>leafGeometry(x,axes,{arcOffset:0,angleOffset:0,scale:1}).bounds),repaired=buildCandidateGeometry(scene,crowded),leafBounds=scene.plant.leaves.map(x=>repaired.featureBounds[x.id]!),overlap=(xs:typeof raw)=>xs.reduce((sum,a,i)=>sum+xs.slice(i+1).reduce((n,b)=>n+Math.max(0,Math.min(a.maxX,b.maxX)-Math.max(a.minX,b.minX))*Math.max(0,Math.min(a.maxY,b.maxY)-Math.max(a.minY,b.minY)),0),0);assert.equal(leafBounds.length,scene.plant.leaves.length);assert.ok(overlap(leafBounds)<overlap(raw),"bounded repair reduces leaf congestion");
});

test("hard coarse limits reject harmful overlap but ignore expected attachments",()=>{
 const candidate:any={index:0},b={minX:100,minY:100,maxX:300,maxY:300},point={x:200,y:200},organ=(id:string):CandidateFeature=>({id,kind:"leaf",bounds:b,center:point,primary:false}),axis=(id:string,parentId?:string):CandidateFeature=>({id,kind:"axis",bounds:b,center:point,primary:id==="axis-main",...(parentId?{parentId}:{})});
 const collision=evaluateCandidate(candidate,[organ("a"),organ("b")],new Map(),[],{width:1000,height:1000,safeInset:0});assert.ok(collision.hardViolations.includes("coarse-collision-limit"));assert.throws(()=>selectCandidate([collision]));
 const expected=evaluateCandidate(candidate,[axis("axis-main"),axis("branch","axis-main")],new Map(),[],{width:1000,height:1000,safeInset:0});assert.equal(expected.componentScores.crossings,0);
 const attachment=evaluateCandidate(candidate,[axis("axis-main"),{...organ("leaf"),parentId:"axis-main"}],new Map(),[],{width:1000,height:1000,safeInset:0});assert.equal(attachment.componentScores.collision,0);
 const crossing=evaluateCandidate(candidate,[axis("axis-a"),axis("axis-b")],new Map(),[],{width:1000,height:1000,safeInset:0});assert.ok(crossing.hardViolations.includes("coarse-crossing-limit"));
 const overflow=evaluateCandidate(candidate,[{...organ("outside"),bounds:{minX:-1,minY:100,maxX:10,maxY:120}}],new Map(),[],{width:1000,height:1000,safeInset:0});assert.ok(overflow.hardViolations.includes("canvas-overflow"));
});
