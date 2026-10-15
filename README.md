# Dava Dental Care

Website praktik **drg. Dava Fathiyatuzzakiyah, Sp.KG.**, spesialis konservasi gigi, dengan lokasi kunjungan di Pekanbaru dan Taluk Kuantan. Situs memuat informasi konsultasi dan perawatan konservasi gigi, booking online, serta dashboard admin.

Proyek memakai Next.js 15 (App Router, TypeScript), Tailwind CSS v4, React Three Fiber untuk intro 3D, dan Prisma dengan SQLite di pengembangan lokal. Konfigurasi database dapat dipindah ke Postgres/Supabase untuk produksi.

## Menjalankan

```bash
npm install
cp .env.example .env   # sesuaikan bila perlu
npm run db:setup       # migrasi + seed data awal (sekali saja)
npm run dev            # http://localhost:3000
npm run build          # build produksi
npm run start          # jalankan hasil build
```

## Tampilan publik

- **Intro 3D mengikuti scroll**: satu geraham tampil lebih dahulu, lalu transisi memperlihatkan susunan gigi dalam mulut sebelum pengunjung melanjutkan ke konten beranda. Ilustrasi statis menggantikan model jika WebGL atau pemuatan 3D gagal.
- **Identitas visual violet**, pilihan Bahasa Indonesia/Inggris, tema terang/gelap, dan tata letak responsif.
- **Beranda** memuat perawatan konservasi gigi, pendekatan praktik, alur kunjungan, pilihan lokasi, FAQ, serta tautan booking.
- **Halaman publik**: `/layanan`, `/tentang`, `/kontak`, dan `/galeri`. Visual galeri memakai ilustrasi dan diberi keterangan sesuai sumbernya.
- **Kontak dan pencarian**: tombol WhatsApp memakai identitas dokter dan lokasi pilihan; metadata, sitemap, robots, serta JSON-LD `Dentist` menyertakan informasi praktik. Footer memuat tautan portfolio developer Naufal Dzakwan.

## Fitur Fase 2 — Booking Online & Dashboard

- **`/booking`** — form 4 langkah: lokasi klinik → layanan → tanggal & jam (slot 30 menit dihitung dari jam praktik − libur − slot terisi − waktu lewat) → data diri + persetujuan privasi. Kode booking `DFA-YYMMDD-0001`.
- **`/booking/[kode]`** — pasien memantau status & membatalkan sendiri tanpa login; slot yang dibatalkan langsung bebas kembali.
- **API** — `GET /api/availability`, `POST /api/bookings` (validasi zod, honeypot, rate limit per nomor HP).
- **Dashboard `/admin`** — login password (cookie httpOnly bertanda tangan), kalender booking per tanggal dengan aksi Konfirmasi / Tuntas / No-show / Batalkan, dan **Ekspor CSV**.
- **`/kebijakan-privasi`** — kebijakan privasi (UU PDP No. 27/2022), wajib karena form menampung data pribadi.

Data operasional (layanan, jam praktik, booking) berada di **Prisma** (`prisma/schema.prisma`); konfigurasi layanan publik berada di `lib/site.ts`. Jalankan `npm run db:sync` setelah memperbarui katalog untuk menyinkronkan dokter dan layanan tanpa mengubah riwayat booking.

### Akses admin (lokal)

`/admin` — password dari `ADMIN_PASSWORD` di `.env` (default dev: `dava-admin-2026`). **Ganti sebelum go-live.**

## Data Konten

Identitas dokter, kontak, daftar lokasi, jam praktik, dan layanan berada di **`lib/site.ts`**. Terjemahan memakai `lib/i18n.ts`; komponen di `components/sections.tsx` dan halaman publik memuat teks tampilan lainnya. Nama dokter pada tautan WhatsApp dan metadata mengikuti konfigurasi `site`.

### Data yang perlu dikonfirmasi sebelum rilis

Cari komentar `TODO` di kode. Ringkasnya:

| Data | Lokasi |
|---|---|
| Nomor WhatsApp & telepon | `lib/site.ts` → `site.whatsapp` |
| Alamat lengkap & petunjuk kunjungan | `app/(public)/kontak/page.tsx`; tambahkan alamat yang telah dikonfirmasi |
| Domain final | `lib/site.ts` → `site.url` |
| Akun Instagram | `lib/site.ts` → `site.instagram` |
| Jam praktik final | `lib/site.ts` → `hours` **dan** seed `prisma/seed.mjs` |
| Data layanan & harga internal | `lib/site.ts` → `services` dan `prisma/seed.mjs` |
| Password & secret admin | `.env` → `ADMIN_PASSWORD`, `AUTH_SECRET` |
| Foto dokter, bila tersedia | `app/(public)/tentang/page.tsx`; identitas dokter: drg. Dava Fathiyatuzzakiyah, Sp.KG., spesialis konservasi gigi |
| Foto klinik, bila tersedia | `app/(public)/galeri/page.tsx`; halaman saat ini menampilkan ilustrasi |
| Database produksi | `.env` → `DATABASE_URL` (Postgres/Supabase + `provider "postgresql"`) |

## Aset 3D

Aset aktif `public/models/dava-dentition.glb` dibuat secara prosedural dari awal untuk Dava Dental Care: 28 mahkota gigi kompak, dua basis gusi membulat, dan geraham terpisah dengan dua akar pipih asimetris. Mahkota geraham memakai lima tonjolan cembung dan alur kunyah bercabang. Bentuk direkonstruksi berdasarkan video pengguna; model ini merupakan ilustrasi dan tidak identik dengan aset asli pada video. Geometri aktif tidak memakai model scan lama.

```bash
npm run models:generate # bangun ulang GLB dari sumber
npm run db:sync         # sinkronkan dokter/layanan tanpa mengubah booking
```

Generator berada di `scripts/generate-dental-model.mjs`, dengan geometri mahkota di `scripts/dental-molar.mjs` dan akar di `scripts/dental-roots.mjs`. Render PNG tersedia di `docs/previews/`. Aset memakai mesh dan material lokal tanpa HDR atau tekstur dari jaringan.

Aset lama `public/models/teeth-real.glb` masih tersimpan sebagai arsip, tetapi tidak dipakai renderer. Aset tersebut berasal dari [“Human mouth detailed”](https://commons.wikimedia.org/wiki/File:3D_model_of_the_human_mouth.stl) oleh Mince (CC BY 4.0), melalui ekstraksi dan penyusunan ulang `scripts/extract-teeth.mjs`.

## Struktur

```
app/(public)/        halaman publik + /booking, /booking/[kode], /kebijakan-privasi
app/admin/           dashboard admin (login, kalender booking, ekspor CSV)
app/api/             availability (GET) & bookings (POST)
components/three/    intro 3D (TeethCanvas = R3F, TeethExperience = urutan scroll)
components/booking/  form booking multi-langkah
lib/                 site.ts (konten), wa.ts, db.ts, availability.ts, booking.ts, auth.ts, ratelimit.ts
prisma/              schema + seed; dev.db (SQLite, di-gitignore)
scripts/             shots.mjs (QA visual), e2e.mjs (QA end-to-end booking & admin)
public/models/       dava-dentition.glb (model asli), teeth-real.glb (arsip)
```

## Catatan Teknis 3D

- Loading menunggu frame render pertama, mencapai 100%, menampilkan WELCOME, lalu membuka intro layar penuh.
- Model GLB memuat node gigi bernama (`tooth_L_M1_R` dan seterusnya). Metadata `hero_molar.slot` menentukan tujuan geraham saat scroll; `crownRotationX` menyatakan rotasi dari geometri sumber ke geraham pembuka.
- Progres scroll mengatur transisi geraham ke tampilan mulut; setelah intro, halaman berlanjut ke informasi praktik dan perawatan.
- Komponen mempertimbangkan `prefers-reduced-motion` dan memakai ilustrasi pengganti saat WebGL atau model tidak tersedia. Model berfungsi sebagai ilustrasi visual untuk situs.

## Catatan Teknis Booking

- Slot aktif dikunci lewat kolom `Booking.slotKey` unik (`{dentist}|{tanggal}|{jam}`); saat dibatalkan kolomnya di-NULL-kan sehingga jam itu langsung bisa dipesan ulang — constraint `@@unique([dentistId, date, slotTime])` di SQLite ternyata juga menghitung baris cancelled.
- Kode booking dijamin unik dengan retry berurutan; tabrakan slot antar-submit bersamaan ditolak oleh constraint, bukan oleh timing.
- Sesi admin = cookie httpOnly bertanda tangan HMAC (`AUTH_SECRET`); password dibandingkan timing-safe.
- Rate limit & sesi masih in-memory — untuk multi-instance pindahkan ke Upstash (lihat `docs/ARCHITECTURE.md` §8).

## Fase Berikutnya

- **Fase 3:** blog SEO, otomasi WhatsApp gateway, pengingat H-1, moderasi testimoni, CRUD jadwal/layanan di dashboard.
