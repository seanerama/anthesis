import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const expectedEnabled = process.env.ANTHESIS_EXPECT_VIEWER_ENABLED !== "false";
let server;
let base = process.env.ANTHESIS_VIEWER_URL;

if (!base) {
  const root = join(process.cwd(), "dist-viewer");
  const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".json": "application/json" };
  server = createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
      const relative = pathname === "/" ? "index.html" : normalize(pathname).replace(/^[/\\]+/, "");
      const file = join(root, relative);
      const info = await stat(file);
      if (!info.isFile()) throw new Error("not a file");
      response.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
      response.end(await readFile(file));
    } catch { response.writeHead(404).end("not found"); }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("local viewer server did not start");
  base = `http://127.0.0.1:${address.port}`;
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const response = await page.goto(base, { waitUntil: "networkidle" });
  if (!response?.ok()) throw new Error(`viewer returned HTTP ${response?.status() ?? "unknown"}`);
  const portrait = page.locator("#portrait");
  const disabled = page.locator("#disabled");
  if (expectedEnabled) {
    await portrait.waitFor({ state: "visible" });
    if (await disabled.isVisible()) throw new Error("disabled message is visible in enabled viewer");
    const image = portrait.locator("img");
    await image.waitFor({ state: "visible" });
    if (await image.evaluate((element) => !(element instanceof HTMLImageElement) || element.naturalWidth === 0)) throw new Error("portrait image did not visibly render");
    const provenance = await page.locator("#provenance").textContent();
    if (!provenance || !/^[0-9a-f]{64}$/.test(provenance)) throw new Error("visible provenance identifier missing");
    await page.locator('#legend button[data-kind="stem"]').click();
    if (!/^stem: commit /.test(await page.locator("#inspection-value").textContent() ?? "")) throw new Error("source/metric inspection did not respond");
  } else {
    await disabled.waitFor({ state: "visible" });
    if (await portrait.isVisible()) throw new Error("portrait is visible while kill switch defaults OFF");
  }
  console.log(`viewer browser smoke passed: feature ${expectedEnabled ? "enabled" : "disabled"}`);
} finally {
  await browser.close();
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
