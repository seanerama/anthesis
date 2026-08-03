import type {Point} from "./model.js";
/** Fixed-pass local nudge used only for minor organs. */
export function repairPoint(p:Point,index:number):Point{return{x:p.x+(index%2?1:-1)*Math.min(6,index),y:p.y};}
