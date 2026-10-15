"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { services } from "@/lib/site";
import { waLink } from "@/lib/wa";
import { ArrowRightIcon, CheckIcon } from "../icons";
import ClinicSelector from "@/components/ClinicSelector";
import { useSitePreferences } from "@/components/SitePreferences";

function formatDate(dateParam: string, language: "id" | "en"): string {
  const [year, month, day] = dateParam.split("-").map(Number);
  return new Intl.DateTimeFormat(language === "en" ? "en-US" : "id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

function todayParam(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

const inputClass =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-cream";
const stepCard = "rounded-[18px] border border-ink/10 bg-white p-6 sm:p-8";
const stepChip = "tabular grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-semibold";

function StepHeader({ n, title, hint, done }: { n: string; title: string; hint: string; done: boolean }) {
  return (
    <div className="mb-5 flex items-start gap-4">
      <span aria-hidden="true" className={`${stepChip} ${done ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700"}`}>
        {done ? <CheckIcon width={15} height={15} /> : n}
      </span>
      <div>
        <h2 id={`booking-step-${n}`} className="text-lg font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{hint}</p>
      </div>
    </div>
  );
}

type SlotsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; slots: string[] }
  | { status: "closed" }
  | { status: "past" }
  | { status: "error" };

export default function BookingForm() {
  const { clinicLocationId, language, t } = useSitePreferences();
  const [serviceSlug, setServiceSlug] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [slotTime, setSlotTime] = useState<string | null>(null);
  const [slotState, setSlotState] = useState<SlotsState>({ status: "idle" });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const successHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const service = services.find((item) => item.slug === serviceSlug) ?? null;
  const clinicName = clinicLocationId === "pekanbaru" ? "Pekanbaru" : clinicLocationId === "taluk-kuantan" ? "Taluk Kuantan" : "";
  const scheduleLocked = !clinicLocationId || !serviceSlug;

  useEffect(() => {
    const requestedService = new URLSearchParams(window.location.search).get("service");
    if (services.some((item) => item.slug === requestedService)) {
      setServiceSlug(requestedService);
    }
  }, []);

  useEffect(() => {
    if (code) successHeadingRef.current?.focus();
  }, [code]);

  useEffect(() => {
    abortRef.current?.abort();
    setSlotTime(null);
    if (!clinicLocationId || !serviceSlug || !date) {
      setSlotState({ status: "idle" });
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setSlotState({ status: "loading" });

    const params = new URLSearchParams({ date, serviceId: serviceSlug, clinicLocation: clinicLocationId });
    fetch(`/api/availability?${params.toString()}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) setSlotState({ status: "ready", slots: data.slots });
        else if (data.reason === "closed") setSlotState({ status: "closed" });
        else if (data.reason === "past") setSlotState({ status: "past" });
        else setSlotState({ status: "error" });
      })
      .catch((error) => {
        if ((error as Error).name !== "AbortError") setSlotState({ status: "error" });
      });

    return () => controller.abort();
  }, [clinicLocationId, serviceSlug, date]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!clinicLocationId) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ clinicLocation: clinicLocationId, serviceSlug, date, slotTime, name, phone, email, notes, consent, website: "" }),
      });
      const data = await response.json();
      if (response.status === 201 && data.ok) {
        setCode(data.code);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitError(language === "en" ? t("booking.submitError", "Something went wrong. Please try again.") : data.error ?? "Terjadi kesalahan. Coba lagi.");
      }
    } catch {
      setSubmitError(t("booking.networkError", "Tidak dapat menghubungi server. Periksa koneksi lalu coba lagi."));
    } finally {
      setSubmitting(false);
    }
  }

  if (code) {
    const englishMessage = `Hello, I have just booked an appointment through the website.\nBooking code: ${code}\nClinic: ${clinicName}\nName: ${name}\nTreatment: ${service ? t(`service.${service.slug}.name`, service.name) : ""}\nSchedule: ${formatDate(date, language)} at ${slotTime}`;
    const indonesianMessage = `Halo, saya baru memesan janji temu lewat website.\nKode booking: ${code}\nLokasi: ${clinicName}\nNama: ${name}\nLayanan: ${service?.name}\nJadwal: ${formatDate(date, language)} pukul ${slotTime}`;
    return (
      <div className="rounded-[18px] border border-brand-200 bg-white p-8 text-center sm:p-10">
        <span aria-hidden="true" className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700"><CheckIcon width={26} height={26} /></span>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">{t("booking.received", "Booking diterima")}</p>
        <h2 ref={successHeadingRef} tabIndex={-1} className="mt-2 text-2xl font-bold text-ink outline-none sm:text-3xl">{t("booking.saveCode", "Simpan kode Anda")}</h2>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setCopied(true);
            } catch {
              setCopied(false);
            }
          }}
          title={t("booking.copyTitle", "Klik untuk menyalin kode")}
          className="tabular mt-5 block w-full rounded-2xl bg-cream px-6 py-5 text-2xl font-extrabold tracking-wide text-ink ring-1 ring-ink/10 transition hover:ring-brand-300 sm:text-3xl"
        >
          {code}
          <span role="status" aria-live="polite" className="mt-1 block text-xs font-semibold uppercase tracking-widest text-ink-soft">
            {copied ? t("booking.copied", "tersalin ✓") : t("booking.copy", "klik untuk menyalin")}
          </span>
        </button>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-soft">{t("booking.arrive", "Tunjukkan kode ini saat datang. Status booking bisa dipantau kapan saja, dan staf klinik akan mengonfirmasi lewat WhatsApp.")}</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a href={waLink(language === "en" ? englishMessage : indonesianMessage)} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
            {t("booking.confirmWhatsApp", "Konfirmasi via WhatsApp")}
          </a>
          <Link href={`/booking/${code}`} className="rounded-xl border border-ink/15 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-brand-300">
            {t("booking.viewStatus", "Lihat Status Booking")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} aria-busy={submitting} className="space-y-4">
      <section aria-labelledby="booking-step-01" className={stepCard}>
        <StepHeader n="01" title={t("booking.step1", "Pilih lokasi klinik")} hint={t("booking.step1hint", "Di cabang mana Anda ingin berkunjung?")} done={!!clinicLocationId} />
        <fieldset disabled={submitting} className="min-w-0">
          <legend className="sr-only">{t("booking.step1", "Pilih lokasi klinik")}</legend>
          <ClinicSelector variant="cards" />
        </fieldset>
      </section>

      <section aria-labelledby="booking-step-02" className={stepCard}>
        <StepHeader n="02" title={t("booking.step2", "Pilih layanan")} hint={!clinicLocationId ? (language === "en" ? "Choose a clinic in step 01 to continue." : "Pilih lokasi klinik pada langkah 01 untuk melanjutkan.") : t("booking.step2hint", "Apa yang ingin Anda lakukan di klinik?")} done={!!service} />
        <fieldset disabled={!clinicLocationId || submitting} className="min-w-0">
          <legend className="sr-only">{t("booking.step2", "Pilih layanan")}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
          {services.map((item) => {
            const active = item.slug === serviceSlug;
            return (
              <button type="button" key={item.slug} onClick={() => { setServiceSlug(item.slug); setSlotTime(null); }} aria-pressed={active} className={`rounded-xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${active ? "border-brand-600 bg-brand-50" : "border-ink/10 bg-white enabled:hover:border-brand-300"}`}>
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-ink">{t(`service.${item.slug}.name`, item.name)}</span>
                  <span className="tabular shrink-0 text-xs text-ink-soft">±{item.minutes} {t("booking.minutesShort", "mnt")}</span>
                </span>
              </button>
            );
          })}
          </div>
        </fieldset>
      </section>

      <section aria-labelledby="booking-step-03" className={stepCard}>
        <StepHeader n="03" title={t("booking.step3", "Pilih tanggal & jam")} hint={scheduleLocked ? (language === "en" ? "Choose your clinic and treatment first." : "Pilih lokasi klinik dan layanan terlebih dahulu.") : t("booking.step3hint", "Slot mengikuti jam praktik dan yang masih kosong.")} done={!!slotTime} />
        <fieldset disabled={scheduleLocked || submitting} className="min-w-0">
          <legend className="sr-only">{t("booking.step3", "Pilih tanggal & jam")}</legend>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">{t("booking.date", "Tanggal kunjungan")}</span>
          <input type="date" name="appointmentDate" required min={todayParam()} value={date} onChange={(event) => { setDate(event.target.value); setSlotTime(null); }} aria-describedby="booking-timezone" className={inputClass} />
        </label>
        <p id="booking-timezone" className="mt-2 text-xs text-ink-soft">{language === "en" ? "All appointment times are in Western Indonesia Time (WIB, UTC+7)." : "Semua jam kunjungan menggunakan Waktu Indonesia Barat (WIB, UTC+7)."}</p>

        {date && (
          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-ink">{t("booking.times", "Jam tersedia")} <span className="font-normal text-ink-soft">— {formatDate(date, language)}</span></p>
            <div role="status" aria-live="polite" aria-atomic="true">
            {slotState.status === "loading" && <p className="text-sm text-ink-soft">{t("booking.loading", "Memuat slot…")}</p>}
            {slotState.status === "closed" && <p className="text-sm text-ink-soft">{language === "en" ? "The clinic is closed on this date. Please choose another day." : "Klinik tutup pada tanggal ini. Silakan pilih tanggal lain."}</p>}
            {slotState.status === "past" && <p className="text-sm text-ink-soft">{language === "en" ? "This date has passed. Choose a future date." : "Tanggal sudah lewat. Pilih tanggal mendatang."}</p>}
            {slotState.status === "ready" && slotState.slots.length > 0 && <p className="sr-only">{language === "en" ? `${slotState.slots.length} appointment times available.` : `${slotState.slots.length} jam kunjungan tersedia.`}</p>}
            {slotState.status === "ready" && slotState.slots.length === 0 && <p className="text-sm text-ink-soft">{t("booking.empty", "Tidak ada slot tersisa pada tanggal ini. Coba tanggal lain.")}</p>}
            </div>
            {slotState.status === "error" && <p role="alert" className="text-sm text-red-600">{t("booking.loadError", "Gagal memuat jadwal. Ubah tanggal dan coba lagi.")}</p>}
            {slotState.status === "ready" && slotState.slots.length > 0 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label={t("booking.times", "Jam tersedia")}>
                {slotState.slots.map((time) => {
                  const active = time === slotTime;
                  return (
                    <label key={time} className="relative cursor-pointer">
                      <input type="radio" name="appointmentTime" value={time} checked={active} required onChange={() => setSlotTime(time)} className="peer sr-only" />
                      <span className={`tabular block min-w-20 rounded-lg border px-4 py-2.5 text-center text-sm font-semibold transition peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-600 peer-disabled:cursor-not-allowed ${active ? "border-brand-600 bg-brand-600 text-white" : "border-ink/10 bg-white text-ink hover:border-brand-300 hover:bg-brand-50"}`}>{time}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}
        </fieldset>
      </section>

      <section aria-labelledby="booking-step-04" className={stepCard}>
        <StepHeader n="04" title={t("booking.step4", "Data diri")} hint={!slotTime ? (language === "en" ? "Choose an appointment date and time to continue." : "Pilih tanggal dan jam kunjungan untuk melanjutkan.") : t("booking.step4hint", "Cukup nama, WhatsApp, dan keluhan singkat.")} done={false} />
        {service && slotTime && (
          <dl className="mb-6 grid gap-4 rounded-xl border border-brand-100 bg-brand-50/60 p-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-ink-soft">{language === "en" ? "Your appointment" : "Kunjungan Anda"}</dt>
              <dd className="mt-1 font-semibold text-ink">{t(`service.${service.slug}.name`, service.name)}</dd>
              <dd className="mt-1 text-ink-soft">{clinicName}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-soft">{language === "en" ? "Date & time" : "Tanggal & jam"}</dt>
              <dd className="mt-1 font-semibold text-ink">{formatDate(date, language)}</dd>
              <dd className="tabular mt-1 text-ink-soft">{slotTime} WIB</dd>
            </div>
          </dl>
        )}

        <fieldset disabled={!slotTime || submitting} className="min-w-0">
          <legend className="sr-only">{t("booking.step4", "Data diri")}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-ink">{t("booking.name", "Nama lengkap")}</span>
            <input name="name" autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} className={inputClass} placeholder={t("booking.namePlaceholder", "Nama sesuai identitas")} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">{t("booking.phone", "Nomor WhatsApp")}</span>
            <input name="phone" autoComplete="tel" required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={inputClass} placeholder={language === "en" ? "+62 812 3456 7890" : "08xxxxxxxxxx"} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">{t("booking.email", "Email")} <span className="font-normal text-ink-soft">({t("booking.optional", "opsional")})</span></span>
            <input name="email" autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} placeholder={t("booking.emailPlaceholder", "untuk notifikasi")} />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-ink">{t("booking.concern", "Keluhan singkat")} <span className="font-normal text-ink-soft">({t("booking.optional", "opsional")})</span></span>
            <textarea name="notes" rows={3} maxLength={500} value={notes} onChange={(event) => setNotes(event.target.value)} className={`${inputClass} resize-y`} placeholder={t("booking.concernPlaceholder", "Contoh: gigi geraham kanan bawah nyeri saat mengunyah sejak 2 minggu")} />
          </label>
        </div>

        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value="" onChange={() => {}} className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0" />

        <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
          <input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600" />
          <span>{t("booking.privacyAgree", "Saya setuju data di atas diproses untuk keperluan booking sesuai")} {" "}
            <Link href="/kebijakan-privasi" tabIndex={!slotTime || submitting ? -1 : undefined} className="font-semibold text-brand-700 underline underline-offset-4">{t("booking.privacy", "kebijakan privasi")}</Link>.
          </span>
        </label>

        <button type="submit" disabled={!clinicLocationId || !service || !date || !slotTime || !name || !phone || !consent || submitting} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-7 py-3.5 text-sm font-semibold text-white transition enabled:hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
          {submitting ? t("booking.sending", "Mengirim…") : t("booking.send", "Kirim Booking")}
          {!submitting && <ArrowRightIcon width={16} height={16} />}
        </button>
        </fieldset>
        <div role="status" aria-live="polite" aria-atomic="true" className="mt-3 text-sm text-ink-soft">
          {submitting ? t("booking.sending", "Mengirim…") : ""}
        </div>
        {submitError && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{submitError}</p>}
      </section>
    </form>
  );
}
