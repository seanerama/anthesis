import type { BotanicalSceneV1 } from "../botany/model.js";
export type Shape = {
  id: string;
  kind: string;
  sourceKind: string;
  source: string;
  x: number;
  y: number;
  size: number;
  width: number;
  curl: number;
  angle: number;
  intent: Record<string, string | number | boolean>;
};
export type Geometry = {
  stem: { x: number; y1: number; y2: number; width: number };
  shapes: Shape[];
};
export function layout(scene: BotanicalSceneV1): Geometry {
  const legacy = scene.grammarVersion === "stage-0-v1",
    elems = scene.elements.filter(
      (e) => e.kind !== "root" && e.kind !== "stem",
    );
  return {
    stem: {
      x: 400,
      y1: 880,
      y2: 220,
      width: Number(
        scene.elements.find((e) => e.kind === "stem")?.intent.width ?? 24,
      ),
    },
    shapes: elems.map((e, i) => {
      if (legacy)
        return {
          id: e.id,
          kind: e.kind,
          sourceKind: e.sourceRefs[0]?.kind ?? "tag",
          source: e.sourceRefs[0]?.id ?? "tag",
          x: 400 + i * 90,
          y: 270 - i * 70,
          size: 55,
          width: 55,
          curl: 0,
          angle: 0,
          intent: e.intent,
        };
      const flowers = scene.elements.filter((x) => x.kind === "flower"),
        flowerIndex = flowers.findIndex((x) => x.id === e.id),
        parentFlower = scene.elements.find(
          (x) => x.id === e.parentId && x.kind === "flower",
        ),
        pIndex = parentFlower
          ? flowers.findIndex((x) => x.id === parentFlower.id)
          : -1,
        position = Number(e.intent.position ?? (i + 1) / (elems.length + 1)),
        side = e.intent.side === "left" ? -1 : 1;
      let x = 400 + side * (80 + (i % 3) * 25),
        y = 850 - position * 600;
      if (e.kind === "flower") {
        x = 400 + (flowerIndex % 2 ? 100 : -100);
        y = 760 - ((flowerIndex + 1) * 500) / (flowers.length + 1);
      }
      if (e.kind === "petal" && parentFlower) {
        const siblings = scene.elements.filter(
            (v) => v.kind === "petal" && v.parentId === e.parentId,
          ),
          j = siblings.findIndex((v) => v.id === e.id),
          a = (2 * Math.PI * j) / Math.max(1, siblings.length),
          px = 400 + (pIndex % 2 ? 100 : -100),
          py = 760 - ((pIndex + 1) * 500) / (flowers.length + 1);
        x = px + Math.cos(a) * 34;
        y = py + Math.sin(a) * 34;
      }
      return {
        id: e.id,
        kind: e.kind,
        sourceKind: e.sourceRefs[0]?.kind ?? "repository",
        source: e.sourceRefs[0]?.id ?? scene.source.repositoryIdentity,
        x,
        y,
        size: 18 + Number(e.intent.size ?? e.intent.length ?? 0.5) * 24,
        width: 8 + Number(e.intent.width ?? 0.5) * 20,
        curl: Number(e.intent.curl ?? 0),
        angle: Number(e.intent.angle ?? 0),
        intent: e.intent,
      };
    }),
  };
}
