// Sinkronisasi dokter dan katalog layanan tanpa membuat atau mengubah booking.
// Jalankan dari root proyek: node scripts/sync-clinic.mjs
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import prismaPkg from "@prisma/client";
import { services, site } from "../lib/site.ts";

const { PrismaClient } = prismaPkg;

export async function syncClinicData(prisma) {
  return prisma.$transaction(async (transaction) => {
    const dentistData = {
      name: site.name,
      bio: `${site.specialty} — pemeriksaan, restorasi, dan perawatan saluran akar dengan penjelasan sebelum tindakan.`,
    };
    const dentist = await transaction.dentist.upsert({
      where: { id: "drg-dava" },
      update: dentistData,
      create: { id: "drg-dava", ...dentistData },
    });

    for (const service of services) {
      const serviceData = {
        name: service.name,
        short: service.short,
        description: service.desc,
        priceFrom: service.priceFrom,
        duration: service.minutes,
        isActive: true,
      };
      await transaction.service.upsert({
        where: { slug: service.slug },
        update: serviceData,
        create: { slug: service.slug, ...serviceData },
      });
    }

    // Layanan yang dihapus dari katalog tetap disimpan agar riwayat booking utuh.
    const retired = await transaction.service.updateMany({
      where: { slug: { notIn: services.map((service) => service.slug) }, isActive: true },
      data: { isActive: false },
    });

    return { dentist, activeServices: services.length, deactivatedServices: retired.count };
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const prisma = new PrismaClient();
  syncClinicData(prisma)
    .then(({ activeServices, deactivatedServices }) => {
      console.log(`Sinkronisasi selesai: profil dokter diperbarui, ${activeServices} layanan aktif, ${deactivatedServices} layanan dinonaktifkan. Booking tidak diubah.`);
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
}
