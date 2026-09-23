import { chromium } from "@playwright/test";

const BASE = "http://localhost:3100";
const OUT = "/tmp/dava-shots";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push("console: " + m.text());
});

await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500); // tunggu model GLB termuat

// Hero (p=0)
await page.screenshot({ path: OUT + "/01-home-hero.png" });

// Transisi (p≈0.65)
await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 2.05, behavior: "instant" }));
await page.waitForTimeout(700);
await page.screenshot({ path: OUT + "/02-home-transition.png" });

// Set lengkap (p=1)
await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 2.15, behavior: "instant" }));
await page.waitForTimeout(700);
await page.screenshot({ path: OUT + "/03-home-fullset.png" });

// Bagian konten di bawah hero
await page.evaluate(() => {
  const track = document.querySelector("section[aria-label]");
  window.scrollTo({ top: (track?.offsetHeight ?? 0) + 200 });
});
await page.waitForTimeout(500);
await page.screenshot({ path: OUT + "/04-home-layanan.png", fullPage: false });

// Halaman lainnya
for (const [name, path] of [
  ["05-layanan", "/layanan"],
  ["06-tentang", "/tentang"],
  ["07-kontak", "/kontak"],
  ["08-galeri", "/galeri"],
]) {
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
}

// Mobile home (hero + akhir transisi)
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "no-preference" });
await mobile.goto(BASE + "/", { waitUntil: "networkidle" });
await mobile.waitForTimeout(2500);
await mobile.screenshot({ path: OUT + "/09-mobile-hero.png" });
await mobile.evaluate(() => window.scrollTo({ top: window.innerHeight * 2.15 }));
await mobile.waitForTimeout(700);
await mobile.screenshot({ path: OUT + "/10-mobile-fullset.png" });

console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "NO_CONSOLE_ERRORS");
await browser.close();
