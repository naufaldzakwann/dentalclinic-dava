# Website Klinik — drg Dava Fathiyatuzzakiyah

Website praktik kedokteran gigi, Fase 1 (marketing site). Dibangun dengan Next.js 15 (App Router, TypeScript), Tailwind CSS v4, dan React Three Fiber untuk pengalaman 3D di beranda.

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build produksi
npm run start      # jalankan hasil build
```

## Fitur Fase 1

- **Hero 3D scroll-driven** — premolar berputar (auto + bisa di-drag); saat scroll, kamera mundur dan 28 gigi muncul menyusun lengkung atas & bawah **tanpa gusi** (`components/three/`).
- **Beranda** — layanan unggulan, keunggulan, testimoni, FAQ, CTA.
- **Halaman publik** — `/layanan` (harga mulai), `/tentang`, `/kontak`, `/galeri`.
- **Tombol WhatsApp mengambang** + CTA booking di semua halaman (`lib/wa.ts`).
- **SEO** — JSON-LD `Dentist` (opening hours, telepon, alamat), sitemap, robots, metadata per halaman, atribusi model 3D di footer.

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
| Jam praktik final | `lib/site.ts` → `hours` |
| Harga layanan resmi | `lib/site.ts` → `services` |
| Foto drg Dava & kredensial faktual | `app/(public)/tentang/page.tsx` |
| Foto klinik asli | `app/(public)/galeri/page.tsx` |
| Embed Google Maps | `app/(public)/kontak/page.tsx` (placeholder aktif) |
| Kebijakan privasi | halaman `/kebijakan-privasi` (belum ada — wajib karena form menampung data pribadi, UU PDP) |

## Kredit Aset

Model 3D ["Teeth"](https://poly.pizza/m/eNR_DPPP1Hp) oleh Poly by Google, lisensi CC BY 3.0, via Poly Pizza. Atribusi tampil di footer situs (syarat lisensi CC BY).

## Struktur

```
app/(public)/      halaman publik (beranda, layanan, tentang, kontak, galeri)
app/(public)/...   layout: Nav + Footer + tombol WhatsApp
components/three/  scene 3D (TeethCanvas = R3F, TeethExperience = wrapper scroll)
components/        Nav, Footer, WhatsAppFab, sections, icons
lib/               site.ts (konten), wa.ts (link WhatsApp)
public/models/     teeth.glb (28 gigi + 2 mesh gusi yang disembunyikan)
scripts/shots.mjs  screenshot visual (Playwright) untuk QA
```

## Catatan Teknis 3D

- Geometri gigi dibake sekali di `prepareScene`: diterjemahkan ke pusatnya lalu diskalakan dari koordinat mentah GLB (~600 ribu unit) ke unit dunia (~3,4).
- Dua mesh gusi (Box015, Box030) diidentifikasi dari material merah dan tidak ikut dibangun.
- Premolar hero = salah satu gigi dari set yang sama (rank 6), melayang-berputar, lalu "pulang" ke slotnya saat transisi.
- `prefers-reduced-motion` → langsung tampil set lengkap tanpa animasi.

## Fase Berikutnya

- **Fase 2:** booking online + dashboard admin (kalender, konfirmasi, ekspor CSV) — arsitektur di `docs/ARCHITECTURE.md`.
- **Fase 3:** blog SEO, otomasi WhatsApp gateway, pengingat H-1.
