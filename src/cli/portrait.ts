import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { collectRepository } from "../collector/git.js";
import { canonicalRepositorySchema, serializeCanonical } from "../canonical/model.js";
import { botanicalSceneSchema, grow, serializeBotanical } from "../botany/model.js";
import { renderSvg } from "../render/svg/index.js";
export async function portrait(repo:string,output:string):Promise<void>{const canonical=canonicalRepositorySchema.parse(await collectRepository(repo));const cBytes=serializeCanonical(canonical);const botanical=botanicalSceneSchema.parse(grow(canonical));const bBytes=serializeBotanical(botanical);const rendered=renderSvg(canonical,botanical,cBytes,bBytes);const dir=dirname(output);await mkdir(dir,{recursive:true});await Promise.all([writeFile(join(dir,"analysis.json"),cBytes),writeFile(join(dir,"plant.json"),bBytes),writeFile(output,rendered.svg),writeFile(output.replace(/\.svg$/,".provenance.json"),rendered.provenance)]);}
