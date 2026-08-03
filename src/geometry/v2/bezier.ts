import type {Bounds,Point} from "../../composition/model.js";
import type {PathCommand} from "./model.js";
export const point=(x:number,y:number):Point=>({x,y});
export const add=(a:Point,b:Point):Point=>point(a.x+b.x,a.y+b.y),mul=(a:Point,n:number):Point=>point(a.x*n,a.y*n);
export const norm=(a:Point):Point=>{const d=Math.hypot(a.x,a.y)||1;return point(a.x/d,a.y/d);};
export const cubicPoint=(p0:Point,c1:Point,c2:Point,p1:Point,t:number):Point=>{const u=1-t;return point(u*u*u*p0.x+3*u*u*t*c1.x+3*u*t*t*c2.x+t*t*t*p1.x,u*u*u*p0.y+3*u*u*t*c1.y+3*u*t*t*c2.y+t*t*t*p1.y);};
export const cubicTangent=(p0:Point,c1:Point,c2:Point,p1:Point,t:number):Point=>norm(point(3*(1-t)*(1-t)*(c1.x-p0.x)+6*(1-t)*t*(c2.x-c1.x)+3*t*t*(p1.x-c2.x),3*(1-t)*(1-t)*(c1.y-p0.y)+6*(1-t)*t*(c2.y-c1.y)+3*t*t*(p1.y-c2.y)));
export function commandPoints(c:PathCommand[]):Point[]{return c.flatMap(x=>x.op==="Z"?[]:x.op==="C"?[x.c1,x.c2,x.p]:[x.p]);}
export function boundsOf(c:PathCommand[]):Bounds{const p=commandPoints(c);return{minX:Math.min(...p.map(x=>x.x)),minY:Math.min(...p.map(x=>x.y)),maxX:Math.max(...p.map(x=>x.x)),maxY:Math.max(...p.map(x=>x.y))};}
