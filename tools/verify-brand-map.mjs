import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const pagePath = path.resolve("brand-map.html");
const previewPath = path.resolve("tools", "brand-map-preview.png");
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
});
const page = await browser.newPage({
  viewport: { width: 1500, height: 930 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("console", message => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", error => errors.push(error.message));
await page.goto(`file:///${pagePath.replaceAll("\\", "/")}`, {
  waitUntil: "networkidle",
  timeout: 60000,
});
await page.waitForTimeout(5000);
await page.screenshot({ path: previewPath, fullPage: true });
const result = await page.evaluate(() => ({
  title: document.title,
  brandItems: document.querySelectorAll(".brand-item").length,
  canvasCount: document.querySelectorAll("#brandMap canvas").length,
  mapSize: {
    width: document.getElementById("brandMap")?.clientWidth,
    height: document.getElementById("brandMap")?.clientHeight,
  },
}));
await browser.close();
await fs.access(previewPath);
console.log(JSON.stringify({ ...result, errors, previewPath }));
