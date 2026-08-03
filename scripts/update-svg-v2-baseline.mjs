import {execFile} from "node:child_process";
import {mkdir,mkdtemp} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {promisify} from "node:util";
import {chromium} from "playwright";

const exec=promisify(execFile),dir=await mkdtemp(join(tmpdir(),"anthesis-baseline-"));
const analysis="test/fixtures/botanical-v2/six-episode-analysis.json",plant=join(dir,"plant.json"),geometry=join(dir,"geometry.json"),portrait=join(dir,"portrait.svg"),out="test/visual/botanical-plate-v2.chromium.png";
await exec(process.execPath,["dist/cli/index.js","grow",analysis,"--output",plant,"--grammar","botanical-v2"]);
await exec(process.execPath,["dist/cli/index.js","geometry",plant,"--output",geometry,"--grammar","botanical-v2"]);
await exec(process.execPath,["dist/cli/index.js","render-v2",plant,"--geometry",geometry,"--analysis",analysis,"--output",portrait,"--grammar","botanical-v2"]);
await mkdir("test/visual",{recursive:true});
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:900,height:700}});
await page.goto(`file://${portrait}`);
await page.locator("svg").screenshot({path:out});
await browser.close();
process.stdout.write(`${out}\n`);
