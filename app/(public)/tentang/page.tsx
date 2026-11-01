import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { ArrowRightIcon, ToothIcon } from "@/components/icons";
import Copy from "@/components/LocalizedCopy";
import styles from "../public-pages.module.css";

export const metadata: Metadata = {
  title: "Tentang Dokter",
  description: `Kenali ${site.name}, ${site.specialty.toLowerCase()}, serta alur konsultasi dan perawatan di Pekanbaru dan Taluk Kuantan.`,
};

const steps = [
  { title: "Ceritakan keluhan", titleEn: "Tell us your concern", body: "Apa yang terasa berbeda? Sampaikan keluhan, pengalaman perawatan, dan hal yang ingin Anda tanyakan.", bodyEn: "What feels different? Share your symptoms, previous dental experiences, and anything you’d like to ask." },
  { title: "Pahami hasil pemeriksaan", titleEn: "Understand the findings", body: "Dokter memeriksa kondisi gigi dan gusi, lalu menjelaskan temuan yang berkaitan dengan keluhan Anda.", bodyEn: "Your dentist examines your teeth and gums, then explains the findings related to your concern." },
  { title: "Bahas rencana perawatan", titleEn: "Discuss your care plan", body: "Kenali pilihan, tahapan, serta perkiraan biaya sebelum menyepakati tindakan yang akan dilakukan.", bodyEn: "Discuss the options, steps, and estimated costs before agreeing on treatment." },
  { title: "Lanjutkan di rumah", titleEn: "Continue care at home", body: "Ikuti arahan setelah perawatan dan bicarakan kebutuhan kunjungan kontrol bersama dokter.", bodyEn: "Follow the advice after treatment and discuss whether a follow-up visit is needed." },
];

export default function TentangPage() {
  const [doctorName, qualification] = site.name.split(", ");

  return <div className="page-shell pb-20 sm:pb-28">
    <header className={styles.doctorIntro}>
      <p className="eyebrow"><Copy id="Tentang dokter" en="Meet your dentist" /></p>
      <h1 className={styles.doctorName} aria-label={site.name}>
        <span>{doctorName}</span>{" "}<span className={styles.doctorQualification}>{qualification}</span>
      </h1>
      <div className={styles.doctorIntroBottom}>
        <div className={styles.doctorIdentity}>
          <p><Copy id={site.specialty} en={site.specialtyEn} /></p>
          <p>Pekanbaru &amp; Taluk Kuantan, Riau</p>
        </div>
        <Link href="/booking?service=konsultasi" className="btn-secondary"><Copy id="Konsultasi dengan dokter" en="Arrange a consultation" /><ArrowRightIcon width={18} height={18} aria-hidden="true" /></Link>
      </div>
    </header>

    <section className={styles.doctorLayout}>
      <div className={styles.doctorArt} aria-hidden="true">
        <p className={styles.artLabel}>Dava Dental Care</p>
        <span className={styles.monogram}>D.</span>
        <div className={styles.artFooter}><span><Copy id="Mengenal gigi, merencanakan perawatan." en="Understanding teeth, planning your care." /></span><ToothIcon width={32} height={32} strokeWidth={1.2} /></div>
      </div>
      <div className={styles.doctorCopy}>
        <span className="eyebrow"><Copy id="Konservasi gigi" en="Conservative dentistry" /></span>
        <h2 className="section-heading mt-4"><Copy id="Memahami kondisi gigi sebelum menentukan langkah." en="Understand your teeth before deciding what’s next." /></h2>
        <p><Copy id="Konservasi gigi berfokus pada perawatan dan pemulihan gigi, termasuk restorasi serta perawatan saluran akar. Pemeriksaan menjadi dasar untuk menilai gigi yang masih dapat dipertahankan dan pilihan penanganannya." en="Conservative dentistry focuses on treating and restoring teeth, including restorations and root canal treatment. An examination helps assess which teeth can be preserved and the available treatment options." /></p>
        <p><Copy id="Saat berkonsultasi, Anda dapat membahas keluhan, menanyakan tahapan perawatan, dan menyampaikan kekhawatiran. Rencana perawatan mengikuti kondisi gigi serta kebutuhan Anda." en="During your consultation, you can discuss your concerns, ask about treatment steps, and share any worries. Your care plan follows the condition of your teeth and your needs." /></p>
        <div className={styles.specialty}><ToothIcon width={21} height={21} aria-hidden="true" /><span><Copy id="Konsultasi tersedia untuk lokasi Pekanbaru dan Taluk Kuantan. Konfirmasikan jadwal dokter melalui WhatsApp." en="Consultations are available for Pekanbaru and Taluk Kuantan. Confirm the dentist’s schedule through WhatsApp." /></span></div>
        <Link href="/booking?service=konsultasi" className="btn-primary"><Copy id="Buat janji konsultasi" en="Arrange a consultation" /><ArrowRightIcon width={18} height={18} aria-hidden="true" /></Link>
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.sectionIntro}>
        <div><p className="eyebrow"><Copy id="Saat Anda berkunjung" en="During your visit" /></p><h2 className="section-heading mt-3"><Copy id="Ada ruang untuk bertanya." en="There’s room for your questions." /></h2></div>
        <p className="body-copy"><Copy id="Kunjungan pertama membantu Anda dan dokter menyusun langkah yang sesuai. Berikut gambaran prosesnya." en="Your first visit helps you and your dentist plan the next steps. Here’s an outline of the process." /></p>
      </div>
      <div className={styles.steps}>{steps.map((step, index) => <article key={step.titleEn} className={styles.step}><p className={styles.rowNumber}>0{index + 1}</p><h3><Copy id={step.title} en={step.titleEn} /></h3><p><Copy id={step.body} en={step.bodyEn} /></p></article>)}</div>
    </section>
  </div>;
}
