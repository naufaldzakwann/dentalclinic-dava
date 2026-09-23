import { site } from "./site";

export function waLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const waBookingMessage =
  "Halo, saya ingin membuat janji temu di praktik drg Dava Fathiyatuzzakiyah. Layanan yang saya minati: ";
