import type {Bounds,CandidateEvaluation,CandidateFeature,Point} from "./model.js";
import type {Candidate} from "./model.js";
import {SpatialGrid} from "../geometry/v2/spatial-index.js";

const area=(b:Bounds)=>Math.max(0,b.maxX-b.minX)*Math.max(0,b.maxY-b.minY);
const intersection=(a:Bounds,b:Bounds)=>area({minX:Math.max(a.minX,b.minX),minY:Math.max(a.minY,b.minY),maxX:Math.min(a.maxX,b.maxX),maxY:Math.min(a.maxY,b.maxY)});
const q=(n:number)=>Math.round(n*1000)/1000;
export function evaluateCandidate(candidate:Candidate,features:CandidateFeature[],attachments:Map<string,Point>,chronology:number[],viewport={width:800,height:1000,safeInset:36}):CandidateEvaluation{
 const occupied=features.reduce<Bounds>((b,f)=>({minX:Math.min(b.minX,f.bounds.minX),minY:Math.min(b.minY,f.bounds.minY),maxX:Math.max(b.maxX,f.bounds.maxX),maxY:Math.max(b.maxY,f.bounds.maxY)}),{minX:Infinity,minY:Infinity,maxX:-Infinity,maxY:-Infinity});
 const hard:string[]=[];if(occupied.minX<viewport.safeInset||occupied.maxX>viewport.width-viewport.safeInset||occupied.minY<viewport.safeInset||occupied.maxY>viewport.height-viewport.safeInset)hard.push("canvas-overflow");
 if(features.some(f=>(f.kind==="flower"||f.kind==="bud")&&!attachments.has(f.id)))hard.push("disconnected-support");
 if(chronology.some((y,i)=>i>0&&y>chronology[i-1]!))hard.push("chronology-reversal");
 const blooms=features.filter(f=>f.kind==="flower"&&f.primary);let bloomOverlap=0;for(let i=0;i<blooms.length;i++)for(let j=i+1;j<blooms.length;j++)bloomOverlap+=intersection(blooms[i]!.bounds,blooms[j]!.bounds);if(bloomOverlap>900)hard.push("severe-primary-bloom-collision");
 let collisions=0,leafCongestion=0,crossingArea=0;const grid=new SpatialGrid(72),seen=new Map(features.map(f=>[f.id,f]));for(const f of features){for(const prior of grid.query(f.bounds)){const other=seen.get(prior.id)!,x=intersection(f.bounds,prior.bounds);collisions+=x;if(f.kind==="leaf"&&other.kind==="leaf")leafCongestion+=x;if((f.kind==="axis"||f.kind==="root")&&(other.kind==="axis"||other.kind==="root"))crossingArea+=x;}grid.insert(f.id,f.bounds);}
 const totalArea=features.reduce((n,f)=>n+area(f.bounds),0)||1,cx=features.reduce((n,f)=>n+f.center.x*area(f.bounds),0)/totalArea,cy=features.reduce((n,f)=>n+f.center.y*area(f.bounds),0)/totalArea;
 const left=features.filter(f=>f.center.x<viewport.width/2).reduce((n,f)=>n+area(f.bounds),0),right=totalArea-left;
 const rootArea=features.filter(f=>f.kind==="root").reduce((n,f)=>n+area(f.bounds),0),crownArea=totalArea-rootArea;
 const components={collision:Math.round(collisions/40),congestion:Math.round(leafCongestion/30),crossings:Math.round(crossingArea/35),mainStemReadability:Math.round(collisions/120),balance:Math.round(Math.abs(left-right)/80),centerOfGravity:Math.round((Math.abs(cx-viewport.width/2)+Math.abs(cy-viewport.height*.48))/8),negativeSpace:Math.round(Math.max(0,(area(occupied)/area({minX:0,minY:0,maxX:viewport.width,maxY:viewport.height})-.62)*100)),bloomSeparation:Math.round(bloomOverlap/20),rootCrownBalance:Math.round(Math.abs(rootArea/(crownArea||1)-.2)*100),annotationClearance:Math.round(Math.max(0,viewport.safeInset+35-occupied.minY))};
 const weights:{[K in keyof typeof components]:number}={collision:9,congestion:5,crossings:8,mainStemReadability:7,balance:3,centerOfGravity:3,negativeSpace:2,bloomSeparation:8,rootCrownBalance:3,annotationClearance:4};
 return{candidate,totalScore:Object.entries(components).reduce((n,[k,v])=>n+v*weights[k as keyof typeof components],0),componentScores:components,hardViolations:hard,centerOfGravity:{x:q(cx),y:q(cy)},occupiedBounds:{minX:q(occupied.minX),minY:q(occupied.minY),maxX:q(occupied.maxX),maxY:q(occupied.maxY)}};
}
export function selectCandidate(xs:CandidateEvaluation[]):CandidateEvaluation{const valid=xs.filter(x=>x.hardViolations.length===0);if(!valid.length)throw new Error("Composition has no candidate satisfying hard constraints");return valid.sort((a,b)=>a.totalScore-b.totalScore||a.candidate.index-b.candidate.index)[0]!;}
