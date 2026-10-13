"use client";

import type { ReactNode } from "react";
import { useSitePreferences } from "@/components/SitePreferences";
import { waLink } from "@/lib/wa";
import { services } from "@/lib/site";

type Props = {
  children: ReactNode;
  className?: string;
  purpose?: "booking" | "question" | "service";
  serviceSlug?: string;
};

export default function LocationWhatsAppLink({ children, className, purpose = "booking", serviceSlug }: Props) {
  const { clinicLocationId, language, t } = useSitePreferences();
  const clinicName = clinicLocationId === "pekanbaru" ? "Pekanbaru" : clinicLocationId === "taluk-kuantan" ? "Taluk Kuantan" : null;
  const message = purpose === "question"
    ? language === "en" ? "Hello, I have a question about dental care." : "Halo, saya ingin bertanya seputar perawatan gigi."
    : language === "en" ? "Hello, I would like to make an appointment with drg Dava Fathiyatuzzakiyah." : "Halo, saya ingin membuat janji temu di praktik drg Dava Fathiyatuzzakiyah.";
  const details = [
    ...(clinicName ? [`${language === "en" ? "Clinic" : "Lokasi"}: ${clinicName}`] : []),
    ...(purpose === "service" && serviceSlug ? [`${language === "en" ? "Treatment" : "Layanan"}: ${t(`service.${serviceSlug}.name`, services.find((item) => item.slug === serviceSlug)?.name ?? serviceSlug)}`] : []),
  ];
  const href = waLink(details.length ? `${message}\n${details.join("\n")}` : message);

  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}
