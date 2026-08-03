import type{AxisCurve}from"./axes.js";
/** Root topology is represented by the same tapered-axis grammar, with root paint roles. */
export function rootHierarchy(axes:Map<string,AxisCurve>):AxisCurve[]{const roots=[...axes.values()].filter(x=>x.kind==="root"||x.kind==="lateral-root");if(!roots.some(x=>x.kind==="root"))throw new Error("Root hierarchy requires a primary root");return roots;}
