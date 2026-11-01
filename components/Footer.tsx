import Link from "next/link";
import { clinicLocations, site } from "@/lib/site";
import { ArrowRightIcon } from "./icons";
import Copy from "./LocalizedCopy";
import WhatsAppIcon from "./WhatsAppIcon";
import styles from "./Footer.module.css";

export default function Footer() {
  return <footer className={`site-footer ${styles.footer}`}>
    <div className="page-shell">
      <div className={styles.main}>
        <div className={styles.brandArea}>
          <Link href="/" className={styles.brand} aria-label="Dava Dental Care">dava<span>.</span></Link>
          <span className={styles.brandCaption}>DENTAL CARE</span>
          <p><Copy id="Perawatan penuh perhatian, untuk senyum Anda." en="Thoughtful care, for your smile." /></p>
          <span className={styles.doctor}>{site.name}</span>
        </div>
        <nav className={styles.explore} aria-label="Footer">
          <h2><Copy id="Jelajahi" en="Explore" /></h2>
          <Link href="/layanan"><Copy id="Perawatan" en="Treatments" /></Link>
          <Link href="/tentang"><Copy id="Dokter" en="Dentist" /></Link>
          <Link href="/kontak"><Copy id="Lokasi" en="Locations" /></Link>
          <Link href="/galeri"><Copy id="Galeri" en="Gallery" /></Link>
        </nav>
        <div className={styles.clinics}>
          <h2><Copy id="Dua lokasi, satu perhatian." en="Two locations. The same care." /></h2>
          {clinicLocations.map(location => <Link key={location.id} href={`/booking?clinic=${location.id}`}>
            <span>{location.city}</span><ArrowRightIcon width={15} height={15} aria-hidden="true" />
          </Link>)}
          <p>Riau, Indonesia</p>
        </div>
        <div className={styles.appointment}>
          <h2><Copy id="Rencanakan kunjungan" en="Plan your visit" /></h2>
          <p><Copy id="Pilih klinik, lalu bicarakan jadwal kunjungan Anda lewat WhatsApp." en="Choose a clinic, then arrange your appointment with us on WhatsApp." /></p>
          <Link href="/booking" className={styles.appointmentLink}>
            <WhatsAppIcon width={17} height={17} aria-hidden="true" />
            <Copy id="Buat janji" en="Book a visit" />
            <ArrowRightIcon width={16} height={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Dava Dental Care.</span>
        <Link href="/kebijakan-privasi"><Copy id="Kebijakan privasi" en="Privacy policy" /></Link>
        <a className={`developer-credit ${styles.credit}`} href="https://porto-ten-tau.vercel.app/" target="_blank" rel="noopener noreferrer">
          Developed by <span>Naufal Dzakwan</span>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12 12 4M4 4h8v8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
    </div>
  </footer>;
}
