export type ScalingMode = "repository-relative" | "globally-comparable";
export const GLOBAL_DISTRIBUTION_VERSION = "anthesis-git-v1";
export function clamp01(value:number):number { return Math.max(0,Math.min(1,Number.isFinite(value)?value:0)); }
export function median(values:number[]):number { if(!values.length)return 0;const v=[...values].sort((a,b)=>a-b),m=Math.floor(v.length/2);return v.length%2?v[m]!:(v[m-1]!+v[m]!)/2; }
export function normalizePositive(raw:number, repositoryMax:number, mode:ScalingMode){
  const transformed=Math.log1p(Math.max(0,raw));
  const repositoryRelative=repositoryMax<=0?0:clamp01(transformed/Math.log1p(repositoryMax));
  if(mode==="repository-relative")return{raw,transformed,repositoryRelative,clipped:false,confidence:repositoryMax?1:0.25};
  const unclipped=transformed/Math.log1p(10000),globalPercentile=clamp01((clamp01(unclipped)-0.02)/0.96);
  return{raw,transformed,repositoryRelative,globalPercentile,clipped:unclipped<0.02||unclipped>0.98,confidence:0.75};
}
export function shrunkRatio(numerator:number,denominator:number,prior=0.25,strength=4):number{return clamp01((numerator+prior*strength)/(denominator+strength));}
