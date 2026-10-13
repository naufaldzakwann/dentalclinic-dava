"use client";

import { MapPinIcon } from "@/components/icons";
import { useSitePreferences } from "@/components/SitePreferences";
import { clinicLocations } from "@/lib/site";

type Props = { variant?: "compact" | "cards" };

export default function ClinicSelector({ variant = "compact" }: Props) {
  const { clinicLocationId, setClinicLocationId, t } = useSitePreferences();

  if (variant === "cards") {
    return (
      <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label={t("location.label", "Lokasi klinik")}>
        {clinicLocations.map((location) => {
          const selected = clinicLocationId === location.id;
          const name = location.id === "pekanbaru" ? "Pekanbaru" : "Taluk Kuantan";
          return (
            <button
              key={location.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setClinicLocationId(location.id)}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                selected
                  ? "border-brand-500 bg-brand-50 shadow-card"
                  : "border-ink/10 bg-white hover:border-brand-300"
              }`}
            >
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${selected ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700"}`}>
                <MapPinIcon width={19} height={19} />
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-ink">
                  {t(location.id === "pekanbaru" ? "location.pekanbaru" : "location.taluk", `Klinik ${name}`)}
                </span>
                <span className="mt-0.5 block text-xs text-ink-soft">{t("location.region", "Riau, Indonesia")}</span>
              </span>
              {selected && <span className="ml-auto mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-600" aria-hidden />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <label className="relative inline-flex items-center">
      <MapPinIcon width={15} height={15} className="pointer-events-none absolute left-3 text-brand-700" />
      <span className="sr-only">{t("location.label", "Lokasi klinik")}</span>
      <select
        aria-label={t("location.label", "Lokasi klinik")}
        value={clinicLocationId ?? ""}
        onChange={(event) => setClinicLocationId(event.target.value ? event.target.value as typeof clinicLocationId : null)}
        className="h-10 w-[10.75rem] appearance-none rounded-full border border-brand-200 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
      >
        <option value="">{t("location.choose", "Pilih klinik")}</option>
        <option value="pekanbaru">Pekanbaru</option>
        <option value="taluk-kuantan">Taluk Kuantan</option>
      </select>
    </label>
  );
}
