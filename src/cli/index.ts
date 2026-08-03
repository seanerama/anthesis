#!/usr/bin/env node
import { Command } from "commander";
import { portrait } from "./portrait.js";
const program=new Command().name("anthesis").description("Render Git history as botanical art");
program.command("portrait").argument("<repo>").requiredOption("--output <file>").action(async(repo:string,options:{output:string})=>portrait(repo,options.output));
program.parseAsync().catch((error:unknown)=>{console.error(`anthesis: ${error instanceof Error?error.message:String(error)}`);process.exitCode=1;});
