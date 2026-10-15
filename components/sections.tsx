import Link from "next/link";
import { services, site } from "@/lib/site";
import { ArrowRightIcon, CheckIcon, ChatIcon, ClockIcon, MapPinIcon, ToothIcon } from "./icons";
import { serviceIcons } from "./service-icons";
import { T } from "./SitePreferences";
import Copy from "./LocalizedCopy";
import LocationWhatsAppLink from "./LocationWhatsAppLink";
import ClinicSelector from "./ClinicSelector";

export function WelcomeSection() {
  return <section id="welcome" className="page-shell welcome-section">
    <div className="welcome-head"><p className="eyebrow"><span className="status-dot" /><Copy id="SPESIALIS KONSERVASI GIGI" en="CONSERVATIVE DENTISTRY & ENDODONTICS" /></p><span className="section-counter">DAVA / DENTAL CARE</span></div>
    <div className="welcome-grid"><div><h1><Copy id="Senyum sehat." en="A healthy smile." /><br /><em><Copy id="Lebih percaya diri." en="A more confident you." /></em></h1><p className="welcome-doctor">{site.name}</p></div><div className="welcome-description"><p className="body-copy"><Copy id="Perawatan gigi spesialistik yang dimulai dengan mendengarkan. Kami membantu merawat dan mempertahankan gigi alami Anda melalui rencana perawatan yang jelas dan personal." en="Specialist dental care that starts by listening. We help care for and preserve your natural teeth with a clear, personal treatment plan." /></p><div className="welcome-actions"><Link href="/booking?service=konsultasi" className="btn-primary"><Copy id="Jadwalkan konsultasi" en="Book a consultation" /><ArrowRightIcon width={17} height={17} aria-hidden /></Link><Link href="/layanan" className="text-link"><Copy id="Jelajahi perawatan" en="Explore treatments" /><ArrowRightIcon width={16} height={16} aria-hidden /></Link></div><p className="welcome-location">PEKANBARU & TALUK KUANTAN · RIAU, INDONESIA</p></div></div>
  </section>;
}

export function CareStrip() {
  return <div className="care-strip"><div className="page-shell care-strip-grid">{[
    ["Perhatian personal", "Personal attention"], ["Rencana yang jelas", "A clear care plan"], ["Booking online", "Online appointments"], ["Dua lokasi di Riau", "Two locations in Riau"],
  ].map(([id, en], i) => <div key={en}><span className="care-strip-number">0{i + 1}</span><span><Copy id={id} en={en} /></span><CheckIcon width={15} height={15} aria-hidden /></div>)}</div></div>;
}

export function ServicesPreview() {
  const selected = ["konsultasi", "perawatan-saluran-akar", "tambal-gigi", "bleaching"].map(slug => services.find(s => s.slug === slug)!);
  return <section id="perawatan" className="section-space page-shell">
    <div className="section-topline"><p className="eyebrow"><Copy id="DIDESAIN UNTUK SENYUM ANDA" en="DESIGNED AROUND YOUR SMILE" /></p><span className="section-counter">01 / CARE</span></div>
    <div className="section-intro-row"><h2 className="section-heading"><Copy id="Kebutuhan berbeda." en="Different needs." /><br /><em><Copy id="Perhatian yang sama." en="The same thoughtful care." /></em></h2><div><p className="body-copy"><Copy id="Dari kontrol rutin hingga perawatan lanjutan, temukan langkah yang tepat untuk menjaga senyum Anda." en="Routine visits or a more detailed treatment plan. Find the right next step for your smile." /></p><Link href="/layanan" className="text-link mt-6"><Copy id="Lihat semua perawatan" en="View all treatments" /><ArrowRightIcon width={17} height={17} aria-hidden /></Link></div></div>
    <div className="treatment-grid">{selected.map((service, i) => {
      const Icon = serviceIcons[service.slug] ?? ToothIcon;
      return <Link href={`/layanan#${service.slug}`} key={service.slug} className={`treatment-card treatment-tone-${i}`}>
        <div className="treatment-art" aria-hidden><span className="treatment-art-circle" /><Icon width={98} height={98} strokeWidth={0.8} /><span className="treatment-art-number">0{i + 1}</span><span className="treatment-art-tag">DAVA / DENTAL CARE</span></div>
        <div className="treatment-card-copy"><p className="treatment-category"><Copy id={i === 0 ? "KONSULTASI PERSONAL" : i === 1 ? "KONSERVASI GIGI" : i === 2 ? "RESTORASI GIGI" : "ESTETIKA GIGI"} en={i === 0 ? "PERSONAL CONSULTATION" : i === 1 ? "ENDODONTIC CARE" : i === 2 ? "RESTORATIVE CARE" : "COSMETIC CARE"} /></p><h3><T id={`service.${service.slug}.name`} fallback={service.name} /><ArrowRightIcon width={20} height={20} aria-hidden /></h3><p><T id={`service.${service.slug}.short`} fallback={service.short} /></p></div>
      </Link>;
    })}</div>
    <p className="treatment-note"><Copy id="Belum tahu perawatan yang dibutuhkan? Kita mulai dari konsultasi." en="Not sure where to start? Let's begin with a consultation." /><Link href="/booking"><Copy id="Bicarakan dengan kami" en="Talk to us" /><ArrowRightIcon width={14} height={14} aria-hidden /></Link></p>
  </section>;
}

export function WhyUs() {
  return <section className="philosophy-section"><div className="page-shell philosophy-grid">
    <div className="philosophy-art"><span className="eyebrow">THE DAVA APPROACH</span><div className="philosophy-petal" aria-hidden /><div className="philosophy-petal petal-two" aria-hidden /><span className="philosophy-word">Care,<br />at <em>your</em><br />pace.</span><div className="philosophy-art-bottom"><ToothIcon width={30} height={30} aria-hidden /><span>PERSONAL CARE.<br />LASTING CONFIDENCE.</span></div></div>
    <div className="philosophy-copy"><p className="eyebrow"><Copy id="LEBIH DARI SEBUAH PERAWATAN" en="MORE THAN A DENTAL VISIT" /></p><h2 className="section-heading"><Copy id="Nyaman sejak" en="Feel at ease," /><br /><em><Copy id="percakapan pertama." en="right from hello." /></em></h2><p className="body-copy"><Copy id="Kami percaya Anda berhak memahami setiap langkah perawatan. Karena itu, kami meluangkan waktu untuk mendengar, menjelaskan, dan menyusun rencana bersama Anda." en="You deserve to understand your care. We take time to listen, explain your options, and work through a plan together." /></p>
      <div className="philosophy-values">{[
        ["Dimulai dengan mendengar", "We start by listening", "Ceritakan keluhan dan harapan Anda, tanpa perlu merasa terburu-buru.", "Tell us what's on your mind, without feeling rushed."],
        ["Pilihan yang Anda pahami", "Choices you understand", "Kenali kondisi gigi, pilihan tindakan, dan rencana sebelum perawatan dimulai.", "Understand your teeth, the treatment options, and the plan before we begin."],
      ].map(([title, en, body, bodyEn], i) => <div key={en}><span>0{i + 1}</span><div><h3><Copy id={title} en={en} /></h3><p><Copy id={body} en={bodyEn} /></p></div></div>)}</div>
      <Link className="text-link" href="/tentang"><Copy id="Kenali dokter Anda" en="Meet your specialist" /><ArrowRightIcon width={17} height={17} aria-hidden /></Link>
    </div>
  </div></section>;
}

export function PatientJourney() {
  const steps = [
    { title: "Pilih waktu Anda", en: "Make time for you", body: "Pilih klinik, perawatan, dan jadwal kunjungan melalui booking online.", bodyEn: "Choose your clinic, treatment, and appointment time online.", Icon: ClockIcon },
    { title: "Mari bercerita", en: "Let's talk", body: "Sampaikan keluhan Anda. Dokter akan memeriksa dan menjelaskan pilihan yang sesuai.", bodyEn: "Share your concerns. Your dentist will examine your teeth and explain the options.", Icon: ChatIcon },
    { title: "Rencana bersama", en: "Plan it together", body: "Pahami rencana dan estimasi biaya sebelum memutuskan perawatan.", bodyEn: "Understand the care plan and estimated cost before making a decision.", Icon: ToothIcon },
    { title: "Rawat senyum Anda", en: "Keep your smile well", body: "Dapatkan arahan perawatan di rumah dan jadwal kontrol bila diperlukan.", bodyEn: "Get home-care guidance and a follow-up appointment when needed.", Icon: CheckIcon },
  ];
  return <section className="page-shell section-space journey-section"><div className="section-topline"><p className="eyebrow"><Copy id="KUNJUNGAN ANDA" en="YOUR VISIT, EXPLAINED" /></p><span className="section-counter">02 / YOUR JOURNEY</span></div><div className="section-intro-row"><h2 className="section-heading"><Copy id="Langkah kecil." en="Small steps." /><br /><em><Copy id="Senyum yang berarti." en="A smile that matters." /></em></h2><p className="body-copy"><Copy id="Pertama kali berkunjung? Begini kami menemani perjalanan perawatan Anda." en="Your first visit? Here's how we'll guide you through your care." /></p></div><ol className="journey-grid">{steps.map(({ title, en, body, bodyEn, Icon }, i) => <li key={title}><div className="journey-step-top"><span>0{i + 1}</span><Icon width={24} height={24} aria-hidden /></div><h3><Copy id={title} en={en} /></h3><p><Copy id={body} en={bodyEn} /></p></li>)}</ol></section>;
}

export function Locations() {
  return <section className="locations-section"><div className="page-shell locations-grid"><div><p className="eyebrow"><Copy id="LEBIH DEKAT DENGAN ANDA" en="CLOSER TO YOU" /></p><h2 className="section-heading"><Copy id="Dua lokasi." en="Two locations." /><br /><em><Copy id="Satu perhatian." en="One caring approach." /></em></h2><p className="body-copy mt-5"><Copy id="Pilih lokasi yang paling nyaman bagi Anda. Pilihan klinik akan tersimpan untuk memudahkan booking kunjungan." en="Choose the location that works for you. We'll remember your choice when you book a visit." /></p><Link href="/kontak" className="text-link mt-6"><Copy id="Informasi kunjungan" en="Plan your visit" /><ArrowRightIcon width={17} height={17} aria-hidden /></Link></div><div className="location-picker-panel"><div className="flex items-center gap-3 mb-6"><MapPinIcon width={22} height={22} className="text-brand-600" aria-hidden /><span className="text-sm font-semibold"><Copy id="Temukan klinik Anda" en="Find your clinic" /></span><span className="ml-auto text-[10px] tracking-widest text-ink-soft">RIAU, ID</span></div><ClinicSelector variant="cards" /><div className="location-panel-bottom"><ClockIcon width={16} height={16} aria-hidden /><span><Copy id="Senin–Jumat 09.00–17.00 · Sabtu 09.00–14.00 WIB" en="Mon–Fri 09:00–17:00 · Sat 09:00–14:00 WIB" /></span></div></div></div></section>;
}

export function Faq() {
  const items = [
    ["Apakah saya perlu membuat janji terlebih dahulu?", "Should I book an appointment first?", "Kami menyarankan Anda membuat janji agar kunjungan lebih terencana. Pilih jadwal melalui booking online atau hubungi kami lewat WhatsApp.", "We recommend booking ahead so we can plan your visit. Choose a time online or contact us on WhatsApp."],
    ["Bagaimana jika saya belum tahu perawatan yang dibutuhkan?", "What if I don't know which treatment I need?", "Mulai dengan menghubungi kami. Dokter akan memeriksa kondisi gigi dan menjelaskan pilihan yang sesuai saat konsultasi.", "Start by getting in touch. During your consultation, the dentist will examine your teeth and explain suitable options."],
    ["Saya cemas ke dokter gigi. Apa yang bisa saya lakukan?", "I'm nervous about visiting. What can I do?", "Sampaikan kekhawatiran Anda saat membuat janji. Kami akan menjelaskan proses perawatan dan mendiskusikan cara agar Anda merasa lebih nyaman.", "Tell us about your concerns when you book. We'll explain the process and discuss how to help you feel more comfortable."],
    ["Apakah tersedia perawatan untuk anak?", "Do you offer dental care for children?", "Ya, tersedia pemeriksaan dan perawatan gigi anak. Hubungi kami untuk mendiskusikan usia dan kebutuhan anak sebelum kunjungan.", "Yes, we offer children's dental check-ups and care. Contact us to discuss your child's age and needs before the visit."],
    ["Bagaimana mengetahui biaya perawatan?", "How do I find out the cost of treatment?", "Biaya mengikuti kondisi gigi dan tindakan yang dibutuhkan. Konfirmasikan estimasi biaya dengan klinik sebelum menyetujui perawatan.", "The cost depends on your teeth and the treatment needed. Confirm your estimate with the clinic before agreeing to care."],
  ];
  return <section className="page-shell section-space faq-grid"><div><p className="eyebrow"><Copy id="SEBELUM KUNJUNGAN" en="BEFORE YOUR VISIT" /></p><h2 className="section-heading"><Copy id="Mari buat" en="Let's make" /><br /><em><Copy id="semuanya jelas." en="things clear." /></em></h2><p className="body-copy mt-5"><Copy id="Masih ada yang ingin ditanyakan? Kami siap membantu Anda mempersiapkan kunjungan." en="Have another question? We're here to help you prepare for your visit." /></p><LocationWhatsAppLink purpose="question" className="text-link mt-6"><Copy id="Tanya kepada kami" en="Ask us a question" /><ArrowRightIcon width={17} height={17} aria-hidden /></LocationWhatsAppLink></div><div className="faq-list">{items.map(([q, en, a, aEn], i) => <details key={q}><summary><span className="faq-number">0{i + 1}</span><span><Copy id={q} en={en} /></span><span className="faq-plus" aria-hidden>+</span></summary><p><Copy id={a} en={aEn} /></p></details>)}</div></section>;
}

export function CtaBand() {
  return <section className="page-shell cta-section"><div className="cta-panel"><div className="cta-orbit" aria-hidden /><p className="eyebrow"><span className="status-dot" /><Copy id="SENYUM BERIKUTNYA DIMULAI DI SINI" en="YOUR NEXT SMILE STARTS HERE" /></p><h2><Copy id="Luangkan waktu" en="Make time" /><br /><em><Copy id="untuk senyum Anda." en="for your smile." /></em></h2><p><Copy id="Mari mulai dengan percakapan dan rencana yang tepat untuk Anda." en="Let's start with a conversation and a plan that feels right for you." /></p><div className="flex flex-wrap items-center gap-5 mt-8"><Link href="/booking" className="btn-light"><Copy id="Buat janji temu" en="Book an appointment" /><ArrowRightIcon width={18} height={18} aria-hidden /></Link><LocationWhatsAppLink className="text-link cta-chat"><Copy id="Hubungi via WhatsApp" en="Chat on WhatsApp" /><ArrowRightIcon width={16} height={16} aria-hidden /></LocationWhatsAppLink></div><span className="cta-brand" aria-hidden>d.</span></div></section>;
}
