import type { BotanicalSceneV2 } from "../botany/v2/model.js";

export type Point = Readonly<{x:number;y:number}>;
export type Bounds = Readonly<{minX:number;minY:number;maxX:number;maxY:number}>;
export type Candidate = Readonly<{
  index:number; lean:number; crownScale:number; verticalScale:number;
  bloomScale:number; branchSpread:number; rootSpread:number; phase:number;
}>;
export type CandidateFeature = Readonly<{id:string;kind:"axis"|"leaf"|"flower"|"bud"|"root";bounds:Bounds;center:Point;primary:boolean;parentId?:string}>;
export type CandidateEvaluation = Readonly<{candidate:Candidate;totalScore:number;componentScores:Record<string,number>;hardViolations:string[];centerOfGravity:Point;occupiedBounds:Bounds}>;
export type CompositionConfig = Readonly<{width:number;height:number;safeInset:number;candidateCount:32}>;
export const DEFAULT_COMPOSITION:CompositionConfig={width:800,height:1000,safeInset:36,candidateCount:32};
/** Versioned limits for the v1 conservative axis-aligned coarse-bounds model. */
export const COARSE_ACCEPTANCE_V1={version:"coarse-acceptance-v1",collisionScoreMax:500,congestionScoreMax:300,crossingScoreMax:80,severeBloomOverlapAreaMax:900} as const;
export type CoarseLayout = Readonly<{scene:BotanicalSceneV2;features:CandidateFeature[];attachments:Map<string,Point>;chronology:number[]}>;
