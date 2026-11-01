# Dava Dental Care

Website praktik **drg. Dava Fathiyatuzzakiyah, Sp.KG.**, spesialis konservasi gigi, dengan lokasi kunjungan di Pekanbaru dan Taluk Kuantan. Situs memuat informasi konsultasi dan perawatan konservasi gigi, janji temu melalui WhatsApp, serta dashboard administrasi dari sistem sebelumnya.

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
- **Halaman publik**: `/layanan`, `/tentang`, `/kontak`, `/galeri`, dan `/kebijakan-privasi`. Visual galeri memakai ilustrasi dan diberi keterangan sesuai sumbernya. Halaman privasi menjelaskan perencana pesan WhatsApp, preferensi browser, layanan eksternal WhatsApp, serta catatan administrasi yang tersimpan terpisah.
- **Kontak dan pencarian**: tombol WhatsApp memakai identitas dokter dan lokasi pilihan; metadata, sitemap, robots, serta JSON-LD `Dentist` menyertakan informasi praktik. Footer memuat tautan portfolio developer Naufal Dzakwan.

## Janji temu WhatsApp

Halaman `/booking` kini menjadi perencana pesan WhatsApp. Pengunjung memilih Pekanbaru atau Taluk Kuantan, lalu boleh menambahkan nama, layanan, tanggal/jam pilihan (WIB), serta catatan. Tombol **Lanjut ke WhatsApp** membuka pesan untuk ditinjau dan dikirim sendiri oleh pengunjung. Tidak ada permintaan ke API ketersediaan/booking, penyimpanan pasien baru, kode booking, atau pemesanan slot melalui halaman ini. Jadwal dikonfirmasi oleh tim klinik lewat chat.

Tautan `/booking?clinic=pekanbaru&service=konsultasi` mendukung pilihan awal yang tervalidasi. Preferensi lokasi tersimpan bersama bahasa dan tema dalam localStorage; isi pesan tidak disimpan. `lib/wa.ts` membentuk pesan dan URL, sementara `clinicLocations` di `lib/site.ts` menyimpan kontak per klinik. Kedua lokasi masih memakai nomor contoh sesuai arahan pengguna; ganti dengan nomor asli sebelum digunakan untuk menerima pasien.

Desain publik menggunakan Plus Jakarta Sans dan palet violet yang sama. Intro 3D beserta model dan alur scroll dipertahankan. Ilustrasi editorial di bagian sambutan merupakan aset generatif, bukan foto klinik; sumber dan prompt tercatat di `docs/visual-assets.md`.

Untuk memeriksa alur publik setelah server berjalan, jalankan `node scripts/e2e.mjs` (default `http://localhost:3000`), atau `BASE_URL=http://localhost:3100 node scripts/e2e.mjs` untuk port lain. Tes mencegat pembukaan WhatsApp dan memblokir permintaan ke API/admin; tidak mengirim pesan atau mengubah database. Tambahkan `E2E_OUTPUT_DIR=/tmp/dava-e2e` bila ingin menyimpan screenshot.

## Administrasi dan catatan sistem sebelumnya

- Form pemesanan slot lama telah diganti dengan perencana pesan WhatsApp di atas. Rute status, API lama, dashboard, dan catatan tersimpan dipertahankan untuk administrasi.
- **`/booking/[kode]`** — pasien memantau status & membatalkan sendiri tanpa login; slot yang dibatalkan langsung bebas kembali.
- **API** — `GET /api/availability`, `POST /api/bookings` (validasi zod, honeypot, rate limit per nomor HP).
- **Dashboard `/admin`** — login password (cookie httpOnly bertanda tangan), kalender booking per tanggal dengan aksi Konfirmasi / Tuntas / No-show / Batalkan, dan **Ekspor CSV**.

Data operasional sistem sebelumnya (layanan, jam praktik, booking) berada di **Prisma** (`prisma/schema.prisma`); konfigurasi layanan publik berada di `lib/site.ts`. Perencana WhatsApp tidak membaca slot atau menambahkan booking ke database ini. Jalankan `npm run db:sync` setelah memperbarui katalog untuk menyinkronkan dokter dan layanan tanpa mengubah riwayat booking.

### Akses admin (lokal)

`/admin` — password dari `ADMIN_PASSWORD` di `.env` (default dev: `dava-admin-2026`). **Ganti sebelum go-live.**

## Data Konten

Identitas dokter, kontak umum, daftar lokasi beserta nomor WhatsApp per klinik, dan katalog layanan berada di **`lib/site.ts`**. `clinicLocations` menentukan tujuan WhatsApp untuk lokasi yang dipilih; `site.whatsapp` menjadi nomor cadangan. Jadwal publik dikonfirmasi lewat chat. Konstanta `hours` di berkas tersebut merupakan data lama yang tidak ditampilkan pada halaman publik saat ini; jadwal sistem slot sebelumnya berasal dari Prisma.

Terjemahan memakai `lib/i18n.ts`; komponen di `components/sections.tsx` dan halaman publik memuat teks tampilan lainnya. Nama dokter pada tautan WhatsApp dan metadata mengikuti konfigurasi `site`.

### Data yang perlu dikonfirmasi sebelum rilis

Cari komentar `TODO` di kode. Ringkasnya:

| Data | Lokasi |
|---|---|
| Nomor WhatsApp per klinik | `lib/site.ts` → `clinicLocations[].whatsapp`; isi nomor masing-masing lokasi bila berbeda |
| Nomor WhatsApp cadangan & telepon metadata | `lib/site.ts` → `site.whatsapp` dan `site.phoneDisplay` |
| Alamat lengkap & petunjuk kunjungan | `app/(public)/kontak/page.tsx`; tambahkan alamat yang telah dikonfirmasi |
| Domain final | `lib/site.ts` → `site.url` |
| Akun Instagram | `lib/site.ts` → `site.instagram` |
| Jam praktik per lokasi | Saat ini dikonfirmasi lewat WhatsApp; perbarui halaman publik hanya setelah jadwal terverifikasi. Jam pada Prisma/`prisma/seed.mjs` dipakai sistem slot sebelumnya, bukan perencana WhatsApp |
| Data layanan & harga internal | `lib/site.ts` → `services` dan `prisma/seed.mjs` |
| Password & secret admin | `.env` → `ADMIN_PASSWORD`, `AUTH_SECRET` |
| Foto dokter, bila tersedia | `app/(public)/tentang/page.tsx`; identitas dokter: drg. Dava Fathiyatuzzakiyah, Sp.KG., spesialis konservasi gigi |
| Foto klinik, bila tersedia | `app/(public)/galeri/page.tsx`; halaman saat ini menampilkan ilustrasi |
| Database produksi | `.env` → `DATABASE_URL` (Postgres/Supabase + `provider "postgresql"`) |

## Aset 3D

Aset aktif `public/models/dava-dentition.glb` dibuat secara prosedural dari awal untuk Dava Dental Care: 28 mahkota gigi kompak dengan ujung taring membulat, dua gusi yang mengikuti leher dan sela gigi, serta geraham terpisah dengan dua akar pipih asimetris. Dinding gusi menipis menuju pangkal dengan relief akar, warna merah muda bertahap, dan tekstur permukaan halus. Mahkota geraham memakai lima tonjolan cembung dan alur kunyah bercabang. Bentuk direkonstruksi berdasarkan video pengguna; model ini merupakan ilustrasi dan tidak identik dengan aset asli pada video. Geometri aktif tidak memakai model scan lama.

```bash
npm run models:generate # bangun ulang GLB dari sumber
npm run models:verify   # periksa mesh tertutup dan sambungan mahkota–akar
npm run db:sync         # sinkronkan dokter/layanan tanpa mengubah booking
```

Generator berada di `scripts/generate-dental-model.mjs`. Profil gigi seri, taring, premolar, dan molar berada di `scripts/dental-crowns.mjs`; kontur gusi di `scripts/dental-gums.mjs`. Geraham pembuka memakai `scripts/dental-molar.mjs`, `scripts/dental-roots.mjs`, dan sambungan mahkota–akar di `scripts/dental-hero.mjs`. Kedua bagian berbagi posisi, normal, dan warna pada batas sambungan; perubahan kilap menuju akar dibuat bertahap di viewer. Render PNG tersedia di `docs/previews/`. Aset memakai mesh dan material lokal tanpa HDR atau tekstur dari jaringan.

Aset lama `public/models/teeth-real.glb` masih tersimpan sebagai arsip, tetapi tidak dipakai renderer. Aset tersebut berasal dari [“Human mouth detailed”](https://commons.wikimedia.org/wiki/File:3D_model_of_the_human_mouth.stl) oleh Mince (CC BY 4.0), melalui ekstraksi dan penyusunan ulang `scripts/extract-teeth.mjs`.

## Struktur

```
app/(public)/        halaman publik + /booking, /booking/[kode], /kebijakan-privasi
app/admin/           dashboard admin (login, kalender booking, ekspor CSV)
app/api/             availability (GET) & bookings (POST)
components/three/    intro 3D (TeethCanvas = R3F, TeethExperience = urutan scroll)
components/booking/  perencana pesan WhatsApp (pilihan klinik + detail kunjungan opsional)
lib/                 site.ts (konten), wa.ts, db.ts, availability.ts, booking.ts, auth.ts, ratelimit.ts
prisma/              schema + seed; dev.db (SQLite, di-gitignore)
scripts/             shots.mjs (QA visual), e2e.mjs (QA perencana pesan WhatsApp publik)
public/models/       dava-dentition.glb (model asli), teeth-real.glb (arsip)
```

## Catatan Teknis 3D

- Loading menunggu frame render pertama, mencapai 100%, menampilkan WELCOME, lalu membuka intro layar penuh.
- Model GLB memuat node gigi bernama (`tooth_L_M1_R` dan seterusnya). Metadata `hero_molar.slot` menentukan tujuan geraham saat scroll; `crownRotationX` menyatakan rotasi dari geometri sumber ke geraham pembuka.
- Progres scroll mengatur transisi geraham ke tampilan mulut; setelah intro, halaman berlanjut ke informasi praktik dan perawatan.
- Komponen mempertimbangkan `prefers-reduced-motion` dan memakai ilustrasi pengganti saat WebGL atau model tidak tersedia. Model berfungsi sebagai ilustrasi visual untuk situs.

## Catatan Teknis Booking Sistem Sebelumnya

- Slot aktif dikunci lewat kolom `Booking.slotKey` unik (`{lokasi}|{dentist}|{tanggal}|{jam}`); saat dibatalkan kolomnya di-NULL-kan sehingga jam itu langsung bisa dipesan ulang — constraint `@@unique([dentistId, date, slotTime])` di SQLite ternyata juga menghitung baris cancelled.
- Kode booking dijamin unik dengan retry berurutan; tabrakan slot antar-submit bersamaan ditolak oleh constraint, bukan oleh timing.
- Sesi admin = cookie httpOnly bertanda tangan HMAC (`AUTH_SECRET`); password dibandingkan timing-safe.
- Rate limit masih in-memory; untuk multi-instance pindahkan penyimpanan hit ke layanan bersama seperti Upstash (lihat `docs/ARCHITECTURE.md` §8). Sesi admin diverifikasi dari cookie bertanda tangan tanpa penyimpanan sesi di memori server.

## Fase Berikutnya

- **Fase 3:** blog SEO, otomasi WhatsApp gateway, pengingat H-1, moderasi testimoni, CRUD jadwal/layanan di dashboard.
