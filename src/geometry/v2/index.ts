import type {BotanicalSceneV2} from "../../botany/v2/model.js";
import {semanticFingerprint} from "../../botany/v2/fingerprint.js";
import {serializeBotanicalSceneV2} from "../../botany/v2/model.js";
import {sha256} from "../../shared/canonical-json.js";
import {generateCandidates} from "../../composition/candidate.js";
import {COARSE_ACCEPTANCE_V1,DEFAULT_COMPOSITION,type Candidate,type CandidateFeature} from "../../composition/model.js";
import {repairMinorOrgans,type MinorOrganPlacement} from "../../composition/repair.js";
import {evaluateCandidate,selectCandidate} from "../../composition/score.js";
import {axisBounds,axisCurves,axisPrimitives,at} from "./axes.js";
import {boundsOf} from "./bezier.js";
import {budGeometry,flowerGeometry} from "./flowers.js";
import {leafGeometry} from "./leaves.js";
import {geometrySceneV2Schema,serializeGeometrySceneV2,type GeometryPrimitive,type GeometrySceneV2,type PathCommand} from "./model.js";
import {rootHierarchy} from "./roots.js";

export type GeometryV2Options={enabled?:boolean};
export function buildCandidateGeometry(scene:BotanicalSceneV2,c:Candidate){
 const axes=axisCurves(scene,c),layers=new Map<string,GeometryPrimitive[]>([["roots",[]],["stems",[]],["foliage",[]],["flowers",[]]]),featureBounds:Record<string,{minX:number;minY:number;maxX:number;maxY:number}>={},features:CandidateFeature[]=[],attachments=new Map<string,{x:number;y:number}>();
 for(const a of scene.plant.axes){const curve=axes.get(a.id)!,ps=axisPrimitives(curve),b=axisBounds(curve),parentId=a.parentAttachment?.parentAxisId;layers.get(a.kind.includes("root")?"roots":"stems")!.push(...ps);featureBounds[a.id]=b;features.push({id:a.id,kind:a.kind.includes("root")?"root":"axis",bounds:b,center:{x:(b.minX+b.maxX)/2,y:(b.minY+b.maxY)/2},primary:a.kind==="main-stem"||a.kind==="root",...(parentId?{parentId}:{})});}
 const initial=new Map<string,MinorOrganPlacement>(scene.plant.leaves.map((leaf,i)=>[leaf.id,{arcOffset:c.phase*((i%3)-1)*.4,angleOffset:c.phase*(i%2?1:-1)*2,scale:c.crownScale}])),leafById=new Map(scene.plant.leaves.map(x=>[x.id,x]));
 const placements=repairMinorOrgans(scene.plant.leaves.map(x=>x.id),initial,(id,p)=>leafGeometry(leafById.get(id)!,axes,p).bounds);
 for(const leaf of scene.plant.leaves){const g=leafGeometry(leaf,axes,placements.get(leaf.id)!);layers.get("foliage")!.push(...g.primitives);featureBounds[leaf.id]=g.bounds;features.push({id:leaf.id,kind:"leaf",bounds:g.bounds,center:{x:(g.bounds.minX+g.bounds.maxX)/2,y:(g.bounds.minY+g.bounds.maxY)/2},primary:false,parentId:leaf.attachment.parentAxisId});}
 for(const f of scene.plant.flowers){const g=flowerGeometry(f,axes,c.bloomScale);layers.get("flowers")!.push(...g.primitives);featureBounds[f.id]=g.bounds;for(const primitive of g.primitives)if(primitive.kind==="closed-path"&&primitive.featureId!==f.id)featureBounds[primitive.featureId]=boundsOf(primitive.commands);attachments.set(f.id,g.anchor);features.push({id:f.id,kind:"flower",bounds:g.bounds,center:g.anchor,primary:true,parentId:f.support.parentAxisId});}
 for(const b of scene.plant.buds){const g=budGeometry(b,axes);layers.get("flowers")!.push(...g.primitives);featureBounds[b.id]=g.bounds;attachments.set(b.id,g.anchor);features.push({id:b.id,kind:"bud",bounds:g.bounds,center:g.anchor,primary:false,parentId:b.support.parentAxisId});}
 for(const s of scene.plant.scars){const p=at(axes.get(s.attachment.parentAxisId)!,s.attachment.arcPosition),r=3+s.severity*5,commands:PathCommand[]=[{op:"M",p:{x:p.x-r,y:p.y}},{op:"C",c1:{x:p.x-r,y:p.y-r},c2:{x:p.x+r,y:p.y-r},p:{x:p.x+r,y:p.y}},{op:"C",c1:{x:p.x+r,y:p.y+r},c2:{x:p.x-r,y:p.y+r},p:{x:p.x-r,y:p.y}},{op:"Z"}];layers.get("stems")!.push({kind:"closed-path",id:`${s.id}-contour`,featureId:s.id,role:"scar",commands});featureBounds[s.id]=boundsOf(commands);}
 rootHierarchy(axes);const chronology=scene.plant.nodes.filter(n=>n.axisId==="axis-main").map(n=>at(axes.get("axis-main")!,n.arcPosition).y);return{layers,featureBounds,features,attachments,chronology};
}
export function evaluateSceneCandidate(scene:BotanicalSceneV2,candidate:Candidate){const g=buildCandidateGeometry(scene,candidate);return evaluateCandidate(candidate,g.features,g.attachments,g.chronology,DEFAULT_COMPOSITION);}
const quantize=(v:unknown,q:number):any=>typeof v==="number"?Math.round(v/q)*q:Array.isArray(v)?v.map(x=>quantize(x,q)):v&&typeof v==="object"?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,quantize(x,q)])):v;
export function generateGeometryV2(scene:BotanicalSceneV2,o:GeometryV2Options={}):GeometrySceneV2{if(o.enabled!==true)throw new Error("Geometry v2 is dark-launched; pass enabled: true");const candidates=generateCandidates(scene),built=candidates.map(candidate=>{const geometry=buildCandidateGeometry(scene,candidate),evaluation=evaluateCandidate(candidate,geometry.features,geometry.attachments,geometry.chronology,DEFAULT_COMPOSITION);return{geometry,evaluation};}),selected=selectCandidate(built.map(x=>x.evaluation)),winner=built[selected.candidate.index]!,layerOrder=["roots","stems","foliage","flowers"] as const,q=scene.generation.quantization;const raw={schemaVersion:2,geometryVersion:"procedural-geometry-v2.0.0",viewport:{width:DEFAULT_COMPOSITION.width,height:DEFAULT_COMPOSITION.height,safeInset:DEFAULT_COMPOSITION.safeInset},layers:layerOrder.map((id,zIndex)=>({id,zIndex,primitives:winner.geometry.layers.get(id)!})),featureBounds:winner.geometry.featureBounds,composition:{solverVersion:`candidate-score-v1:${COARSE_ACCEPTANCE_V1.version}`,candidateCount:32,selectedIndex:selected.candidate.index,totalScore:selected.totalScore,componentScores:selected.componentScores,hardViolations:selected.hardViolations,centerOfGravity:selected.centerOfGravity,occupiedBounds:selected.occupiedBounds},semanticFingerprint:semanticFingerprint(scene),provenance:{botanicalSceneSha256:sha256(serializeBotanicalSceneV2(scene)),styleIndependent:true,quantization:q}};return geometrySceneV2Schema.parse(quantize(raw,q));}
export {geometrySceneV2Schema,serializeGeometrySceneV2} from "./model.js";export {generateCandidates} from "../../composition/candidate.js";export {evaluateCandidate,selectCandidate} from "../../composition/score.js";
