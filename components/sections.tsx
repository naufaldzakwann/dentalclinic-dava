import Image from "next/image";
import Link from "next/link";
import { clinicLocations, services, site } from "@/lib/site";
import { ArrowRightIcon, ChatIcon, CheckIcon, MapPinIcon, SmileIcon, ToothIcon } from "./icons";
import { serviceIcons } from "./service-icons";
import { T } from "./SitePreferences";
import Copy from "./LocalizedCopy";
import styles from "./HomeSections.module.css";

const Arrow = () => <ArrowRightIcon width={19} height={19} aria-hidden="true" />;

export function WelcomeSection() {
  return <section id="welcome" className={`${styles.welcome} page-shell`}>
    <div className={styles.welcomeCopy}>
      <p className="eyebrow"><span className={styles.dot} />DAVA DENTAL CARE · RIAU</p>
      <h1><Copy id="Senyum Anda." en="Your smile." /><br /><span><Copy id="Perhatian kami." en="Our attention." /></span></h1>
      <p className={styles.intro}><Copy id="Perawatan gigi yang dimulai dengan mendengarkan. Pahami kebutuhan Anda, kenali pilihannya, lalu rencanakan kunjungan dengan tenang." en="Dental care that starts by listening. Understand your needs, explore your options, and plan a visit at your own pace." /></p>
      <div className={styles.actions}>
        <Link href="/booking" className="btn-primary"><ChatIcon width={19} height={19} aria-hidden="true" /><Copy id="Janji temu via WhatsApp" en="Arrange a visit on WhatsApp" /><Arrow /></Link>
        <Link href="#perawatan" className="text-link"><Copy id="Jelajahi perawatan" en="Explore treatments" /><Arrow /></Link>
      </div>
      <div className={styles.doctorSignature}>
        <span className={styles.doctorMark}><ToothIcon width={25} height={25} aria-hidden="true" /></span>
        <div><p>{site.name}</p><span><Copy id="Spesialis Konservasi Gigi" en="Conservative Dentistry & Endodontics" /></span></div>
      </div>
    </div>
    <figure className={styles.welcomeVisual}>
      <Image src="/images/care-editorial.webp" alt="" fill sizes="(max-width: 760px) 100vw, 43vw" className={styles.editorialImage} />
      <div className={styles.imageNote}><SmileIcon className={styles.smallSpark} strokeWidth={1.1} aria-hidden="true" /><span><Copy id="Sedikit perhatian." en="A little care." /><br /><strong><Copy id="Setiap hari." en="Every day." /></strong></span></div>
      <figcaption><Copy id="Ilustrasi editorial" en="Editorial illustration" /></figcaption>
    </figure>
  </section>;
}

export function CareStrip() {
  return <div className={`${styles.careStrip} page-shell`}>
    <span><Copy id="PERAWATAN YANG LEBIH PERSONAL" en="A MORE PERSONAL APPROACH TO CARE" /></span>
    <p><CheckIcon width={16} height={16} aria-hidden="true" /><Copy id="Spesialis konservasi gigi" en="Specialist dental care" /></p>
    <p><MapPinIcon width={16} height={16} aria-hidden="true" /><Copy id="Dua lokasi di Riau" en="Two locations in Riau" /></p>
    <p><ChatIcon width={16} height={16} aria-hidden="true" /><Copy id="Janji temu lewat WhatsApp" en="Appointments on WhatsApp" /></p>
  </div>;
}

export function Locations() {
  return <section id="klinik" className={styles.locations}>
    <div className="page-shell">
      <div className={styles.sectionHeader}><div><p className="eyebrow"><Copy id="01 / TEMUKAN KAMI" en="01 / FIND US" /></p><h2 className="section-heading"><Copy id="Dua klinik," en="Two clinics," /><br /><span><Copy id="dekat dengan Anda." en="closer to you." /></span></h2></div><p className="body-copy"><Copy id="Pilih lokasi yang paling nyaman. Tim klinik akan membantu menyesuaikan jadwal kunjungan Anda melalui WhatsApp." en="Choose the location that works for you. The clinic team will help arrange your appointment through WhatsApp." /></p></div>
      <div className={styles.clinicGrid}>
        {clinicLocations.map((clinic, index) => <article className={styles.clinicCard} key={clinic.id}>
          <div className={styles.clinicTop}><span><span className={styles.dot} /><Copy id="LOKASI PRAKTIK" en="PRACTICE LOCATION" /></span><span>0{index + 1}</span></div>
          <div className={styles.clinicBody}><div><p>RIAU, INDONESIA</p><h3>{clinic.city}</h3><span><Copy id="Kunjungan dengan janji temu" en="Visits by appointment" /></span></div><MapPinIcon width={46} height={46} strokeWidth={.9} aria-hidden="true" /></div>
          <div className={styles.clinicBottom}><Link href={`/booking?clinic=${clinic.id}`} className={styles.clinicAction}><Copy id="Buat janji di sini" en="Arrange a visit here" /><Arrow /></Link><Link href={`/kontak#${clinic.id}`} className={styles.clinicInfo}><Copy id="Info lokasi" en="Location details" /></Link></div>
        </article>)}
      </div>
      <p className={styles.locationNote}><ChatIcon width={15} height={15} aria-hidden="true" /><Copy id="Alamat lengkap dan jadwal praktik dapat Anda konfirmasikan saat menghubungi klinik." en="Confirm the full address and practice schedule when you contact the clinic." /></p>
    </div>
  </section>;
}

export function ServicesPreview() {
  const featured = ["konsultasi", "perawatan-saluran-akar", "tambal-gigi", "scaling"].map(slug => services.find(service => service.slug === slug)!);
  return <section id="perawatan" className={`${styles.services} page-shell`}>
    <div className={styles.servicesIntro}><p className="eyebrow"><Copy id="02 / PERAWATAN" en="02 / TREATMENTS" /></p><h2 className="section-heading"><Copy id="Untuk gigi yang" en="Care for the teeth" /><br /><span><Copy id="ingin Anda jaga." en="you want to keep." /></span></h2><p className="body-copy"><Copy id="Setiap gigi punya cerita. Kami membantu Anda memahami kondisinya dan menentukan perawatan yang sesuai." en="Every tooth has a story. We help you understand its condition and find a suitable approach to care." /></p><Link href="/layanan" className="btn-secondary"><Copy id="Semua perawatan" en="All treatments" /><Arrow /></Link><div className={styles.serviceAside}><ToothIcon width={30} height={30} strokeWidth={1.1} aria-hidden="true" /><p><Copy id="Belum tahu harus mulai dari mana?" en="Not sure where to begin?" /><Link href="/booking?service=konsultasi"><Copy id="Mulai dari konsultasi." en="Start with a consultation." /></Link></p></div></div>
    <div className={styles.serviceList}>
      {featured.map((service, index) => {
        const Icon = serviceIcons[service.slug] ?? ToothIcon;
        return <Link href={`/layanan#${service.slug}`} key={service.slug} className={styles.serviceRow}><span className={styles.serviceNumber}>0{index + 1}</span><span className={styles.serviceIcon}><Icon width={32} height={32} strokeWidth={1.1} aria-hidden="true" /></span><span className={styles.serviceText}><h3><T id={`service.${service.slug}.name`} fallback={service.name} /></h3><p><T id={`service.${service.slug}.short`} fallback={service.short} /></p></span><span className={styles.roundArrow}><Arrow /></span></Link>;
      })}
    </div>
  </section>;
}

export function WhyUs() {
  return <section className={`${styles.approach} page-shell`}>
    <div className={styles.approachVisual}>
      <div className={styles.approachTop}><span>DAVA / DENTAL CARE</span><ToothIcon width={31} height={31} strokeWidth={1.1} aria-hidden="true" /></div>
      <p className={styles.approachStatement}><Copy id="Anda bercerita." en="You talk." /><br /><span><Copy id="Kami mendengar." en="We listen." /></span></p>
      <div className={styles.approachLines} aria-hidden="true"><i /><i /><i /><i /></div>
      <div className={styles.approachDoctor}><p>{site.name}</p><span><Copy id="Spesialis Konservasi Gigi" en="Conservative Dentistry & Endodontics" /></span></div>
    </div>
    <div className={styles.approachCopy}><p className="eyebrow"><Copy id="03 / KENALI PENDEKATAN KAMI" en="03 / OUR APPROACH" /></p><h2 className="section-heading"><Copy id="Ruang untuk bertanya." en="Room for questions." /><br /><span><Copy id="Waktu untuk memahami." en="Time to understand." /></span></h2><p className="body-copy"><Copy id="Kunjungan ke dokter gigi boleh dimulai dengan banyak pertanyaan. Sampaikan keluhan dan kekhawatiran Anda, lalu bicarakan pilihan perawatan bersama dokter." en="A dental visit can start with plenty of questions. Share your concerns, then discuss your treatment options with your dentist." /></p>
      <div className={styles.approachPoints}><div><span>01</span><p><strong><Copy id="Pemeriksaan lebih dulu" en="An examination first" /></strong><Copy id="Kenali kondisi gigi sebelum menentukan tindakan." en="Understand your teeth before deciding on treatment." /></p></div><div><span>02</span><p><strong><Copy id="Keputusan bersama" en="A shared decision" /></strong><Copy id="Pahami rencana dan estimasi biaya sebelum memulai." en="Discuss the plan and estimated cost before you begin." /></p></div></div>
      <Link href="/tentang" className="text-link"><Copy id="Kenali drg. Dava" en="Meet drg. Dava" /><Arrow /></Link>
    </div>
  </section>;
}

export function PatientJourney() {
  const steps = [
    { title: "Pilih klinik Anda", en: "Choose your clinic", body: "Pekanbaru atau Taluk Kuantan. Tentukan lokasi yang paling nyaman untuk Anda.", bodyEn: "Pekanbaru or Taluk Kuantan. Pick the location that works best for you.", Icon: MapPinIcon },
    { title: "Mulai percakapan", en: "Start a conversation", body: "Buka WhatsApp dengan pesan yang sudah disiapkan. Tambahkan kebutuhan dan waktu pilihan Anda.", bodyEn: "Open WhatsApp with a prepared message. Add your needs and preferred time.", Icon: ChatIcon },
    { title: "Konfirmasi, lalu berkunjung", en: "Confirm, then visit", body: "Tim klinik membantu memastikan jadwal. Janji temu berlaku setelah Anda menerima konfirmasi.", bodyEn: "The clinic team helps confirm your schedule. Your appointment is set once you receive confirmation.", Icon: CheckIcon },
  ];
  return <section className={styles.journey}><div className="page-shell"><div className={styles.sectionHeader}><div><p className="eyebrow"><Copy id="04 / JANJI TEMU" en="04 / YOUR APPOINTMENT" /></p><h2 className="section-heading"><Copy id="Cukup mulai" en="It starts with" /><br /><span><Copy id="dengan satu pesan." en="a single message." /></span></h2></div><Link href="/booking" className="btn-primary"><Copy id="Rencanakan kunjungan" en="Plan your visit" /><Arrow /></Link></div><ol className={styles.journeySteps}>{steps.map(({ title, en, body, bodyEn, Icon }, i) => <li key={title}><div className={styles.stepTop}><span>0{i + 1}</span><Icon width={25} height={25} strokeWidth={1.3} aria-hidden="true" /></div><h3><Copy id={title} en={en} /></h3><p><Copy id={body} en={bodyEn} /></p></li>)}</ol></div></section>;
}

export function Faq() {
  const items = [
    ["Bagaimana cara membuat janji temu?", "How do I arrange an appointment?", "Pilih klinik, lalu buka WhatsApp melalui tombol janji temu. Pesan awal sudah disiapkan. Tim klinik akan membantu menentukan dan mengonfirmasi jadwal Anda melalui chat.", "Choose a clinic, then open WhatsApp using the appointment button. A first message is prepared for you. The clinic team will help arrange and confirm your schedule in the chat."],
    ["Apakah jadwal langsung terpesan?", "Is my appointment booked immediately?", "Belum. Tanggal dan waktu yang Anda tulis adalah pilihan kunjungan. Jadwal baru disepakati setelah tim klinik memberikan konfirmasi melalui WhatsApp.", "Not yet. The date and time you provide are preferences. Your appointment is arranged once the clinic team confirms it through WhatsApp."],
    ["Belum tahu perawatan yang dibutuhkan?", "Not sure which treatment you need?", "Anda bisa memilih konsultasi. Ceritakan keluhan saat menghubungi klinik; dokter akan memeriksa dan menjelaskan pilihan perawatan saat kunjungan.", "You can choose a consultation. Share your concerns when you contact the clinic; the dentist will examine your teeth and explain the options during your visit."],
    ["Bisakah saya mengubah lokasi atau jadwal?", "Can I change my clinic or appointment time?", "Bisa dibicarakan langsung melalui WhatsApp. Sebutkan lokasi dan jadwal yang sebelumnya disepakati agar tim klinik dapat membantu mengecek pilihan lain.", "Discuss the change through WhatsApp. Mention the clinic and time previously agreed so the team can help check other options."],
  ];
  return <section className={`${styles.faq} page-shell`}><div><p className="eyebrow"><Copy id="SEBELUM BERKUNJUNG" en="BEFORE YOU VISIT" /></p><h2 className="section-heading"><Copy id="Ada yang ingin" en="A few things" /><br /><span><Copy id="Anda tanyakan?" en="you might ask." /></span></h2><p className="body-copy"><Copy id="Beberapa jawaban untuk membantu Anda mempersiapkan kunjungan pertama." en="A few answers to help you prepare for your first visit." /></p><Link href="/booking" className="text-link"><Copy id="Tanya lewat WhatsApp" en="Ask on WhatsApp" /><Arrow /></Link></div><div className={styles.faqList}>{items.map(([q, en, a, aEn], i) => <details key={q}><summary><span className={styles.faqNumber}>0{i + 1}</span><span><Copy id={q} en={en} /></span><span className={styles.faqPlus} aria-hidden="true" /></summary><p><Copy id={a} en={aEn} /></p></details>)}</div></section>;
}

export function CtaBand() {
  return <section className={`${styles.cta} page-shell`}><div className={styles.ctaInner}><div className={styles.ctaCopy}><p className="eyebrow"><Copy id="SAMPAI BERTEMU DI KLINIK" en="SEE YOU AT THE CLINIC" /></p><h2><Copy id="Senyum berikutnya," en="Your next smile," /><br /><span><Copy id="kita mulai bersama." en="let’s start together." /></span></h2><p><Copy id="Pilih klinik Anda dan ceritakan kebutuhan kunjungan lewat WhatsApp." en="Choose your clinic and tell us about your visit through WhatsApp." /></p></div><div className={styles.ctaLinks}>{clinicLocations.map(clinic => <Link key={clinic.id} href={`/booking?clinic=${clinic.id}`}><span><MapPinIcon width={19} height={19} aria-hidden="true" />{clinic.city}</span><Arrow /></Link>)}<span className={styles.ctaCaption}><Copy id="Jadwal dikonfirmasi melalui chat." en="Your schedule is confirmed in the chat." /></span></div></div></section>;
}
