import type { BotanicalSceneV1 } from "../botany/model.js";
export type Geometry = { stem: { x: number; y1: number; y2: number }; flowers: Array<{ id: string; source: string; x: number; y: number; radius: number }> };
export function layout(scene: BotanicalSceneV1): Geometry { return { stem:{x:400,y1:880,y2:220}, flowers:scene.elements.filter(e=>e.kind==="flower").map((e,i)=>({id:e.id,source:e.sourceRefs[0]?.id ?? "tag",x:400+i*90,y:270-i*70,radius:55})) }; }
