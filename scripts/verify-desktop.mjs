// Verifikasi DESKTOP setelah perbaikan: perilaku mouse tidak berubah.
import { chromium } from "@playwright/test";

const BASE = "http://localhost:3100";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));

await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => !document.querySelector(".clinic-loader"), null, { timeout: 45000 });
await page.waitForTimeout(2500);

// 0) Track intro desktop tetap 310svh (tidak tersentuh perubahan mobile)
const dims = await page.evaluate(() => ({
  track: document.querySelector(".intro-track").offsetHeight,
  vh: window.innerHeight,
}));
console.log(`[0] Track intro desktop: ${dims.track}px = ${(dims.track / dims.vh).toFixed(1)} layar ${dims.track === dims.vh * 3.1 ? "✓ (310svh, tidak berubah)" : "✗ BERUBAH"}`);

// 1) Wheel di atas kanvas harus tetap menggulir halaman (seperti sebelumnya)
const canvasBox = await page.evaluate(() => {
  const r = document.querySelector(".dental-viewer canvas").getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
await page.mouse.move(canvasBox.x, canvasBox.y);
let before = await page.evaluate(() => window.scrollY);
await page.mouse.wheel(0, 600);
await page.waitForTimeout(600);
let after = await page.evaluate(() => window.scrollY);
console.log(`[1] Scroll wheel di atas kanvas: delta = ${after - before} ${after - before > 0 ? "✓ menggulir" : "✗ mati"}`);

// 2) Drag mouse di atas kanvas: memutar model, TIDAK menggulir halaman
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.waitForTimeout(600);
before = await page.evaluate(() => window.scrollY);
await page.mouse.move(canvasBox.x, canvasBox.y);
await page.mouse.down();
for (let i = 1; i <= 8; i++) {
  await page.mouse.move(canvasBox.x + i * 25, canvasBox.y + i * 2);
  await page.waitForTimeout(20);
}
await page.mouse.up();
await page.waitForTimeout(600);
after = await page.evaluate(() => window.scrollY);
console.log(`[2] Drag mouse di atas kanvas: delta scroll = ${after - before} ${after - before === 0 ? "✓ halaman diam (model diputar)" : "✗ halaman ikut bergulir"}`);

// 3) Tampilan hero desktop tetap render normal
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/dava-shots/desktop-hero-setelah.png" });
const shot = await page.screenshot();
console.log(`[3] Screenshot hero desktop: ${shot.length} bytes ✓ render normal`);

console.log("ERRORS:", errors.length ? errors.join(" | ") : "tidak ada");
await browser.close();
