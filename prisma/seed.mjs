// Seed data awal: dokter, jam praktik, layanan (sumber tunggal: lib/site.ts), dan
// beberapa booking contoh untuk demo dashboard. Idempoten — aman dijalankan berulang.
// Jalankan: npm run db:seed
import prismaPkg from "@prisma/client";
import { syncClinicData } from "../scripts/sync-clinic.mjs";

const { PrismaClient } = prismaPkg;

// Sama seperti lib/booking.ts — dipakai saat membuat/mem-backfill booking.
function slotKeyFor(clinicLocation, dentistId, date, slotTime) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${clinicLocation}|${dentistId ?? "-"}|${y}${m}${d}|${slotTime}`;
}

const prisma = new PrismaClient();

function dateParam(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

async function main() {
  const { dentist } = await syncClinicData(prisma);

  // Jam praktik: Senin–Jumat 09.00–17.00, Sabtu 09.00–14.00, Minggu tutup.
  for (const dayOfWeek of [1, 2, 3, 4, 5]) {
    await prisma.operatingHour.upsert({
      where: { dentistId_dayOfWeek: { dentistId: dentist.id, dayOfWeek } },
      update: {},
      create: { dentistId: dentist.id, dayOfWeek, openTime: "09:00", closeTime: "17:00" },
    });
  }
  await prisma.operatingHour.upsert({
    where: { dentistId_dayOfWeek: { dentistId: dentist.id, dayOfWeek: 6 } },
    update: {},
    create: { dentistId: dentist.id, dayOfWeek: 6, openTime: "09:00", closeTime: "14:00" },
  });

  // Booking contoh pada hari buka berikutnya, supaya dashboard tidak kosong.
  const now = new Date();
  let target = null;
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const hasHours = await prisma.operatingHour.findFirst({ where: { dayOfWeek: d.getDay() } });
    if (hasHours) {
      target = d;
      break;
    }
  }
  if (target && (await prisma.booking.count({ where: { date: target } })) === 0) {
    const demoService = await prisma.service.findUnique({ where: { slug: "scaling" } });
    const demo2 = await prisma.service.findUnique({ where: { slug: "tambal-gigi" } });
    const ymd = dateParam(target);
    const seq = (n) => `DFA-${ymd.slice(2).replaceAll("-", "")}-${String(n).padStart(4, "0")}`;
    await prisma.booking.createMany({
      data: [
        {
          code: seq(1),
          clinicLocation: "pekanbaru",
          name: "Andi Pratama",
          phone: "081234567001",
          email: "andi@example.com",
          serviceId: demo2.id,
          dentistId: dentist.id,
          date: target,
          slotTime: "09:00",
          slotKey: slotKeyFor("pekanbaru", dentist.id, target, "09:00"),
          status: "confirmed",
          notes: "Tambal gigi geraham kanan bawah.",
        },
        {
          code: seq(2),
          clinicLocation: "pekanbaru",
          name: "Rina Marlina",
          phone: "081234567002",
          serviceId: demoService.id,
          dentistId: dentist.id,
          date: target,
          slotTime: "11:00",
          slotKey: slotKeyFor("pekanbaru", dentist.id, target, "11:00"),
          status: "pending",
        },
      ],
    });
    console.log(`Booking contoh dibuat untuk ${ymd}`);
  }

  // Backfill slotKey untuk booking aktif lama (sebelum kolom ini ada).
  const needKey = await prisma.booking.findMany({
    where: { slotKey: null, status: { not: "cancelled" } },
    include: { service: false },
  });
  for (const b of needKey) {
    await prisma.booking.update({
      where: { id: b.id },
      data: { slotKey: slotKeyFor(b.clinicLocation ?? "pekanbaru", b.dentistId, b.date, b.slotTime) },
    });
  }

  console.log(
    `Seed selesai: 1 dokter, ${await prisma.service.count()} layanan, ${await prisma.operatingHour.count()} jam praktik, ${await prisma.booking.count()} booking.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
