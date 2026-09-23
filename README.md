# Website Klinik — drg Dava Fathiyatuzzakiyah

Website praktik kedokteran gigi — Fase 1 (marketing site) dan Fase 2 (booking online + dashboard admin). Dibangun dengan Next.js 15 (App Router, TypeScript), Tailwind CSS v4, React Three Fiber untuk pengalaman 3D di beranda, dan Prisma (SQLite di lokal, siap dipindah ke Postgres/Supabase).

## Menjalankan

```bash
npm install
cp .env.example .env   # sesuaikan bila perlu
npm run db:setup       # migrasi + seed data awal (sekali saja)
npm run dev            # http://localhost:3000
npm run build          # build produksi
npm run start          # jalankan hasil build
```

## Fitur Fase 1

- **Hero 3D scroll-driven** — premolar berputar (auto + bisa di-drag); saat scroll, kamera mundur dan 28 gigi muncul menyusun lengkung atas & bawah **tanpa gusi** (`components/three/`).
- **Beranda** — layanan unggulan, keunggulan, testimoni, FAQ, CTA.
- **Halaman publik** — `/layanan` (harga mulai), `/tentang`, `/kontak`, `/galeri`.
- **Tombol WhatsApp mengambang** + CTA booking di semua halaman (`lib/wa.ts`).
- **SEO** — JSON-LD `Dentist` (opening hours, telepon, alamat), sitemap, robots, metadata per halaman, atribusi model 3D di footer.

## Fitur Fase 2 — Booking Online & Dashboard

- **`/booking`** — form 3 langkah: layanan → tanggal & jam (slot 30 menit dihitung dari jam praktik − libur − slot terisi − waktu lewat) → data diri + persetujuan privasi. Kode booking `DFA-YYMMDD-0001`.
- **`/booking/[kode]`** — pasien memantau status & membatalkan sendiri tanpa login; slot yang dibatalkan langsung bebas kembali.
- **API** — `GET /api/availability`, `POST /api/bookings` (validasi zod, honeypot, rate limit per nomor HP).
- **Dashboard `/admin`** — login password (cookie httpOnly bertanda tangan), kalender booking per tanggal dengan aksi Konfirmasi / Tuntas / No-show / Batalkan, dan **Ekspor CSV**.
- **`/kebijakan-privasi`** — kebijakan privasi (UU PDP No. 27/2022), wajib karena form menampung data pribadi.

Data operasional (layanan, jam praktik, booking) di **Prisma** (`prisma/schema.prisma`); konten publik tetap di `lib/site.ts` (seed menyinkronkan layanan dari situ).

### Akses admin (lokal)

`/admin` — password dari `ADMIN_PASSWORD` di `.env` (default dev: `dava-admin-2026`). **Ganti sebelum go-live.**

## Data Konten

Semua data (nama, nomor WhatsApp, alamat, jam praktik, layanan & harga, testimoni, FAQ) terpusat di **`lib/site.ts`** — cukup ubah di satu tempat.

### ⚠️ Placeholder yang HARUS diganti sebelum rilis

Cari komentar `TODO` di kode. Ringkasnya:

| Data | Lokasi |
|---|---|
| Nomor WhatsApp & telepon | `lib/site.ts` → `site.whatsapp` |
| Alamat klinik | `lib/site.ts` → `site.address` |
| Domain final | `lib/site.ts` → `site.url` |
| Akun Instagram | `lib/site.ts` → `site.instagram` |
| Jam praktik final | `lib/site.ts` → `hours` **dan** seed `prisma/seed.mjs` |
| Harga layanan resmi | `lib/site.ts` → `services` (ikut ke DB via seed) |
| Password & secret admin | `.env` → `ADMIN_PASSWORD`, `AUTH_SECRET` |
| Foto drg Dava & kredensial faktual | `app/(public)/tentang/page.tsx` |
| Foto klinik asli | `app/(public)/galeri/page.tsx` |
| Embed Google Maps | `app/(public)/kontak/page.tsx` (placeholder aktif) |
| Database produksi | `.env` → `DATABASE_URL` (Postgres/Supabase + `provider "postgresql"`) |

## Kredit Aset

Model 3D ["Teeth"](https://poly.pizza/m/eNR_DPPP1Hp) oleh Poly by Google, lisensi CC BY 3.0, via Poly Pizza. Atribusi tampil di footer situs (syarat lisensi CC BY).

## Struktur

```
app/(public)/        halaman publik + /booking, /booking/[kode], /kebijakan-privasi
app/admin/           dashboard admin (login, kalender booking, ekspor CSV)
app/api/             availability (GET) & bookings (POST)
components/three/    scene 3D (TeethCanvas = R3F, TeethExperience = wrapper scroll)
components/booking/  form booking multi-langkah
lib/                 site.ts (konten), wa.ts, db.ts, availability.ts, booking.ts, auth.ts, ratelimit.ts
prisma/              schema + seed; dev.db (SQLite, di-gitignore)
scripts/             shots.mjs (QA visual), e2e.mjs (QA end-to-end booking & admin)
public/models/       teeth.glb (28 gigi + 2 mesh gusi yang disembunyikan)
```

## Catatan Teknis 3D

- Geometri gigi dibake sekali di `prepareScene`: diterjemahkan ke pusatnya lalu diskalakan dari koordinat mentah GLB (~600 ribu unit) ke unit dunia (~3,4).
- Dua mesh gusi (Box015, Box030) diidentifikasi dari material merah dan tidak ikut dibangun.
- Premolar hero = salah satu gigi dari set yang sama (rank 6), melayang-berputar, lalu "pulang" ke slotnya saat transisi.
- `prefers-reduced-motion` → langsung tampil set lengkap tanpa animasi.

## Catatan Teknis Booking

- Slot aktif dikunci lewat kolom `Booking.slotKey` unik (`{dentist}|{tanggal}|{jam}`); saat dibatalkan kolomnya di-NULL-kan sehingga jam itu langsung bisa dipesan ulang — constraint `@@unique([dentistId, date, slotTime])` di SQLite ternyata juga menghitung baris cancelled.
- Kode booking dijamin unik dengan retry berurutan; tabrakan slot antar-submit bersamaan ditolak oleh constraint, bukan oleh timing.
- Sesi admin = cookie httpOnly bertanda tangan HMAC (`AUTH_SECRET`); password dibandingkan timing-safe.
- Rate limit & sesi masih in-memory — untuk multi-instance pindahkan ke Upstash (lihat `docs/ARCHITECTURE.md` §8).

## Fase Berikutnya

- **Fase 3:** blog SEO, otomasi WhatsApp gateway, pengingat H-1, moderasi testimoni, CRUD jadwal/layanan di dashboard.
