import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { collectRepository, type AnalysisConfig } from "../collector/git.js";
import { serializeCanonical } from "../canonical/model.js";
export async function analyze(repo:string,output:string,fullAnalysis?:boolean,configPath?:string):Promise<void>{let config:AnalysisConfig={};if(configPath){try{config=JSON.parse(await readFile(configPath,"utf8")) as AnalysisConfig;}catch(error){throw new Error(`Unable to read analysis configuration ${configPath}: ${error instanceof Error?error.message:String(error)}`);}}config={...config,features:{...config.features,fullAnalysis:fullAnalysis??config.features?.fullAnalysis??false}};const bytes=serializeCanonical(await collectRepository(repo,config));await mkdir(dirname(output),{recursive:true});await writeFile(output,bytes);}
