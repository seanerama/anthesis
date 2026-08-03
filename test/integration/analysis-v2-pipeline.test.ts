import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { analyze } from "../../src/cli/analyze.js";
import { repositoryAnalysisV2Schema } from "../../src/analysis/v2/model.js";
const exec=promisify(execFile);

test("real Git fixture produces byte-identical contract-valid v2 artifacts",async()=>{const root=await mkdtemp(join(tmpdir(),"anthesis-v2-pipeline-"));await exec("bash",["test/fixtures/create-histories.sh",root]);const one=join(root,"one.json"),two=join(root,"two.json"),repo=join(root,"documentation-heavy");await analyze(repo,one,true,undefined,"botanical-v2");await analyze(repo,two,true,undefined,"botanical-v2");const a=await readFile(one),b=await readFile(two);assert.deepEqual(a,b);const value=repositoryAnalysisV2Schema.parse(JSON.parse(a.toString()));assert.equal(value.schemaVersion,2);assert.equal(value.source.snapshotSha.length,40);});

test("v2 kill switch defaults off and preserves canonical bytes",async()=>{const root=await mkdtemp(join(tmpdir(),"anthesis-v2-off-"));await exec("bash",["test/fixtures/create-histories.sh",root]);const implicit=join(root,"implicit.json"),explicit=join(root,"explicit.json"),repo=join(root,"steady-growth");await analyze(repo,implicit);await analyze(repo,explicit,undefined,undefined,"legacy");assert.deepEqual(await readFile(implicit),await readFile(explicit));assert.equal(JSON.parse(await readFile(implicit,"utf8")).schemaVersion,1);});
