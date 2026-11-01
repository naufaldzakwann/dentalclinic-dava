"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { clinicLocations, isClinicLocationId, services } from "@/lib/site";
import { appointmentMessage, waLink } from "@/lib/wa";
import { ArrowRightIcon, CheckIcon, MapPinIcon } from "@/components/icons";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useSitePreferences } from "@/components/SitePreferences";
import styles from "./Booking.module.css";

function todayInWIB() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const part = (type: string) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export default function BookingForm() {
  const { ready, clinicLocationId, setClinicLocationId, language, t } = useSitePreferences();
  const english = language === "en";
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const queryApplied = useRef<string | null>(null);
  const [serviceSlug, setServiceSlug] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [minimumDate, setMinimumDate] = useState("");

  useEffect(() => {
    if (!ready || queryApplied.current === query) return;
    queryApplied.current = query;
    const params = new URLSearchParams(query);
    const clinic = params.get("clinic");
    const service = params.get("service");
    if (isClinicLocationId(clinic)) setClinicLocationId(clinic);
    if (services.some((item) => item.slug === service)) setServiceSlug(service!);
    setMinimumDate(todayInWIB());
  }, [ready, query, setClinicLocationId]);

  function openWhatsApp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!clinicLocationId) return;
    const message = appointmentMessage({ clinicId: clinicLocationId, language, serviceSlug, date, time, name, notes });
    window.open(waLink(message, clinicLocationId), "_blank", "noopener,noreferrer");
  }

  return <form onSubmit={openWhatsApp} className={styles["appointment-form"]} aria-label={english ? "Prepare your appointment message" : "Siapkan pesan janji temu"}>
    <div className={styles["appointment-form-top"]}>
      <span className={styles["appointment-form-icon"]}><WhatsAppIcon width={21} height={21} /></span>
      <div><p className={styles["appointment-form-title"]}>{english ? "Let's arrange your visit" : "Mari atur kunjungan Anda"}</p><p>{english ? "Continue the conversation on WhatsApp." : "Lanjutkan percakapan melalui WhatsApp."}</p></div>
    </div>

    <fieldset className={styles["appointment-fieldset"]}>
      <legend className={styles["appointment-legend"]}><span>01</span>{english ? "Choose your clinic" : "Pilih lokasi klinik"}</legend>
      <div className={styles["clinic-options"]}>
        {clinicLocations.map((clinic) => {
          const selected = clinicLocationId === clinic.id;
          return <label key={clinic.id} className={`${styles["clinic-option"]} ${selected ? styles["clinic-option-selected"] : ""}`}>
            <input type="radio" name="clinic" value={clinic.id} checked={selected} onChange={() => setClinicLocationId(clinic.id)} required className={styles["clinic-radio"]} />
            <span className={styles["clinic-icon"]}><MapPinIcon width={19} height={19} aria-hidden="true" /></span>
            <span className={styles["clinic-copy"]}><strong>{clinic.city}</strong><span>Riau, Indonesia</span></span>
            <span className={styles["clinic-check"]} aria-hidden="true">{selected && <CheckIcon width={11} height={11} />}</span>
          </label>;
        })}
      </div>
    </fieldset>

    <fieldset className={styles["appointment-fieldset"]}>
      <legend className={styles["appointment-legend"]}><span>02</span>{english ? "Tell us a little more" : "Ceritakan kebutuhan Anda"}<small>{english ? "Optional" : "Opsional"}</small></legend>
      <div className={styles["appointment-fields"]}>
        <label className={styles["appointment-field"]}><span>{english ? "Your name" : "Nama Anda"}</span><input type="text" name="name" autoComplete="name" maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder={english ? "How should we address you?" : "Kami boleh memanggil Anda siapa?"} /></label>
        <label className={styles["appointment-field"]}><span>{english ? "Treatment" : "Layanan"}</span><select name="service" value={serviceSlug} onChange={(event) => setServiceSlug(event.target.value)}><option value="">{english ? "I'd like some guidance" : "Saya ingin konsultasi dulu"}</option>{services.map((service) => <option key={service.slug} value={service.slug}>{t(`service.${service.slug}.name`, service.name)}</option>)}</select></label>
        <label className={styles["appointment-field"]}><span>{english ? "Preferred date" : "Pilihan tanggal"}</span><input type="date" name="date" min={minimumDate || undefined} value={date} onChange={(event) => setDate(event.target.value)} aria-describedby="appointment-schedule-note" /></label>
        <label className={styles["appointment-field"]}><span>{english ? "Preferred time (WIB)" : "Pilihan jam (WIB)"}</span><input type="time" name="time" value={time} onChange={(event) => setTime(event.target.value)} aria-describedby="appointment-schedule-note" /></label>
      </div>
      <p id="appointment-schedule-note" className={styles["appointment-hint"]}>{english ? "Have a time in mind? The clinic team will confirm availability in your chat. All times are WIB (UTC+7)." : "Sudah punya waktu pilihan? Tim klinik akan mengonfirmasi ketersediaannya melalui chat. Semua jam dalam WIB (UTC+7)."}</p>
      <label className={`${styles["appointment-field"]} ${styles["appointment-note"]}`}><span>{english ? "A short note" : "Catatan singkat"}</span><textarea name="notes" rows={3} maxLength={400} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={english ? "What would you like to discuss?" : "Apa yang ingin Anda konsultasikan?"} /></label>
    </fieldset>

    <div className={styles["appointment-submit"]}>
      <button type="submit" className={`btn-primary ${styles["appointment-button"]}`}><WhatsAppIcon width={19} height={19} />{english ? "Continue to WhatsApp" : "Lanjut ke WhatsApp"}<ArrowRightIcon width={17} height={17} aria-hidden="true" /></button>
      <p>{english ? "Review your message in WhatsApp before sending. Your visit is confirmed once the clinic team agrees a time with you." : "Periksa pesan di WhatsApp sebelum mengirim. Janji temu berlaku setelah tim klinik mengonfirmasi jadwal Anda."}</p>
      <Link href="/kebijakan-privasi" className={styles["appointment-privacy"]}>{english ? "How we handle your information" : "Cara kami menjaga informasi Anda"}</Link>
    </div>
  </form>;
}
