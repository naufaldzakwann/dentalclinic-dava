// Data edukasi gigi untuk panel interaktif 3D (klik gigi di beranda).
export type ToothType = "I1" | "I2" | "C" | "PM1" | "PM2" | "M1" | "M2";

export type ToothInfo = {
  type: ToothType;
  name: string; // "Geraham Pertama"
  arch: "U" | "L"; // U = atas, L = bawah
  fungsi: string;
  jumlah: string;
  erupsi: string;
  fakta: string;
};

const TYPE_DATA: Record<ToothType, Omit<ToothInfo, "arch">> = {
  I1: {
    type: "I1",
    name: "Insisif Tengah",
    fungsi: "Memotong makanan menjadi bagian kecil sebelum dikunyah gigi lain.",
    jumlah: "4 gigi — 2 atas, 2 bawah",
    erupsi: "6–8 tahun",
    fakta: "Gigi paling terlihat saat tersenyum dan yang pertama tumbuh sebagai gigi dewasa.",
  },
  I2: {
    type: "I2",
    name: "Insisif Lateral",
    fungsi: "Membantu memotong makanan dan membentuk lengkung senyum.",
    jumlah: "4 gigi — 2 atas, 2 bawah",
    erupsi: "7–9 tahun",
    fakta: "Bentuknya paling bervariasi antar orang — kadang bahkan tidak tumbuh sama sekali.",
  },
  C: {
    type: "C",
    name: "Kaninus (Taring)",
    fungsi: "Menyobek makanan agak keras dan menuntun rahang saat mengunyah.",
    jumlah: "4 gigi — 2 atas, 2 bawah",
    erupsi: "9–12 tahun",
    fakta: "Punya akar paling panjang dari semua gigi — sering jadi gigi terakhir yang terlepas di usia tua.",
  },
  PM1: {
    type: "PM1",
    name: "Premolar Pertama",
    fungsi: "Merupakan gigi transisi: merobek seperti taring sekaligus mengunyah seperti geraham.",
    jumlah: "4 gigi — 2 atas, 2 bawah",
    erupsi: "10–11 tahun",
    fakta: "Menggantikan geraham susu — satu-satunya gigi dewasa yang 'mewarisi' tempat geraham.",
  },
  PM2: {
    type: "PM2",
    name: "Premolar Kedua",
    fungsi: "Mengunyah dan menghaluskan makanan sebelum ditelan.",
    jumlah: "4 gigi — 2 atas, 2 bawah",
    erupsi: "10–12 tahun",
    fakta: "Permukaannya sering dipakai sebagai gigi penyangga behel atau jembatan gigi.",
  },
  M1: {
    type: "M1",
    name: "Geraham Pertama",
    fungsi: "Mesin pengunyah utama — menahan sebagian besar beban kunyah.",
    jumlah: "4 gigi — 2 atas, 2 bawah",
    erupsi: "6–7 tahun",
    fakta: "Gigi permanen pertama yang tumbuh — sering disangka gigi susu sehingga kurang dirawat, padahal paling rawan berlubang.",
  },
  M2: {
    type: "M2",
    name: "Geraham Kedua",
    fungsi: "Membantu geraham pertama mengunyah makanan yang keras.",
    jumlah: "4 gigi — 2 atas, 2 bawah",
    erupsi: "11–13 tahun",
    fakta: "Posisinya paling belakang sehingga paling sulit dibersihkan — jangan lupa sikat sampai ke sana.",
  },
};

/** Parse nama node "tooth_U_M1_R" → info lengkap untuk panel. */
export function parseToothName(name: string): ToothInfo | null {
  const parts = name.split("_");
  if (parts.length !== 4 || parts[0] !== "tooth") return null;
  const arch = parts[1] as "U" | "L";
  const type = parts[2] as ToothType;
  const data = TYPE_DATA[type];
  if (!data || (arch !== "U" && arch !== "L")) return null;
  return { ...data, arch };
}

export const archLabel = (arch: "U" | "L") => (arch === "U" ? "Gigi Atas" : "Gigi Bawah");
