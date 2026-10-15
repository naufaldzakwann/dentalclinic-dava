"use client";

import { useSitePreferences } from "@/components/SitePreferences";

/** Inline bilingual copy that follows the visitor's existing site preference. */
export function LocalizedCopy({ id, en }: { id: string; en: string }) {
  const { language } = useSitePreferences();
  return <>{language === "en" ? en : id}</>;
}

export default LocalizedCopy;
