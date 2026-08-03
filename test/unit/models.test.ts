import test from "node:test";import assert from "node:assert/strict";import {canonicalJson} from "../../src/shared/canonical-json.js";import {botanicalSceneSchema} from "../../src/botany/model.js";
test("canonical JSON sorts object keys",()=>assert.equal(canonicalJson({z:1,a:2}),'{"a":2,"z":1}'));
test("botanical boundary rejects invalid phenotype",()=>assert.throws(()=>botanicalSceneSchema.parse({schemaVersion:1,phenotype:{activity:2}})));
