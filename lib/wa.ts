import { getClinicLocation, services, site, type ClinicLocationId } from "./site";
import { translate, type Language } from "./i18n";

/** Only configured contacts can become a WhatsApp destination. */
export function waLink(message: string, clinicId?: ClinicLocationId | null): string {
  const configuredNumber = getClinicLocation(clinicId)?.whatsapp ?? site.whatsapp;
  const number = configuredNumber.replace(/[\s()+-]/g, "");
  if (!/^[1-9]\d{7,14}$/.test(number)) throw new Error("Invalid clinic WhatsApp configuration.");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const waBookingMessage = `Halo, saya ingin mengatur janji konsultasi dengan ${site.name}`;

export type AppointmentDetails = {
  clinicId: ClinicLocationId;
  language?: Language;
  serviceSlug?: string;
  date?: string;
  time?: string;
  name?: string;
  notes?: string;
};

function preferredDate(value: string | undefined, language: Language): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return new Intl.DateTimeFormat(language === "en" ? "en-GB" : "id-ID", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta",
  }).format(date);
}

/** This prepares a message only. Opening WhatsApp never reserves a time. */
export function appointmentMessage({ clinicId, language = "id", serviceSlug, date, time, name, notes }: AppointmentDetails): string {
  const clinic = getClinicLocation(clinicId);
  if (!clinic) throw new Error("Choose a clinic before preparing an appointment message.");
  const english = language === "en";
  const service = services.find((item) => item.slug === serviceSlug);
  const formattedDate = preferredDate(date, language);
  const formattedTime = time && /^([01]\d|2[0-3]):[0-5]\d$/.test(time) ? `${time} WIB (UTC+7)` : null;
  return [
    english ? `Hello, I would like to arrange an appointment with ${site.name}` : waBookingMessage,
    "",
    `${english ? "Clinic" : "Lokasi klinik"}: ${clinic.city}`,
    ...(name?.trim() ? [`${english ? "Name" : "Nama"}: ${name.trim().slice(0, 80)}`] : []),
    ...(service ? [`${english ? "Treatment" : "Layanan"}: ${translate(language, `service.${service.slug}.name`, service.name)}`] : []),
    ...(formattedDate ? [`${english ? "Preferred date" : "Pilihan tanggal"}: ${formattedDate}`] : []),
    ...(formattedTime ? [`${english ? "Preferred time" : "Pilihan jam"}: ${formattedTime}`] : []),
    ...(notes?.trim() ? [`${english ? "Note" : "Catatan"}: ${notes.trim().slice(0, 400)}`] : []),
    "",
    english ? "Please help me confirm an available appointment time. Thank you." : "Mohon bantu konfirmasi jadwal yang tersedia. Terima kasih.",
  ].join("\n");
}
