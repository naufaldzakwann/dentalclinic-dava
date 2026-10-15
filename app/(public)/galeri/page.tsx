import type { Metadata } from "next";
import Link from "next/link";
import Copy from "@/components/LocalizedCopy";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Galeri Perawatan",
  description: "Jelajahi ilustrasi suasana dan tahapan kunjungan perawatan gigi bersama drg. Dava Fathiyatuzzakiyah.",
};

type Room = "treatment" | "waiting" | "preparation" | "consultation";

function RoomIllustration({ room }: { room: Room }) {
  return (
    <svg viewBox="0 0 600 440" fill="none" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`wall-${room}`} x1="0" y1="0" x2="600" y2="440" gradientUnits="userSpaceOnUse"><stop stopColor="#F4F0FB" /><stop offset="1" stopColor="#DDD1ED" /></linearGradient>
        <linearGradient id={`light-${room}`} x1="150" y1="40" x2="370" y2="360" gradientUnits="userSpaceOnUse"><stop stopColor="#FFFDF9" /><stop offset="1" stopColor="#E6DCF6" /></linearGradient>
      </defs>
      <path fill={`url(#wall-${room})`} d="M0 0h600v440H0z" />
      <path d="M0 334h600v106H0z" fill="#D9CBE9" />
      <path d="M0 334h600M0 390h600M150 334 70 440M450 334l80 106" stroke="#C6B4DD" strokeWidth="1.5" />
      <path d="M98 334V142c0-66 44-105 103-105s103 39 103 105v192H98Z" fill={`url(#light-${room})`} />
      <path d="M201 39v294M100 159h202" stroke="#D2C2E6" strokeWidth="3" />
      <path d="m105 329 195-140v140H105Z" fill="white" fillOpacity=".22" />
      {room === "treatment" && <>
        <ellipse cx="309" cy="376" rx="151" ry="19" fill="#9B84B8" fillOpacity=".25" />
        <path d="M310 304h29v63h-29z" fill="#A58ABD" /><rect x="270" y="361" width="113" height="15" rx="7.5" fill="#A58ABD" />
        <path d="m217 180 59 111h135c19 0 22 30 3 34H277c-14 0-25-7-32-19l-66-113c-12-23 23-37 38-13Z" fill="#8D6CB0" />
        <path d="m223 186 57 104h128" stroke="#BCA4D5" strokeWidth="10" strokeLinecap="round" />
        <rect x="166" y="143" width="56" height="30" rx="13" transform="rotate(-23 166 143)" fill="#8D6CB0" />
        <path d="M400 300V161l-68-37V83" stroke="#AF9DBF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="290" y="72" width="82" height="24" rx="12" fill="#FAF7FF" /><rect x="310" y="79" width="41" height="10" rx="5" fill="#D6C5E8" />
        <rect x="451" y="228" width="94" height="89" rx="8" fill="#F1EAF8" /><rect x="445" y="217" width="106" height="16" rx="4" fill="#BBA3D0" /><path d="M498 238v79M463 266h20M512 266h20" stroke="#CCBADC" strokeWidth="3" /><path d="M464 318v17m67-17v17" stroke="#9F84B7" strokeWidth="5" />
      </>}
      {room === "waiting" && <>
        <ellipse cx="280" cy="378" rx="188" ry="19" fill="#9B84B8" fillOpacity=".16" />
        <rect x="116" y="250" width="240" height="86" rx="25" fill="#BCA4D3" /><rect x="112" y="291" width="248" height="47" rx="15" fill="#9371B3" /><path d="M143 337v32m187-32v32" stroke="#806294" strokeWidth="8" /><path d="M233 262v30" stroke="#AA8DC5" strokeWidth="3" />
        <path d="M423 183v130m0-69c-42-3-58-31-53-59 31 2 51 22 53 59Zm0-25c38-4 53-26 51-53-29-2-49 21-51 53Zm0 65c39-1 59-24 55-53-32 0-52 20-55 53Z" stroke="#8F9D8A" strokeWidth="3" fill="#AAB6A2" />
        <path d="m392 311 9 53h44l9-53h-62Z" fill="#EAE0EE" />
        <path d="M375 338h-33m16 0v36" stroke="#AB8DBD" strokeWidth="7" strokeLinecap="round" /><ellipse cx="358" cy="334" rx="42" ry="10" fill="#EAE1F2" />
        <rect x="404" y="84" width="95" height="104" rx="4" fill="#EDE6F5" /><path d="M416 176c0-50 25-79 70-79v79h-70Z" fill="#C5AED9" />
      </>}
      {room === "preparation" && <>
        <ellipse cx="328" cy="373" rx="181" ry="14" fill="#9B84B8" fillOpacity=".16" />
        <rect x="150" y="239" width="364" height="116" rx="7" fill="#F2ECF8" /><path d="M271 241v114m121-114v114M153 294h359" stroke="#D5C7E3" strokeWidth="3" />
        <rect x="139" y="225" width="386" height="17" rx="5" fill="#A88CBF" /><path d="M169 261h27m94 0h27m95 0h27m-270 56h27m94 0h27m95 0h27" stroke="#B6A0CA" strokeWidth="4" strokeLinecap="round" />
        <rect x="377" y="157" width="118" height="68" rx="10" fill="#B9A1D0" /><rect x="388" y="167" width="77" height="48" rx="7" fill="#E5DAEF" /><circle cx="479" cy="182" r="5" fill="#9475B0" />
        <rect x="196" y="175" width="31" height="50" rx="6" fill="#F7F3FB" /><path d="M212 175v-13h19" stroke="#BBA5CE" strokeWidth="6" strokeLinecap="round" />
        <rect x="169" y="103" width="141" height="10" rx="3" fill="#B59BCA" /><rect x="186" y="61" width="28" height="42" rx="6" fill="#E8DFF2" /><rect x="231" y="53" width="24" height="50" rx="6" fill="#BFA7D3" /><rect x="270" y="67" width="22" height="36" rx="5" fill="#E8DFF2" />
      </>}
      {room === "consultation" && <>
        <ellipse cx="324" cy="376" rx="183" ry="19" fill="#9B84B8" fillOpacity=".17" />
        <path d="M176 273v88m245-88v88" stroke="#B398C8" strokeWidth="11" /><rect x="156" y="257" width="290" height="19" rx="7" fill="#B89ECB" />
        <path d="M337 255v-24" stroke="#9F80B7" strokeWidth="7" /><rect x="299" y="177" width="83" height="58" rx="5" fill="#A48BBA" /><rect x="305" y="183" width="71" height="45" rx="2" fill="#ECE3F5" /><path d="m324 206 10-10 10 17 15-23" stroke="#BAA1CF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M133 290h80v47h-80z" fill="#B199C9" /><rect x="124" y="239" width="92" height="74" rx="22" fill="#9471B2" /><path d="M138 337v33m63-33v33" stroke="#9276A7" strokeWidth="7" />
        <path d="M430 290h80v47h-80z" fill="#B199C9" /><rect x="427" y="239" width="92" height="74" rx="22" fill="#B69BCD" /><path d="M442 337v33m63-33v33" stroke="#9276A7" strokeWidth="7" />
        <rect x="394" y="73" width="107" height="110" rx="5" fill="#EAE1F3" /><path d="M450 99c-12-3-23 3-23 16 0 15 8 37 13 37s3-15 10-15 5 15 10 15 13-22 13-37c0-13-11-19-23-16Z" stroke="#B299CC" strokeWidth="3" />
      </>}
    </svg>
  );
}

const scenes: { room: Room; id: string; en: string; body: string; bodyEn: string }[] = [
  { room: "treatment", id: "Ruang untuk merawat senyum", en: "A space to care for your smile", body: "Mengenal suasana perawatan gigi, satu langkah pada satu waktu.", bodyEn: "Getting familiar with dental care, one step at a time." },
  { room: "waiting", id: "Waktu untuk merasa tenang", en: "A moment to feel at ease", body: "Beri diri Anda waktu sebelum memulai kunjungan.", bodyEn: "Give yourself a moment before your appointment begins." },
  { room: "preparation", id: "Persiapan sebelum perawatan", en: "Preparing for your care", body: "Setiap kunjungan memiliki proses persiapan sebelum tindakan.", bodyEn: "Each visit includes preparation before treatment begins." },
  { room: "consultation", id: "Percakapan yang berarti", en: "A conversation that matters", body: "Mulai dengan pertanyaan dan pahami pilihan perawatan Anda.", bodyEn: "Start with your questions and understand your treatment options." },
];

export default function GaleriPage() {
  return (
    <div className="page-shell pb-20 sm:pb-28">
      <header className="page-intro">
        <p className="eyebrow"><Copy id="Galeri visual" en="Visual journal" /></p>
        <div className="mt-5 grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
          <h1 className="display-title"><Copy id="Perspektif baru tentang perawatan gigi." en="A fresh perspective on dental care." /></h1>
          <div className="lg:pb-2"><p className="body-copy"><Copy id="Gambaran tentang ruang, percakapan, dan perhatian dalam setiap kunjungan." en="An illustrated look at the spaces, conversations, and care behind a dental visit." /></p><p className="mt-4 text-xs leading-6 text-ink-soft"><Copy id="Seluruh visual merupakan ilustrasi, bukan foto atau dokumentasi klinik." en="All visuals are illustrations, rather than photographs or documentation of the practice." /></p></div>
        </div>
      </header>

      <div className="grid gap-x-7 gap-y-10 md:grid-cols-2">
        {scenes.map((scene, index) => <figure key={scene.room} className={index % 2 === 1 ? "md:translate-y-12" : ""}>
          <div className="relative aspect-[15/11] overflow-hidden rounded-[1.5rem] border border-brand-200/50 bg-[#f0eaf7]">
            <RoomIllustration room={scene.room} />
            <span className="absolute left-5 top-5 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-800"><Copy id="Ilustrasi" en="Illustration" /> / 0{index + 1}</span>
          </div>
          <figcaption className="px-1 pt-5"><h2 className="text-xl font-semibold tracking-tight text-ink"><Copy id={scene.id} en={scene.en} /></h2><p className="mt-2 text-sm leading-7 text-ink-soft"><Copy id={scene.body} en={scene.bodyEn} /></p></figcaption>
        </figure>)}
      </div>

      <section className="mt-16 flex flex-col justify-between gap-7 border-t border-ink/10 pt-10 md:mt-28 md:flex-row md:items-center">
        <div><p className="eyebrow"><Copy id="Kunjungi kami" en="Visit us" /></p><h2 className="section-heading mt-3"><Copy id="Mari berkenalan langsung." en="Let’s meet in person." /></h2></div>
        <Link href="/kontak" className="btn-secondary self-start md:self-auto"><Copy id="Lokasi & kontak" en="Locations & contact" /><ArrowRightIcon width={18} height={18} aria-hidden="true" /></Link>
      </section>
    </div>
  );
}
