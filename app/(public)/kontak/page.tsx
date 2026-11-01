import type { Metadata } from "next";
import Link from "next/link";
import { clinicLocations } from "@/lib/site";
import { ArrowRightIcon, MapPinIcon } from "@/components/icons";
import Copy from "@/components/LocalizedCopy";
import styles from "../public-pages.module.css";

export const metadata: Metadata = {
  title: "Kontak & Lokasi",
  description: "Pilih praktik di Pekanbaru atau Taluk Kuantan. Konfirmasikan alamat, jadwal dokter, dan janji kunjungan melalui WhatsApp.",
};

export default function KontakPage() {
  return <div className="page-shell pb-20 sm:pb-28">
    <header className="page-intro">
      <p className="eyebrow"><Copy id="Lokasi & kontak" en="Locations & contact" /></p>
      <div className={styles.introGrid}>
        <h1 className="display-title"><Copy id="Pilih lokasi yang dekat dengan Anda." en="Choose a location near you." /></h1>
        <p className="body-copy"><Copy id="Temui kami di Pekanbaru atau Taluk Kuantan. Mulai lewat WhatsApp untuk menanyakan jadwal dan merencanakan kedatangan Anda." en="Visit us in Pekanbaru or Taluk Kuantan. Start on WhatsApp to ask about the schedule and plan your visit." /></p>
      </div>
    </header>

    <div className={styles.locationGrid}>
      {clinicLocations.map((location, index) => <section key={location.id} id={location.id} className={styles.locationCard} aria-labelledby={`location-${location.id}`}>
        <div className={styles.locationTop}><span className={styles.rowNumber}>0{index + 1} / <Copy id="Lokasi praktik" en="Practice location" /></span><MapPinIcon width={24} height={24} strokeWidth={1.3} aria-hidden="true" /></div>
        <h2 id={`location-${location.id}`}>{location.city}</h2>
        <p className={styles.locationRegion}>{location.region}, Indonesia</p>
        <dl className={styles.locationDetails}>
          <div><dt><Copy id="Alamat" en="Address" /></dt><dd><Copy id="Alamat lengkap dan petunjuk kedatangan dikonfirmasi melalui WhatsApp." en="The full address and arrival directions will be confirmed through WhatsApp." /></dd></div>
          <div><dt><Copy id="Jam praktik" en="Practice hours" /></dt><dd><Copy id="Tanyakan jadwal dokter di lokasi ini sebelum berkunjung." en="Ask about the dentist’s schedule at this location before visiting." /></dd></div>
        </dl>
        <Link href={`/booking?clinic=${location.id}`} className={styles.locationLink}><Copy id={`Buat janji di ${location.city}`} en={`Arrange a visit in ${location.city}`} /><ArrowRightIcon width={20} height={20} aria-hidden="true" /></Link>
      </section>)}
    </div>

    <section className={styles.visitNote}>
      <div><p className="eyebrow"><Copy id="Sebelum datang" en="Before your visit" /></p><h2 className="mt-3"><Copy id="Pastikan jadwal Anda sudah dikonfirmasi." en="Make sure your appointment is confirmed." /></h2></div>
      <p><Copy id="Pilih lokasi, sampaikan kebutuhan perawatan, dan usulkan tanggal kunjungan. Tim klinik akan membantu mengonfirmasi jadwal melalui percakapan WhatsApp. Mengisi rencana kunjungan di situs belum berarti janji telah terdaftar." en="Choose a location, share your treatment needs, and suggest a visit date. The clinic team will help confirm the schedule in your WhatsApp conversation. Preparing a visit request on this site does not reserve an appointment." /></p>
    </section>

    <section className={styles.callout}>
      <div><h2 className="section-heading"><Copy id="Ingin mengenal perawatannya dahulu?" en="Want to explore the treatments first?" /></h2><p><Copy id="Lihat pilihan konsultasi dan perawatan sebelum menyampaikan kebutuhan Anda." en="Explore the consultation and treatment options before telling us what you need." /></p></div>
      <Link href="/layanan" className="btn-secondary"><Copy id="Lihat layanan" en="View treatments" /><ArrowRightIcon width={18} height={18} aria-hidden="true" /></Link>
    </section>
  </div>;
}
