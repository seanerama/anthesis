import type { CanonicalRepositoryV1 } from "../../canonical/model.js";
import { median } from "./normalization.js";

export function robustChangeVolumeLandmarkShas(commits:CanonicalRepositoryV1["commits"]):Set<string>{
  if(commits.length<2)return new Set();
  const entries=commits.map(commit=>({commit,value:commit.additions+commit.deletions}));
  const center=median(entries.map(x=>x.value)),mad=median(entries.map(x=>Math.abs(x.value-center))),threshold=center+Math.max(3*mad,center*.5,1);
  const outliers=entries.filter(x=>x.value>threshold);
  if(outliers.length)return new Set(outliers.map(x=>x.commit.sha));
  const ordered=[...entries].sort((a,b)=>b.value-a.value||a.commit.sha.localeCompare(b.commit.sha)),largest=ordered[0]!,second=ordered[1]!;
  return largest.value>Math.max(center*1.5,second.value*1.25,second.value+1)?new Set([largest.commit.sha]):new Set();
}
