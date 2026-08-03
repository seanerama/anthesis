import type {PathCommand} from "../../../geometry/v2/model.js";
export const xml=(s:string)=>s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;");
const n=(x:number)=>Number(x.toFixed(4)).toString();
export function pathData(commands:PathCommand[]):string{return commands.map(c=>c.op==="Z"?"Z":c.op==="M"||c.op==="L"?`${c.op}${n(c.p.x)} ${n(c.p.y)}`:`C${n(c.c1.x)} ${n(c.c1.y)} ${n(c.c2.x)} ${n(c.c2.y)} ${n(c.p.x)} ${n(c.p.y)}`).join(" ");}
export const number=n;
