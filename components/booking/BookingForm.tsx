"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { services, rupiah } from "@/lib/site";
import { waLink } from "@/lib/wa";
import { ArrowRightIcon, CheckIcon } from "../icons";

const DAY_LABELS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function formatDateId(dateParam: string): string {
  const [y, m, d] = dateParam.split("-").map(Number);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
}

function todayParam(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

const inputClass =
  "w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-soft/50 focus:border-brand-500";

const stepChip =
  "tabular grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold";

function StepHeader({ n, title, hint, done }: { n: string; title: string; hint: string; done: boolean }) {
  return (
    <div className="mb-5 flex items-start gap-4">
      <span
        className={`${stepChip} ${
          done ? "bg-brand-600 text-white" : "bg-white text-ink-soft ring-1 ring-ink/10"
        }`}
      >
        {done ? <CheckIcon width={15} height={15} /> : n}
      </span>
      <div>
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        <p className="text-sm text-ink-soft">{hint}</p>
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
  const [serviceSlug, setServiceSlug] = useState<string | null>(null);
  const [date, setDate] = useState<string>("");
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

  const service = services.find((s) => s.slug === serviceSlug) ?? null;
  const scheduleLocked = !serviceSlug;

  useEffect(() => {
    if (!serviceSlug || !date) {
      setSlotState({ status: "idle" });
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setSlotState({ status: "loading" });
    setSlotTime(null);

    fetch(`/api/availability?date=${date}&serviceId=${serviceSlug}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setSlotState({ status: "ready", slots: data.slots });
        else if (data.reason === "closed") setSlotState({ status: "closed" });
        else if (data.reason === "past") setSlotState({ status: "past" });
        else setSlotState({ status: "error" });
      })
      .catch((e) => {
        if ((e as Error).name !== "AbortError") setSlotState({ status: "error" });
      });

    return () => controller.abort();
  }, [serviceSlug, date]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          serviceSlug,
          date,
          slotTime,
          name,
          phone,
          email,
          notes,
          consent,
          website: "",
        }),
      });
      const data = await res.json();
      if (res.status === 201 && data.ok) {
        setCode(data.code);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitError(data.error ?? "Terjadi kesalahan. Coba lagi.");
      }
    } catch {
      setSubmitError("Tidak dapat menghubungi server. Periksa koneksi lalu coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (code) {
    const waMsg = `Halo, saya baru memesan janji temu lewat website.\nKode booking: ${code}\nNama: ${name}\nLayanan: ${service?.name}\nJadwal: ${formatDateId(date)} pukul ${slotTime}`;
    return (
      <div className="rounded-[1.75rem] border border-brand-200 bg-white p-8 text-center shadow-lift sm:p-10">
        <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white shadow-card">
          <CheckIcon width={26} height={26} />
        </span>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-700">Booking diterima</p>
        <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Simpan kode Anda</h2>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(code!).then(() => setCopied(true));
          }}
          title="Klik untuk menyalin"
          className="tabular mt-5 block w-full rounded-2xl bg-cream px-6 py-5 text-2xl font-extrabold tracking-wide text-ink ring-1 ring-ink/10 transition hover:ring-brand-300 sm:text-3xl"
        >
          {code}
          <span className="mt-1 block text-xs font-semibold uppercase tracking-widest text-ink-soft">
            {copied ? "tersalin ✓" : "klik untuk menyalin"}
          </span>
        </button>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-soft">
          Tunjukkan kode ini saat datang. Status booking bisa dipantau kapan saja, dan staf klinik
          akan mengonfirmasi lewat WhatsApp.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href={waLink(waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-brand-700"
          >
            Konfirmasi via WhatsApp
          </a>
          <Link
            href={`/booking/${code}`}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink ring-1 ring-ink/10 transition hover:ring-brand-300"
          >
            Lihat Status Booking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Langkah 1 — layanan */}
      <section className="rounded-[1.75rem] bg-white p-6 shadow-card sm:p-8">
        <StepHeader n="01" title="Pilih layanan" hint="Apa yang ingin Anda lakukan di klinik?" done={!!service} />
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((s) => {
            const active = s.slug === serviceSlug;
            return (
              <button
                type="button"
                key={s.slug}
                onClick={() => setServiceSlug(s.slug)}
                aria-pressed={active}
                className={`rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-brand-600 bg-brand-50 shadow-card"
                    : "border-ink/10 bg-white hover:border-brand-300"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-bold text-ink">{s.name}</span>
                  <span className="tabular text-xs text-ink-soft">±{s.minutes} mnt</span>
                </span>
                <span className="tabular mt-0.5 block text-xs text-ink-soft">
                  {s.priceFrom ? `Mulai ${rupiah(s.priceFrom)}` : "Konsultasi dulu"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Langkah 2 — jadwal */}
      <section
        className={`rounded-[1.75rem] bg-white p-6 shadow-card sm:p-6 sm:p-8 transition ${
          scheduleLocked ? "pointer-events-none opacity-40" : ""
        }`}
      >
        <StepHeader
          n="02"
          title="Pilih tanggal & jam"
          hint="Slot mengikuti jam praktik dan yang masih kosong."
          done={!!slotTime}
        />
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">Tanggal kunjungan</span>
          <input
            type="date"
            required
            min={todayParam()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </label>

        {date && (
          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-ink">
              Jam tersedia <span className="font-normal text-ink-soft">— {formatDateId(date)}</span>
            </p>
            {slotState.status === "loading" && <p className="text-sm text-ink-soft">Memuat slot…</p>}
            {slotState.status === "error" && (
              <p className="text-sm text-red-600">Gagal memuat jadwal. Ubah tanggal untuk mencoba lagi.</p>
            )}
            {slotState.status === "closed" && (
              <p className="text-sm text-ink-soft">
                Klinik tutup pada tanggal ini. Coba tanggal lain — Senin–Jumat 09.00–17.00, Sabtu
                09.00–14.00.
              </p>
            )}
            {slotState.status === "past" && (
              <p className="text-sm text-ink-soft">Tanggal sudah lewat. Pilih tanggal mendatang.</p>
            )}
            {slotState.status === "ready" &&
              (slotState.slots.length === 0 ? (
                <p className="text-sm text-ink-soft">
                  Tidak ada slot tersisa pada tanggal ini — semua terisi. Coba tanggal lain.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Jam tersedia">
                  {slotState.slots.map((t) => {
                    const active = t === slotTime;
                    return (
                      <button
                        type="button"
                        key={t}
                        role="radio"
                        aria-checked={active}
                        onClick={() => setSlotTime(t)}
                        className={`tabular rounded-full px-4 py-2 text-sm font-semibold transition ${
                          active
                            ? "bg-brand-600 text-white shadow-card"
                            : "bg-brand-50 text-brand-800 hover:bg-brand-100"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              ))}
          </div>
        )}
      </section>

      {/* Langkah 3 — data diri */}
      <section
        className={`rounded-[1.75rem] bg-white p-6 shadow-card sm:p-8 transition ${
          !slotTime ? "pointer-events-none opacity-40" : ""
        }`}
      >
        <StepHeader n="03" title="Data diri" hint="Cukup nama, WhatsApp, dan keluhan singkat." done={false} />

        {service && slotTime && (
          <p className="tabular mb-5 rounded-2xl bg-cream px-4 py-3 text-sm text-ink-soft ring-1 ring-ink/5">
            {service.name} · {formatDateId(date)} · {slotTime} WIB
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Nama lengkap</span>
            <input
              required
              minLength={2}
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Nama sesuai identitas"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Nomor WhatsApp</span>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="08xxxxxxxxxx"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">
              Email <span className="font-normal text-ink-soft">(opsional)</span>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="untuk notifikasi"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-ink">
              Keluhan singkat <span className="font-normal text-ink-soft">(opsional)</span>
            </span>
            <textarea
              rows={3}
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${inputClass} resize-none`}
              placeholder="Contoh: gigi geraham kanan bawah nyeri saat mengunyah sejak 2 minggu"
            />
          </label>
        </div>

        {/* Honeypot — tersembunyi dari manusia, menggoda bot */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={""}
          onChange={() => {}}
          className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
          />
          <span>
            Saya setuju data di atas diproses untuk keperluan booking sesuai{" "}
            <Link href="/kebijakan-privasi" className="font-semibold text-brand-700 underline underline-offset-4">
              kebijakan privasi
            </Link>
            .
          </span>
        </label>

        {submitError && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={!service || !date || !slotTime || !name || !phone || !consent || submitting}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lift transition enabled:hover:-translate-y-0.5 enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Mengirim…" : "Kirim Booking"}
          {!submitting && <ArrowRightIcon width={16} height={16} />}
        </button>
      </section>
    </form>
  );
}
