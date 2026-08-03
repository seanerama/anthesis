import { execFile } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);
const root = join(process.cwd(), "artifacts", "fixture-portraits");
const histories = join(root, "repositories");
const portraits = join(root, "portraits");
const realPortrait = join(process.cwd(), "artifacts", "real-anthesis", "portrait.svg");
const names = ["steady-growth", "collaborative-release", "major-refactor", "chaotic-experimentation", "documentation-heavy"];

await rm(root, { recursive: true, force: true });
await mkdir(portraits, { recursive: true });
await exec("bash", ["test/fixtures/create-histories.sh", histories]);
for (const name of names) {
  await exec(process.execPath, ["dist/cli/index.js", "portrait", join(histories, name), "--output", join(portraits, name, "portrait.svg"), "--mvp-grammar"]);
}
await rm(histories, { recursive: true, force: true });
await rm(join(process.cwd(), "artifacts", "real-anthesis"), { recursive: true, force: true });
await exec(process.execPath, ["dist/cli/index.js", "portrait", ".", "--output", realPortrait, "--mvp-grammar"]);
console.log(`generated ${names.length} fixture portraits and the real Anthesis portrait`);
