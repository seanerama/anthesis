#!/usr/bin/env node
import { Command } from "commander";
import { analyze } from "./analyze.js";
import { portrait } from "./portrait.js";
const program=new Command().name("anthesis").description("Render Git history as botanical art");
program.command("analyze").argument("<repo>").requiredOption("--output <file>").option("--full-analysis","enable expanded Git analysis (feature defaults off)").option("--config <file>").action(async(repo:string,o:{output:string;fullAnalysis?:boolean;config?:string})=>analyze(repo,o.output,o.fullAnalysis,o.config));
program.command("portrait").argument("<repo>").requiredOption("--output <file>").option("--full-analysis","enable expanded Git analysis (feature defaults off)").option("--config <file>").action(async(repo:string,o:{output:string;fullAnalysis?:boolean;config?:string})=>portrait(repo,o.output,o.fullAnalysis,o.config));
program.parseAsync().catch((error:unknown)=>{console.error(`anthesis: ${error instanceof Error?error.message:String(error)}`);process.exitCode=1;});
