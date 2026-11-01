import type { Metadata } from "next";
import { Suspense } from "react";
import BookingForm from "@/components/booking/BookingForm";
import Copy from "@/components/LocalizedCopy";
import { ToothIcon } from "@/components/icons";
import { site } from "@/lib/site";
import styles from "@/components/booking/Booking.module.css";

export const metadata: Metadata = {
  title: "Buat Janji Temu",
  description: "Pilih praktik Pekanbaru atau Taluk Kuantan, ceritakan kebutuhan Anda, lalu atur janji temu melalui WhatsApp. Tim klinik akan membantu mengonfirmasi jadwal.",
};

export default function BookingPage() {
  return <div className={`page-shell ${styles["appointment-layout"]}`}>
    <div className={styles["appointment-intro"]}>
      <div className="eyebrow"><Copy id="JANJI TEMU" en="YOUR APPOINTMENT" /></div>
      <h1><Copy id="Kunjungan Anda," en="Your visit," /><br /><span><Copy id="dimulai di sini." en="starts here." /></span></h1>
      <p><Copy id="Pilih lokasi praktik, lalu ceritakan kebutuhan Anda. Kami akan membantu mengatur waktu kunjungan melalui WhatsApp." en="Choose a practice and tell us what you need. We'll help arrange a time for your visit on WhatsApp." /></p>
      <ol className={styles["appointment-process"]}>
        <li><span>01</span><div><strong><Copy id="Pilih praktik terdekat" en="Choose your practice" /></strong><p><Copy id="Pekanbaru atau Taluk Kuantan, sesuai rencana kunjungan Anda." en="Pekanbaru or Taluk Kuantan, whichever suits your visit." /></p></div></li>
        <li><span>02</span><div><strong><Copy id="Lanjutkan lewat percakapan" en="Continue with a conversation" /></strong><p><Copy id="Pesan Anda siap dibuka di WhatsApp. Tim klinik akan membantu menjawab pertanyaan dan mengonfirmasi jadwal." en="Your message is ready to open in WhatsApp. The clinic team will answer your questions and confirm a time." /></p></div></li>
      </ol>
      <div className={styles["appointment-doctor"]}><span><ToothIcon width={20} height={20} aria-hidden="true" /></span><div><strong>{site.name}</strong><p><Copy id="Spesialis Konservasi Gigi" en="Conservative Dentistry & Endodontics" /></p></div></div>
    </div>
    <Suspense fallback={<div className={styles["appointment-form"]}><Copy id="Menyiapkan formulir janji temu…" en="Loading your appointment form…" /></div>}><BookingForm /></Suspense>
  </div>;
}
