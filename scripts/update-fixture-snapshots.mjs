import { execFile } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { collectRepository } from "../dist/collector/git.js";
import { serializeCanonical } from "../dist/canonical/model.js";
import { grow, serializeBotanical } from "../dist/botany/model.js";
import { renderSvg } from "../dist/render/svg/index.js";
const exec=promisify(execFile),root=join(process.cwd(),"artifacts","snapshot-repositories"),snapshots=join(process.cwd(),"test","snapshots","mvp-portraits"),names=["steady-growth","collaborative-release","major-refactor","chaotic-experimentation","documentation-heavy"];
await rm(root,{recursive:true,force:true});await mkdir(snapshots,{recursive:true});await exec("bash",["test/fixtures/create-histories.sh",root]);
for(const name of names){const canonical=await collectRepository(join(root,name),{repositoryIdentity:`fixtures/${name}`}),cBytes=serializeCanonical(canonical),scene=grow(canonical,{enabled:true}),bBytes=serializeBotanical(scene),rendered=renderSvg(canonical,scene,cBytes,bBytes);await writeFile(join(snapshots,`${name}.plant.json`),bBytes);await writeFile(join(snapshots,`${name}.svg`),rendered.svg);}
const legacyCanonical=await collectRepository(join(root,"steady-growth"),{repositoryIdentity:"fixtures/steady-growth"}),legacyCanonicalBytes=serializeCanonical(legacyCanonical),legacyScene=grow(legacyCanonical),legacyBytes=serializeBotanical(legacyScene);await writeFile(join(snapshots,"stage1-fallback.svg"),renderSvg(legacyCanonical,legacyScene,legacyCanonicalBytes,legacyBytes).svg);
await rm(root,{recursive:true,force:true});console.log(`updated ${names.length} committed fixture snapshot pairs`);
