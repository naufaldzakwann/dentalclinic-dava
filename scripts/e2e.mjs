// Public WhatsApp composer checks. Start the app before running this script.
// BASE_URL=http://localhost:3000 node scripts/e2e.mjs
// Optional screenshots: E2E_OUTPUT_DIR=/tmp/dava-e2e
// WhatsApp opens are intercepted; database/API/admin requests are blocked.
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, expect } from "@playwright/test";

const base = new URL(process.env.BASE_URL ?? "http://localhost:3000");
if (!/^https?:$/.test(base.protocol)) throw new Error("BASE_URL must use http or https.");
const outputDirectory = process.env.E2E_OUTPUT_DIR ? resolve(process.env.E2E_OUTPUT_DIR) : null;
if (outputDirectory) await mkdir(outputDirectory, { recursive: true });
const appUrl = (path) => new URL(path, base).href;
const browserErrors = [], blockedRequests = [];
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: "id-ID",
  timezoneId: "Asia/Jakarta",
  serviceWorkers: "block",
});

// Fail safely if a regression restores writes, old booking calls, or navigation
// to WhatsApp. No test data, admin credentials, or database cleanup is needed.
await context.route("**/*", async (route) => {
  const request = route.request();
  const url = new URL(request.url());
  const isApp = url.origin === base.origin;
  const oldBackend = isApp && /^\/(?:api\/(?:bookings|availability)(?:\/|$)|admin(?:\/|$)|booking\/[^/]+)/.test(url.pathname);
  const write = !["GET", "HEAD"].includes(request.method());
  const externalNavigation = request.isNavigationRequest() && !isApp;
  if (oldBackend || write || externalNavigation) {
    blockedRequests.push(`${request.method()} ${url.origin}${url.pathname}`);
    await route.abort("blockedbyclient");
  } else {
    await route.continue();
  }
});
await context.addInitScript(() => {
  window.__davaWhatsAppOpens = [];
  window.open = (url, target, features) => {
    window.__davaWhatsAppOpens.push({ url: String(url), target, features });
    return null;
  };
});

const page = await context.newPage();
page.setDefaultTimeout(15000);
page.on("pageerror", (error) => browserErrors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") browserErrors.push(message.text());
});
const form = page.locator('form[aria-label]');
const submit = form.locator('button[type="submit"]');
const location = (id) => form.locator(`input[name="clinic"][value="${id}"]`);
const preparedCount = () => page.evaluate(() => window.__davaWhatsAppOpens.length);
const check = async (name, run) => {
  await run();
  console.log(`PASS ${name}`);
};
const openBooking = async (query = "") => {
  await page.goto(appUrl(`/booking${query}`), { waitUntil: "domcontentloaded" });
  await expect(form.locator('input[name="date"]')).toHaveAttribute("min", /^\d{4}-\d{2}-\d{2}$/);
};
const preparedMessage = async () => {
  const call = await page.evaluate(() => window.__davaWhatsAppOpens.at(-1));
  assert.ok(call, "The form should prepare a WhatsApp link.");
  assert.equal(call.target, "_blank");
  assert.match(call.features, /\bnoopener\b/);
  assert.match(call.features, /\bnoreferrer\b/);
  const url = new URL(call.url);
  assert.equal(url.origin, "https://wa.me");
  assert.match(url.pathname, /^\/[1-9]\d{7,14}$/);
  assert.deepEqual([...url.searchParams.keys()], ["text"]);
  const message = url.searchParams.get("text");
  assert.ok(message);
  assert.doesNotMatch(message, /undefined|kode booking|booking code/i);
  return { url, message };
};
const screenshot = async (name) => {
  if (!outputDirectory) return;
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(outputDirectory, name), fullPage: true });
};

try {
  console.log(`Checking public WhatsApp flow at ${base.origin}`);
  await check("A clinic is required; optional details may stay empty", async () => {
    await openBooking();
    await expect(form.locator('input[name="clinic"]:checked')).toHaveCount(0);
    await expect(page.locator("a.whatsapp-fab")).toHaveAttribute("href", "/booking");
    await submit.click();
    assert.equal(await preparedCount(), 0, "No clinic must mean no WhatsApp open.");
    await location("pekanbaru").check({ force: true });
    await submit.click();
    const { url, message } = await preparedMessage();
    assert.match(message, /Lokasi klinik: Pekanbaru/);
    assert.doesNotMatch(message, /Nama:|Layanan:|Pilihan tanggal:|Pilihan jam:|Catatan:/);
    const floatingLink = new URL(await page.locator("a.whatsapp-fab").getAttribute("href"));
    assert.equal(floatingLink.pathname, url.pathname, "Form and clinic chat should use the same contact.");
  });

  await check("Validated query choices override the saved clinic", async () => {
    await openBooking("?clinic=taluk-kuantan&service=perawatan-saluran-akar");
    await expect(location("taluk-kuantan")).toBeChecked();
    await expect(form.locator('select[name="service"]')).toHaveValue("perawatan-saluran-akar");
    assert.equal(await page.evaluate(() => localStorage.getItem("dava:clinic")), "taluk-kuantan");
  });

  await check("Personal details, Unicode, punctuation and WIB preferences survive URL encoding", async () => {
    const minimumDate = await form.locator('input[name="date"]').getAttribute("min");
    const nextWeek = new Date(`${minimumDate}T12:00:00Z`);
    nextWeek.setUTCDate(nextWeek.getUTCDate() + 7);
    const date = nextWeek.toISOString().slice(0, 10);
    const dateLabel = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(nextWeek);
    const name = "Ayu & Dini + keluarga 🦷";
    const note = "Gigi terasa sensitif.\nApakah 14:30 bisa? A&B + #1 / 50%";
    await form.locator('input[name="name"]').fill(name);
    await form.locator('input[name="date"]').fill(date);
    await form.locator('input[name="time"]').fill("14:30");
    await form.locator('textarea[name="notes"]').fill(note);
    await submit.click();
    const { message } = await preparedMessage();
    for (const detail of ["Lokasi klinik: Taluk Kuantan", "Layanan: Perawatan Saluran Akar", `Nama: ${name}`, `Pilihan tanggal: ${dateLabel}`, "Pilihan jam: 14:30 WIB (UTC+7)", `Catatan: ${note}`]) {
      assert.ok(message.includes(detail), `Missing message detail: ${detail}`);
    }
    assert.match(message, /Mohon bantu konfirmasi jadwal yang tersedia/);
    await screenshot("booking-desktop.png");
  });

  await check("Invalid query values are ignored and message details are not persisted", async () => {
    await openBooking("?clinic=unknown-clinic&service=unknown-service");
    await expect(location("taluk-kuantan")).toBeChecked();
    await expect(form.locator('select[name="service"]')).toHaveValue("");
    for (const name of ["name", "date", "time"]) await expect(form.locator(`input[name="${name}"]`)).toHaveValue("");
    await expect(form.locator('textarea[name="notes"]')).toHaveValue("");
  });

  await check("Changing the clinic through a same-page link updates selection and storage", async () => {
    await page.locator('footer a[href="/booking?clinic=pekanbaru"]').click();
    await expect(location("pekanbaru")).toBeChecked();
    assert.equal(await page.evaluate(() => localStorage.getItem("dava:clinic")), "pekanbaru");
  });

  await check("English messages preserve the selected clinic and treatment", async () => {
    await page.evaluate(() => localStorage.setItem("dava:language", "en"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(location("pekanbaru")).toBeChecked();
    await form.locator('select[name="service"]').selectOption("scaling");
    await submit.click();
    const { message } = await preparedMessage();
    assert.match(message, /^Hello,/);
    assert.match(message, /Clinic: Pekanbaru/);
    assert.match(message, /Treatment: Scaling & Polishing/);
    assert.match(message, /Please help me confirm an available appointment time/);
  });

  await check("Mobile layout and dark preference remain usable", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(submit).toBeVisible();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Mobile page must not overflow horizontally.");
    await screenshot("booking-mobile-en.png");
    await page.evaluate(() => localStorage.setItem("dava:theme", "dark"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(location("pekanbaru")).toBeChecked();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await screenshot("booking-mobile-dark.png");
  });

  await check("No backend/admin calls, external navigation or browser errors occurred", async () => {
    assert.deepEqual(blockedRequests, []);
    assert.deepEqual(browserErrors, []);
  });
  console.log("All checks passed. No WhatsApp message was sent and no database data was changed.");
  if (outputDirectory) console.log(`Screenshots: ${outputDirectory}`);
} catch (error) {
  console.error("FAIL", error);
  if (blockedRequests.length) console.error("Blocked requests:", blockedRequests);
  if (browserErrors.length) console.error("Browser errors:", browserErrors);
  process.exitCode = 1;
} finally {
  await browser.close();
}
