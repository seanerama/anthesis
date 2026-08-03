export type ScalingMode = "repository-relative" | "globally-comparable";
export const GLOBAL_DISTRIBUTION_VERSION = "anthesis-git-v1";
export type ReferenceMetric="changeVolume"|"commits";
type Quantile={percentile:number;value:number};
export const GLOBAL_REFERENCE_DISTRIBUTIONS:Record<ReferenceMetric,readonly Quantile[]>={
  changeVolume:[{percentile:.02,value:1},{percentile:.10,value:5},{percentile:.25,value:20},{percentile:.50,value:100},{percentile:.75,value:500},{percentile:.90,value:2500},{percentile:.98,value:20000}],
  commits:[{percentile:.02,value:1},{percentile:.10,value:2},{percentile:.25,value:4},{percentile:.50,value:10},{percentile:.75,value:25},{percentile:.90,value:60},{percentile:.98,value:200}]
};
export function clamp01(value:number):number { return Math.max(0,Math.min(1,Number.isFinite(value)?value:0)); }
export function median(values:number[]):number { if(!values.length)return 0;const v=[...values].sort((a,b)=>a-b),m=Math.floor(v.length/2);return v.length%2?v[m]!:(v[m-1]!+v[m]!)/2; }
export function referencePercentile(raw:number,metric:ReferenceMetric):{value:number;clipped:boolean}{const points=GLOBAL_REFERENCE_DISTRIBUTIONS[metric],first=points[0]!,last=points.at(-1)!;if(raw<=first.value)return{value:0,clipped:raw<first.value};if(raw>=last.value)return{value:1,clipped:raw>last.value};for(let i=1;i<points.length;i++){const high=points[i]!,low=points[i-1]!;if(raw<=high.value){const position=(Math.log1p(raw)-Math.log1p(low.value))/(Math.log1p(high.value)-Math.log1p(low.value)),percentile=low.percentile+position*(high.percentile-low.percentile);return{value:clamp01((percentile-.02)/.96),clipped:false};}}return{value:1,clipped:true};}
export function normalizePositive(raw:number, repositoryMax:number, mode:ScalingMode,metric:ReferenceMetric){
  const transformed=Math.log1p(Math.max(0,raw));
  const repositoryRelative=repositoryMax<=0?0:clamp01(transformed/Math.log1p(repositoryMax));
  if(mode==="repository-relative")return{raw,transformed,repositoryRelative,clipped:false,confidence:repositoryMax?1:0.25};
  const global=referencePercentile(raw,metric);
  return{raw,transformed,repositoryRelative,globalPercentile:global.value,clipped:global.clipped,confidence:0.75};
}
export function shrunkRatio(numerator:number,denominator:number,prior=0.25,strength=4):number{return clamp01((numerator+prior*strength)/(denominator+strength));}
