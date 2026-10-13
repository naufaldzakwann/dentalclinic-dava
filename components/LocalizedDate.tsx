"use client";

import { useSitePreferences } from "@/components/SitePreferences";

export default function LocalizedDate({ value }: { value: string }) {
  const { language } = useSitePreferences();
  const date = new Date(value);
  return <>{new Intl.DateTimeFormat(language === "en" ? "en-US" : "id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date)}</>;
}
