import {namedStream} from "../botany/v2/variation.js";
import type {BotanicalSceneV2} from "../botany/v2/model.js";
import type {Candidate} from "./model.js";

const range=(u:number,a:number,b:number)=>a+(b-a)*u;
/** Fixed-size, named-stream candidate set. Adding geometry draws cannot perturb it. */
export function generateCandidates(scene:BotanicalSceneV2):Candidate[]{
 return Array.from({length:32},(_,index)=>{const p=namedStream(scene.generation.structuralSeed,scene.plant.id,`composition-candidate-${index}`);return{
  index,lean:range(p.next(),-.12,.12)+scene.plant.habit.lean*.3,crownScale:range(p.next(),.82,1.12),verticalScale:range(p.next(),.9,1.08),bloomScale:range(p.next(),.88,1.05),branchSpread:range(p.next(),.82,1.18),rootSpread:range(p.next(),.85,1.16),phase:range(p.next(),-.1,.1)
 };});
}
