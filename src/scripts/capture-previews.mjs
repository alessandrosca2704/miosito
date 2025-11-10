import { writeFile } from "node:fs/promises";
import puppeteer from "puppeteer";

const templates = [
  { id: "pro-services", url: "http://localhost:3000/templates/pro-services" },
  { id: "craftsmen", url: "http://localhost:3000/templates/craftsmen" },
  { id: "nonprofit", url: "http://localhost:3000/templates/nonprofit" },
  { id: "sme", url: "http://localhost:3000/templates/sme" },
  { id: "retail", url: "http://localhost:3000/templates/retail" }
];

const VIEWPORT = { width: 1440, height: 900 };
const OUTPUT_DIR = "public/images/preview-templates";

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport(VIEWPORT);

for (const tpl of templates) {
  await page.goto(tpl.url, { waitUntil: "networkidle0" });
await new Promise((resolve) => setTimeout(resolve, 1000));
// oppure: await page.waitForNetworkIdle(); se usi Puppeteer >=22

  const screenshot = await page.screenshot({
    path: `${OUTPUT_DIR}/${tpl.id}.webp`,
    type: "webp",
    quality: 85,
    clip: { x: 0, y: 0, width: 1440, height: 810 } // ritaglia solo hero o sezione
  });

  console.log(`Saved ${tpl.id} (${screenshot.length} bytes)`);
}

await browser.close();
