"use client";

import { useSitePreferences } from "@/components/SitePreferences";

/** Inline bilingual copy that follows the visitor's existing site preference. */
export function LocalizedCopy({ id, en = id, words = false }: { id: string; en?: string; words?: boolean }) {
  const { language } = useSitePreferences();
  const text = language === "en" ? en : id;

  if (!words) return <>{text}</>;

  return <>{text.split(/(\s+)/).map((part, index) => (
    index % 2 === 0 && part ? <span key={index} data-heading-word>{part}</span> : part
  ))}</>;
}

export default LocalizedCopy;
