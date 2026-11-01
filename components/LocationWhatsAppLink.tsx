"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useSitePreferences } from "@/components/SitePreferences";
import { appointmentMessage, waLink } from "@/lib/wa";
import { getClinicLocation, services } from "@/lib/site";

type Props = {
  children: ReactNode;
  className?: string;
  purpose?: "booking" | "question" | "service";
  serviceSlug?: string;
};

export default function LocationWhatsAppLink({ children, className, purpose = "booking", serviceSlug }: Props) {
  const { clinicLocationId, language } = useSitePreferences();
  const clinic = getClinicLocation(clinicLocationId);
  const validService = services.some((service) => service.slug === serviceSlug) ? serviceSlug : undefined;
  if (!clinic || !clinicLocationId) {
    const href = validService ? `/booking?service=${encodeURIComponent(validService)}` : "/booking";
    return <Link href={href} className={className}>{children}</Link>;
  }
  const message = purpose === "question"
    ? language === "en"
      ? `Hello, I have a question about dental care.\nClinic: ${clinic.city}`
      : `Halo, saya ingin bertanya seputar perawatan gigi.\nLokasi klinik: ${clinic.city}`
    : appointmentMessage({ clinicId: clinicLocationId, language, serviceSlug: purpose === "service" ? validService : undefined });
  return <a href={waLink(message, clinicLocationId)} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}
