import type { BotanicalSceneV2 } from "../../../botany/v2/model.js";
import { geometrySceneV2Schema, type GeometryPrimitive, type GeometrySceneV2 } from "../../../geometry/v2/model.js";
import { canonicalJson } from "../../../shared/canonical-json.js";
import { styleTokensV1Schema, type StyleTokensV1 } from "../../../style/model.js";
import { createProvenance, serializeSvgProvenanceV2 } from "./metadata.js";
import { number, pathData, xml } from "./serializer.js";

export type RenderV2Options={annotations?:boolean;enabled?:boolean};
const safeId=(s:string)=>`feature-${s.replace(/[^A-Za-z0-9_.:-]/g,"-")}`;
const featureOpen=(id:string)=>`<g id="${safeId(id)}" data-feature-id="${xml(id)}" tabindex="0" role="graphics-symbol" aria-label="Botanical feature ${xml(id)}">`;

function primitiveSvg(p:GeometryPrimitive,style:StyleTokensV1):string {
  const paint=style.paint[p.role]!;
  const attrs=`data-paint-role="${p.role}" fill="${paint.fill}" stroke="${paint.stroke}" stroke-width="${number(paint.strokeWidth)}" stroke-linecap="${paint.lineCap}" stroke-linejoin="${paint.lineJoin}" opacity="${number(paint.opacity)}" vector-effect="non-scaling-stroke"`;
  if(p.kind==="mark-field") return p.marks.map((m,i)=>`<path id="${xml(p.id)}-mark-${i}" d="M${number(m.position.x-m.scale)} ${number(m.position.y)} L${number(m.position.x+m.scale)} ${number(m.position.y)}" transform="rotate(${number(m.rotation*180/Math.PI)} ${number(m.position.x)} ${number(m.position.y)})" ${attrs}/>`).join("");
  return `<path id="${xml(p.id)}" d="${pathData(p.commands)}" ${attrs}/>`;
}

/** Preserve authoritative layer and primitive order. Flower-owner groups wrap their
 * child petal groups so sepals, petals, receptacle, and florets remain interleavable
 * without duplicating a feature's stable interactive group. */
function renderLayer(layer:GeometrySceneV2["layers"][number],scene:BotanicalSceneV2,style:StyleTokensV1):string {
  const flowers=new Map(scene.plant.flowers.map(f=>[f.id,new Set([f.id,...f.petals.map(p=>p.id)])]));
  const out:string[]=[];
  for(let i=0;i<layer.primitives.length;){
    const primitive=layer.primitives[i]!, members=flowers.get(primitive.featureId);
    if(members){
      out.push(featureOpen(primitive.featureId));
      while(i<layer.primitives.length&&members.has(layer.primitives[i]!.featureId)){
        const current=layer.primitives[i++]!;
        out.push(current.featureId===primitive.featureId?primitiveSvg(current,style):`${featureOpen(current.featureId)}${primitiveSvg(current,style)}</g>`);
      }
      out.push("</g>");
      continue;
    }
    const featureId=primitive.featureId, feature:GeometryPrimitive[]=[];
    while(i<layer.primitives.length&&layer.primitives[i]!.featureId===featureId) feature.push(layer.primitives[i++]!);
    out.push(`${featureOpen(featureId)}${feature.map(p=>primitiveSvg(p,style)).join("")}</g>`);
  }
  return `<g id="layer-${xml(layer.id)}" data-geometry-layer="${xml(layer.id)}" data-z-index="${layer.zIndex}">${out.join("")}</g>`;
}

export function renderSvgV2(sceneInput:BotanicalSceneV2,geometryInput:GeometrySceneV2,styleInput:StyleTokensV1,inputs:{analysisBytes:string;botanicalBytes:string;geometryBytes:string},options:RenderV2Options={}):{svg:string;provenance:string} {
  if(options.enabled!==true) throw new Error("SVG v2 is dark-launched; pass enabled: true");
  const geometry=geometrySceneV2Schema.parse(geometryInput),style=styleTokensV1Schema.parse(styleInput),provenance=createProvenance(sceneInput,geometry,style,inputs),sidecar=serializeSvgProvenanceV2(provenance);
  const index=Object.fromEntries(Object.keys(geometry.featureBounds).sort().map(id=>[id,sceneInput.provenanceIndex[id]??sceneInput.plant.provenance]));
  const layers=[...geometry.layers].sort((a,b)=>a.zIndex-b.zIndex||a.id.localeCompare(b.id)).map(layer=>renderLayer(layer,sceneInput,style)).join("");
  const annotation=options.annotations===true?`<g id="annotations" aria-label="Annotations"><text x="24" y="${geometry.viewport.height-18}" fill="${style.annotation.color}" font-family="${xml(style.annotation.family)}" font-size="${number(style.annotation.size)}">${xml(sceneInput.source.repositoryIdentity)}</text></g>`:"";
  const svg=`<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${style.print.widthMm}mm" height="${style.print.heightMm}mm" viewBox="0 0 ${number(geometry.viewport.width)} ${number(geometry.viewport.height)}" role="img" aria-labelledby="anthesis-title anthesis-description" data-anthesis-contract="svg-provenance-v2" data-geometry-sha256="${provenance.artifactHashes.geometry}"><title id="anthesis-title">Anthesis botanical portrait</title><desc id="anthesis-description">A deterministic botanical illustration grown from repository history.</desc><metadata id="anthesis-provenance">${xml(sidecar.trimEnd())}</metadata><metadata id="anthesis-feature-provenance">${xml(canonicalJson(index))}</metadata><rect width="100%" height="100%" fill="${style.background.color}" aria-hidden="true"/>${layers}${annotation}</svg>\n`;
  return {svg,provenance:sidecar};
}
