// E2E Fase 2: booking UI → kode → status → batal; admin login → konfirmasi → CSV.
// Server harus sudah jalan di :3100. Jalankan: node scripts/e2e.mjs
import { chromium } from "@playwright/test";
import prismaPkg from "@prisma/client";

const { PrismaClient } = prismaPkg;

const BASE = "http://localhost:3100";
const results = [];
const check = (name, ok, extra = "") => {
  results.push(`${ok ? "PASS" : "FAIL"} ${name}${extra ? " — " + extra : ""}`);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
page.on("console", (m) => m.type() === "error" && errors.push("console: " + m.text()));

// — 0. Tentukan tanggal uji: hari buka berikutnya yang punya ≥ 2 slot bleaching —
const dateParam = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
let testDate = null;
let avail = null;
for (let i = 1; i <= 14 && !testDate; i++) {
  const d = new Date();
  d.setDate(d.getDate() + i);
  if (d.getDay() === 0) continue; // Minggu tutup
  const candidate = dateParam(d);
  const res = await fetch(`${BASE}/api/availability?date=${candidate}&serviceId=bleaching`).then((r) => r.json());
  if (res.ok && res.slots.length >= 2) {
    testDate = candidate;
    avail = res;
  }
}
check("hari uji ditemukan", !!testDate, testDate);

// — 1. Availability API —
check("availability bleaching hari uji", avail.ok && avail.slots.length >= 2, `${avail.slots.length} slot`);
let sunday = new Date();
sunday.setDate(sunday.getDate() + 1);
while (sunday.getDay() !== 0) sunday.setDate(sunday.getDate() + 1);
const closed = await fetch(`${BASE}/api/availability?date=${dateParam(sunday)}&serviceId=bleaching`).then((r) => r.json());
check("availability hari Minggu ditutup", closed.ok === false && closed.reason === "closed");

// — 2. Booking lewat UI —
const uiSlot = avail.slots[Math.floor(avail.slots.length / 2)]; // slot dinamis agar uji tak tergantung isi DB
await page.goto(BASE + "/booking", { waitUntil: "networkidle" });
await page.screenshot({ path: "/tmp/dava-shots/20-booking.png" });
await page.getByRole("button", { name: /Scaling & Polishing/ }).click();
await page.fill('input[type="date"]', testDate);
await page.getByRole("radio", { name: uiSlot }).click();
await page.fill('input[placeholder="Nama sesuai identitas"]', "QA Playwright");
await page.fill('input[placeholder="08xxxxxxxxxx"]', "0812999887766");
await page.fill('input[placeholder="untuk notifikasi"]', "qa@example.com");
await page.fill('textarea[placeholder^="Contoh:"]', "Automated test booking");
await page.check('input[type="checkbox"]');
await page.getByRole("button", { name: "Kirim Booking" }).click();
await page.waitForSelector("text=Simpan kode Anda", { timeout: 10000 });
const codeText = await page.locator("button.tabular").first().textContent();
const code = codeText?.match(/DFA-\d{6}-\d{4}/)?.[0];
check("booking UI sukses + kode terbit", !!code, code ?? "kode tidak ditemukan");
await page.screenshot({ path: "/tmp/dava-shots/21-booking-sukses.png" });

// — 3. Halaman status —
if (code) {
  await page.goto(`${BASE}/booking/${code}`, { waitUntil: "networkidle" });
  const body = await page.textContent("body");
  check("halaman status menampilkan detail", body.includes("QA Playwright") && body.includes("Menunggu konfirmasi"));
  await page.screenshot({ path: "/tmp/dava-shots/22-status-pending.png" });
}

// — 4. Pembatalan mandiri —
const avail2 = await fetch(`${BASE}/api/availability?date=${testDate}&serviceId=gigi-anak`).then((r) => r.json());
const slot2 = avail2.slots[0];
const mk = await fetch(`${BASE}/api/bookings`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    serviceSlug: "gigi-anak", date: testDate, slotTime: slot2,
    name: "QA Batal", phone: "0812999888777", consent: true, website: "",
  }),
});
const mkCode = (await mk.json()).code;
check("booking kedua via API", mk.status === 201 && !!mkCode);
await page.goto(`${BASE}/booking/${mkCode}`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Batalkan Booking" }).click();
await page.waitForTimeout(700);
const body2 = await page.textContent("body");
check("pembatalan mandiri berfungsi", body2.includes("Dibatalkan"));
const avail3 = await fetch(`${BASE}/api/availability?date=${testDate}&serviceId=gigi-anak`).then((r) => r.json());
check("slot batal kembali tersedia", avail3.ok && avail3.slots.includes(slot2));

// — 5. Validasi & honeypot —
const bad = await fetch(`${BASE}/api/bookings`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ serviceSlug: "scaling", date: testDate, slotTime: "10:00", name: "X", phone: "123", consent: true }),
});
check("validasi menolak data rusak", bad.status === 400);
const bot = await fetch(`${BASE}/api/bookings`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    serviceSlug: "scaling", date: testDate, slotTime: "15:00",
    name: "Bot Spam", phone: "0812111222333", consent: true, website: "http://spam.example",
  }),
});
check("honeypot mengaburkan bot (tanpa booking nyata)", bot.status === 201);

// — 6. Admin —
await page.goto(BASE + "/admin");
await page.waitForURL("**/admin/login");
check("admin tanpa sesi diarahkan ke login", true);
await page.fill('input[type="password"]', "password-salah");
await page.getByRole("button", { name: "Masuk" }).click();
await page.waitForSelector("text=Password salah");
check("login ditolak untuk password salah", true);
await page.fill('input[type="password"]', "dava-admin-2026");
await page.getByRole("button", { name: "Masuk" }).click();
await page.waitForURL("**/admin");
await page.waitForSelector("text=Hari Ini");
check("login admin berhasil", true);
await page.screenshot({ path: "/tmp/dava-shots/23-admin.png" });

// Konfirmasi booking QA Playwright (cari baris berdasarkan kode)
if (code) {
  const row = page.locator("li", { hasText: code }).first();
  await row.getByRole("button", { name: "Konfirmasi" }).click();
  await page.waitForTimeout(700);
  const rowText = await row.textContent();
  check("aksi Konfirmasi di dashboard", rowText.includes("Terkonfirmasi"));
}

// — 7. Ekspor CSV (sesi admin aktif) —
const csvRes = await ctx.request.get(BASE + "/admin/export");
const csvBody = await csvRes.text();
check(
  "ekspor CSV",
  csvRes.status() === 200 && csvRes.headers()["content-type"].includes("text/csv") && csvBody.includes(code ?? "TIDAK ADA"),
  `${csvBody.split("\n").length - 1} baris`,
);
const csvNoAuth = await fetch(BASE + "/admin/export");
check("ekspor CSV ditolak tanpa sesi", csvNoAuth.status === 401);

await page.screenshot({ path: "/tmp/dava-shots/24-admin-terkonfirmasi.png" });

// — 8. Bersihkan data uji agar dashboard tetap berisi demo seed saja —
const prisma = new PrismaClient();
const deleted = await prisma.booking.deleteMany({
  where: { phone: { in: ["0812999887766", "0812999888777", "0812111222333"] } },
});
check("pembersihan data uji", deleted.count >= 2, `${deleted.count} booking uji dihapus`);
await prisma.$disconnect();

await browser.close();

console.log(results.join("\n"));
console.log(errors.length ? "\nJS ERRORS:\n" + errors.join("\n") : "\nNO_JS_ERRORS");
