import { canonicalJson,sha256 } from "../../shared/canonical-json.js";
import type { BotanicalSceneV2 } from "./model.js";
export function semanticFingerprint(s:BotanicalSceneV2):string{const clean=(v:unknown):unknown=>Array.isArray(v)?v.map(clean):v&&typeof v==="object"?Object.fromEntries(Object.entries(v).filter(([k])=>k!=="decorativeSeed"&&k!=="sampledVariation").map(([k,x])=>[k,clean(x)])):v;return sha256(canonicalJson(clean(s)));}
