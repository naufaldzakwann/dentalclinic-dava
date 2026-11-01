import type { Metadata } from "next";
import Link from "next/link";
import Copy from "@/components/LocalizedCopy";
import { ArrowRightIcon } from "@/components/icons";
import styles from "../public-pages.module.css";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Penjelasan penggunaan data pada perencana kunjungan WhatsApp, preferensi situs, serta cara menghubungi praktik tentang data Anda.",
};

const sections = [
  { id: "rencana-kunjungan", title: "Rencana kunjungan di situs", en: "Planning a visit on this site", paragraphs: [
    { id: "Halaman buat janji membantu Anda menyusun pesan WhatsApp. Informasi yang Anda isi tetap berada di halaman selama proses ini; perencana kunjungan publik tidak menyimpan atau mengirimkan data pasien ke server klinik.", en: "The appointment page helps you compose a WhatsApp message. The information you enter stays on the page during this process; the public visit planner does not save or submit patient information to the clinic’s server." },
    { id: "Tinjau pesan sebelum mengirimkannya. Membuka WhatsApp belum mengirimkan pesan atau memastikan jadwal kunjungan. Hindari memasukkan informasi kesehatan yang tidak diperlukan untuk mengatur janji.", en: "Review the message before sending it. Opening WhatsApp does not send the message or confirm an appointment. Avoid including health information that is not needed to arrange your visit." },
  ] },
  { id: "whatsapp", title: "Percakapan melalui WhatsApp", en: "Conversations on WhatsApp", paragraphs: [
    { id: "Ketika Anda melanjutkan ke WhatsApp, layanan eksternal tersebut menangani percakapan sesuai kebijakan privasinya. Tim klinik menerima pesan setelah Anda menekan kirim di WhatsApp dan menggunakannya untuk menanggapi pertanyaan serta mengatur kunjungan.", en: "When you continue to WhatsApp, that external service handles the conversation under its own privacy policy. The clinic team receives your message after you press send in WhatsApp and uses it to answer your questions and arrange your visit." },
  ] },
  { id: "preferensi", title: "Preferensi pada perangkat Anda", en: "Preferences on your device", paragraphs: [
    { id: "Situs menyimpan pilihan bahasa, tema tampilan, dan lokasi klinik dalam penyimpanan lokal browser (localStorage). Ini membantu menjaga pilihan Anda saat membuka halaman lain atau kembali berkunjung.", en: "The site saves your language, display theme, and clinic location in your browser’s local storage (localStorage). This keeps your choices when you open another page or return to the site." },
    { id: "Anda dapat mengubah pilihan tersebut melalui kontrol situs, atau menghapusnya dengan membersihkan data situs pada pengaturan browser.", en: "You can change these choices using the site controls, or remove them by clearing this site’s data in your browser settings." },
  ] },
  { id: "catatan-klinik", title: "Catatan dan administrasi klinik", en: "Clinic records and administration", paragraphs: [
    { id: "Penjelasan tentang perencana kunjungan publik di atas berlaku untuk alur WhatsApp saat ini. Catatan janji dari sistem sebelumnya dan data administrasi klinik dapat tetap tersimpan secara terpisah. Pesan yang Anda kirim lewat WhatsApp juga merupakan bagian dari percakapan dengan klinik.", en: "The explanation of the public visit planner above applies to the current WhatsApp flow. Appointment records from the earlier system and clinic administration data may remain stored separately. Messages you send on WhatsApp also form part of your conversation with the clinic." },
    { id: "Untuk mengetahui data yang berkaitan dengan Anda, atau meminta koreksi maupun penghapusan, hubungi tim pada lokasi praktik yang bersangkutan. Tim akan meninjau permintaan sesuai jenis catatan dan kewajiban yang berlaku.", en: "To ask about information relating to you, or request a correction or deletion, contact the team at the relevant practice location. The team will review your request according to the type of record and applicable obligations." },
  ] },
];

export default function PrivacyPage() {
  return <div className="page-shell pb-20 sm:pb-28">
    <header className="page-intro">
      <p className="eyebrow"><Copy id="Informasi situs" en="Site information" /></p>
      <h1 className="display-title mt-5"><Copy id="Kebijakan privasi." en="Privacy policy." /></h1>
      <p className={styles.introNote}><Copy id="Diperbarui 1 November 2026" en="Updated 1 November 2026" /></p>
    </header>

    <div className={styles.privacyLayout}>
      <aside className={styles.privacyNav}>
        <p><Copy id="Dalam halaman ini" en="On this page" /></p>
        <nav aria-label="Isi kebijakan privasi / Privacy policy contents">{sections.map((section, index) => <a key={section.id} href={`#${section.id}`}><span aria-hidden="true">0{index + 1}</span><span><Copy id={section.title} en={section.en} /></span></a>)}</nav>
      </aside>
      <div className={styles.privacyContent}>
        <p className={styles.privacyLead}><Copy id="Kami ingin Anda memahami apa yang terjadi pada informasi saat merencanakan kunjungan melalui situs ini." en="We want you to understand what happens to your information when you plan a visit through this site." /></p>
        {sections.map(section => <section key={section.id} id={section.id} className={styles.privacySection}><h2><Copy id={section.title} en={section.en} /></h2>{section.paragraphs.map(paragraph => <p key={paragraph.en}><Copy id={paragraph.id} en={paragraph.en} /></p>)}</section>)}
        <section className={styles.privacySection}>
          <h2><Copy id="Pertanyaan tentang data Anda" en="Questions about your information" /></h2>
          <p><Copy id="Pilih lokasi praktik untuk menghubungi tim yang menangani kunjungan Anda. Sebutkan bahwa pertanyaan Anda berkaitan dengan data pribadi agar percakapan dapat diarahkan dengan tepat." en="Choose the practice location to contact the team handling your visit. Mention that your question concerns personal information so the conversation can be directed appropriately." /></p>
          <Link href="/kontak"><Copy id="Lihat lokasi & kontak" en="View locations & contact" /><ArrowRightIcon width={18} height={18} aria-hidden="true" /></Link>
        </section>
      </div>
    </div>
  </div>;
}
