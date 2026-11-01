import type { Metadata } from "next";
import Link from "next/link";
import Copy from "@/components/LocalizedCopy";
import { ArrowRightIcon } from "@/components/icons";
import { T } from "@/components/SitePreferences";
import { services } from "@/lib/site";
import styles from "../public-pages.module.css";

export const metadata: Metadata = {
  title: "Layanan Perawatan",
  description: "Pilihan konsultasi dan perawatan gigi di Pekanbaru dan Taluk Kuantan. Diskusikan kebutuhan dan jadwal kunjungan melalui WhatsApp.",
};

const treatments = [
  { slug: "konsultasi", category: "Pemeriksaan", categoryEn: "Examination", body: "Mulai dengan menceritakan keluhan Anda. Pemeriksaan membantu dokter menjelaskan kondisi gigi, pilihan perawatan, dan langkah berikutnya.", bodyEn: "Start by telling us what’s bothering you. An examination helps your dentist explain your dental condition, treatment options, and next steps." },
  { slug: "scaling", category: "Perawatan rutin", categoryEn: "Routine care", body: "Pembersihan karang gigi dan pemeriksaan gusi. Sampaikan bila gusi mudah berdarah atau Anda punya pertanyaan tentang perawatan sehari-hari.", bodyEn: "Tartar removal and a gum examination. Let your dentist know if your gums bleed easily or you have questions about daily care." },
  { slug: "tambal-gigi", category: "Restorasi", categoryEn: "Restorative care", body: "Perawatan untuk memperbaiki bagian gigi yang berlubang atau rusak. Dokter akan menjelaskan bahan dan rencana perawatan sesuai hasil pemeriksaan.", bodyEn: "Care to restore decayed or damaged parts of a tooth. Your dentist will explain the materials and treatment plan after examining your teeth." },
  { slug: "perawatan-saluran-akar", category: "Konservasi gigi", categoryEn: "Conservative dentistry", body: "Perawatan pada bagian dalam gigi untuk membantu mempertahankan gigi yang masih dapat dirawat. Tahapan dan jumlah kunjungan mengikuti kondisi masing-masing gigi.", bodyEn: "Treatment inside a tooth to help preserve a tooth that can still be treated. The steps and number of visits depend on its condition." },
  { slug: "bleaching", category: "Estetika gigi", categoryEn: "Dental aesthetics", body: "Konsultasikan perubahan warna gigi dan hasil yang Anda harapkan. Pemeriksaan lebih dahulu membantu menentukan apakah pemutihan sesuai untuk Anda.", bodyEn: "Discuss changes in tooth colour and the result you’re hoping for. An examination comes first to determine whether whitening is suitable for you." },
  { slug: "gigi-anak", category: "Kesehatan gigi anak", categoryEn: "Children’s dental health", body: "Pemeriksaan gigi anak, perawatan sesuai kebutuhan, serta panduan untuk orang tua. Ceritakan pengalaman kunjungan sebelumnya agar dokter dapat menyesuaikan pendekatan.", bodyEn: "Children’s examinations, care as needed, and guidance for parents. Share any previous dental experiences so the dentist can adapt the visit." },
  { slug: "cabut-gigi", category: "Tindakan gigi", categoryEn: "Dental procedures", body: "Dokter menilai kondisi gigi dan membahas pilihan sebelum menentukan pencabutan. Penjelasan mencakup persiapan serta perawatan setelah tindakan.", bodyEn: "Your dentist assesses the tooth and discusses the options before deciding on extraction. You’ll receive information about preparation and care after the procedure." },
  { slug: "odontektomi", category: "Gigi bungsu", categoryEn: "Wisdom teeth", body: "Konsultasi untuk gigi bungsu yang membutuhkan penanganan lebih lanjut. Dokter menilai kebutuhan pemeriksaan penunjang dan menjelaskan rencana tindakan atau rujukan.", bodyEn: "A consultation for wisdom teeth that need further attention. Your dentist assesses the need for additional examinations and explains the treatment or referral plan." },
];

export default function LayananPage() {
  return <div className="page-shell pb-20 sm:pb-28">
    <header className={styles.treatmentIntro}>
      <p className="eyebrow"><Copy id="Layanan perawatan" en="Our treatments" /></p>
      <div className={styles.treatmentIntroGrid}>
        <h1 className={styles.treatmentTitle}><span><Copy id="Perawatan gigi," en="Dental care," /></span><span><Copy id="sesuai kebutuhan." en="for your needs." /></span></h1>
        <div className={styles.treatmentIntroCopy}>
          <p><Copy id="Mulai dari pemeriksaan, temukan perawatan yang sesuai dengan kondisi gigi Anda. Kami membantu menjelaskan pilihan dan langkah selanjutnya." en="Start with an examination to find care that suits your teeth. We’ll help explain your options and the next steps." /></p>
          <Link href="/booking?service=konsultasi" className="btn-secondary"><Copy id="Mulai dengan konsultasi" en="Start with a consultation" /><ArrowRightIcon width={18} height={18} aria-hidden="true" /></Link>
        </div>
      </div>
    </header>

    <nav className={styles.indexNav} aria-label="Layanan / Treatments">
      {treatments.map((item, index) => <a key={item.slug} href={`#${item.slug}`}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><T id={`service.${item.slug}.name`} fallback={services.find(service => service.slug === item.slug)!.name} /></a>)}
    </nav>

    <div className={styles.serviceList}>
      {treatments.map((item, index) => <article key={item.slug} id={item.slug} className={styles.serviceRow}>
        <span className={styles.rowNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <div><h2><T id={`service.${item.slug}.name`} fallback={services.find(service => service.slug === item.slug)!.name} /></h2><p className={styles.serviceCategory}><Copy id={item.category} en={item.categoryEn} /></p></div>
        <div className={styles.serviceDetails}><p><Copy id={item.body} en={item.bodyEn} /></p><Link href={`/booking?service=${item.slug}`}><Copy id="Buat janji untuk layanan ini" en="Arrange a visit for this treatment" /><ArrowRightIcon width={18} height={18} aria-hidden="true" /></Link></div>
      </article>)}
    </div>

    <section className={styles.callout}>
      <div><p className="eyebrow"><Copy id="Konsultasi pertama" en="Your first consultation" /></p><h2 className="section-heading mt-3"><Copy id="Belum tahu perawatan yang dibutuhkan?" en="Unsure which treatment you need?" /></h2><p><Copy id="Pilih konsultasi dan ceritakan keluhan Anda. Jadwal, biaya, serta ketersediaan layanan di lokasi pilihan akan dikonfirmasi melalui WhatsApp." en="Choose a consultation and tell us about your concern. The schedule, fees, and treatment availability at your chosen location will be confirmed through WhatsApp." /></p></div>
      <Link href="/booking?service=konsultasi" className="btn-primary"><Copy id="Jadwalkan konsultasi" en="Arrange a consultation" /><ArrowRightIcon width={18} height={18} aria-hidden="true" /></Link>
    </section>
  </div>;
}
