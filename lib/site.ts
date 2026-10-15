// Konfigurasi situs — SEMUA data bertanda TODO harus diganti dengan data asli klinik
// sebelum go-live. Mengubah di sini otomatis ikut ke semua halaman & tombol WhatsApp.

export const site = {
  name: "drg. Dava Fathiyatuzzakiyah, Sp.KG.",
  fullName: "Praktik Spesialis Konservasi Gigi drg. Dava Fathiyatuzzakiyah, Sp.KG.",
  specialty: "Spesialis Konservasi Gigi",
  specialtyEn: "Specialist in Conservative Dentistry & Endodontics",
  tagline: "Gigi yang sehat merupakan cerminan hidup sehat",
  // TODO: ganti nomor WhatsApp asli klinik (format internasional tanpa +/spasi)
  whatsapp: "6281234567890",
  phoneDisplay: "+62 812-3456-7890",
  email: "halo@drgdava.id", // TODO: email asli klinik
  instagram: "https://instagram.com/drgdava", // TODO: akun asli
  url: "https://dentalclinic-dava.vercel.app", // TODO: domain final setelah deploy
} as const;

export const clinicLocations = [
  { id: "pekanbaru", city: "Pekanbaru", region: "Riau" },
  { id: "taluk-kuantan", city: "Taluk Kuantan", region: "Riau" },
] as const;

export type ClinicLocationId = (typeof clinicLocations)[number]["id"];

export function isClinicLocationId(value: unknown): value is ClinicLocationId {
  return clinicLocations.some((location) => location.id === value);
}

export function getClinicLocation(id: string | null | undefined) {
  return clinicLocations.find((location) => location.id === id) ?? null;
}

export type Service = {
  slug: string;
  name: string;
  short: string;
  desc: string;
  priceFrom: number | null; // null = "konsultasi dulu"
  minutes: number;
};

// Harga = harga mulai (placeholder) — TODO: sesuaikan dengan harga resmi klinik
export const services: Service[] = [
  {
    slug: "konsultasi",
    name: "Konsultasi Gigi",
    short: "Pemeriksaan dan diskusi kebutuhan perawatan",
    desc: "Diskusikan keluhan Anda dan lakukan pemeriksaan gigi bersama dokter. Pilihan serta prioritas perawatan dijelaskan sesuai kondisi dan kebutuhan Anda.",
    priceFrom: null,
    minutes: 30,
  },
  {
    slug: "scaling",
    name: "Scaling & Polishing",
    short: "Pembersihan karang gigi & noda",
    desc: "Pembersihan karang gigi dan noda dengan scaler ultrasonik, dilanjutkan polishing agar gigi kembali halus dan bersih. Termasuk pemeriksaan kondisi gusi.",
    priceFrom: 300000,
    minutes: 30,
  },
  {
    slug: "tambal-gigi",
    name: "Tambal Gigi",
    short: "Restorasi gigi berlubang",
    desc: "Penutupan gigi berlubang dengan bahan restorasi yang disesuaikan warna dan lokasi gigi — dari komposit hingga GIC, termasuk tambal gigi sementara.",
    priceFrom: 250000,
    minutes: 45,
  },
  {
    slug: "perawatan-saluran-akar",
    name: "Perawatan Saluran Akar",
    short: "Membantu mempertahankan gigi yang rusak",
    desc: "Perawatan gigi yang sarafnya meradang atau mati tanpa harus dicabut, dibersihkan tahap demi tahap lalu ditutup permanen.",
    priceFrom: 1500000,
    minutes: 90,
  },
  {
    slug: "cabut-gigi",
    name: "Cabut Gigi",
    short: "Ekstraksi gigi yang tidak bisa diselamatkan",
    desc: "Pencabutan gigi yang rusak berat atau goyang, dengan anestesi lokal agar nyaman. Termasuk instruksi perawatan setelah pencabutan.",
    priceFrom: 250000,
    minutes: 45,
  },
  {
    slug: "odontektomi",
    name: "Odontektomi",
    short: "Operasi gigi bungsu",
    desc: "Pencabutan gigi bungsu (molar ketiga) yang tumbuh miring/terbenam melalui prosedur bedah minor dengan anestesi lokal.",
    priceFrom: 750000,
    minutes: 90,
  },
  {
    slug: "bleaching",
    name: "Pemutihan Gigi",
    short: "Bleaching aman di klinik",
    desc: "Pemutihan gigi dengan bahan medis yang terkontrol, hasil lebih cepat dan aman dibanding produk bebas. Konsultasi warna gigi sebelum tindakan.",
    priceFrom: 1500000,
    minutes: 75,
  },
  {
    slug: "gigi-anak",
    name: "Perawatan Gigi Anak",
    short: "Ramah untuk si kecil",
    desc: "Pemeriksaan, tambal gigi susu, dan edukasi menyikat gigi dengan pendekatan yang menyenangkan agar anak tidak trauma ke dokter gigi.",
    priceFrom: 200000,
    minutes: 30,
  },
];

export const featuredSlugs = ["konsultasi", "scaling", "tambal-gigi", "bleaching", "gigi-anak"];

export const testimonials = [
  {
    name: "Sari W.",
    city: "Pasien scaling",
    rating: 5,
    text: "Penjelasannya detail banget sebelum mulai, jadi nggak cemas. Scaling-nya juga nggak sakit sama sekali. Rutenya enak.",
  },
  {
    name: "Bayu P.",
    rating: 5,
    text: "Pernah takut ke dokter gigi bertahun-tahun. Di sini sabar banget, prosedurnya dijelaskan langkah demi langkah. Sekarang malah rutin kontrol.",
    city: "Pasien perawatan saluran akar",
  },
  {
    name: "Nadia & Ayra",
    city: "Pasien gigi anak",
    rating: 5,
    text: "Anak saya yang tadinya nangis di klinik lain, di sini malah betah. Dedikasi gigi susunya beres tanpa drama.",
  },
] as const;

export const faqs = [
  {
    q: "Apakah harus membuat janji temu dulu?",
    a: "Sangat disarankan. Dengan janji temu, waktu tunggu Anda dijamin minim dan dokter sudah menyiapkan perawatan yang Anda butuhkan. Booking bisa lewat form online atau WhatsApp.",
  },
  {
    q: "Apakah perawatan gigi di sini sakit?",
    a: "Setiap tindakan dimulai dari pemeriksaan dan penjelasan. Jika perlu anestesi, kami memberi sebelum tindakan dimulai, dan intensitasnya disesuaikan agar Anda tetap nyaman.",
  },
  {
    q: "Bagaimana menentukan perawatan yang sesuai?",
    a: "Dokter akan memeriksa kondisi gigi, menjelaskan pilihan yang tersedia, lalu menyusun rencana bersama Anda sebelum tindakan dimulai.",
  },
  {
    q: "Anak saya 4 tahun, apakah bisa dirawat di sini?",
    a: "Bisa. Perawatan gigi anak kami didesain ramah: pemeriksaan diperkenalkan pelan-pelan supaya anak nyaman dan tidak trauma.",
  },
  {
    q: "Metode pembayaran apa saja yang diterima?",
    a: "Pembayaran tunai, transfer bank, dan QRIS. TODO: sesuaikan dengan kebijakan klinik.",
  },
] as const;

export const hours = [
  { day: "Senin – Jumat", time: "09.00 – 17.00" },
  { day: "Sabtu", time: "09.00 – 14.00" },
  { day: "Minggu & Libur Nasional", time: "Tutup" },
] as const;
