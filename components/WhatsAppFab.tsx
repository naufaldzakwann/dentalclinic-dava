"use client";

import LocationWhatsAppLink from "@/components/LocationWhatsAppLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useSitePreferences } from "@/components/SitePreferences";

export default function WhatsAppFab() {
  const { clinicLocationId, language } = useSitePreferences();
  const label = clinicLocationId
    ? language === "en" ? "Chat with your clinic on WhatsApp" : "Chat dengan klinik melalui WhatsApp"
    : language === "en" ? "Choose a clinic to start a WhatsApp chat" : "Pilih klinik untuk chat WhatsApp";
  return <LocationWhatsAppLink className="whatsapp-fab fixed bottom-5 right-5 z-40 grid h-13 w-13 place-items-center rounded-full border border-white/20 bg-[#7348a8] text-white shadow-lift transition hover:bg-[#623991] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500">
    <WhatsAppIcon width={24} height={24} />
    <span className="sr-only">{label}</span>
  </LocationWhatsAppLink>;
}
