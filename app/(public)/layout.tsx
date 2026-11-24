import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MotionDirector from "@/components/MotionDirector";
import WhatsAppFab from "@/components/WhatsAppFab";
import { SitePreferencesProvider } from "@/components/SitePreferences";
import { T } from "@/components/SitePreferences";
import "lenis/dist/lenis.css";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SitePreferencesProvider>
      <>
        <a href="#konten-utama" className="skip-link">
          <T id="common.skip" fallback="Lewati ke konten utama" />
        </a>
        <Nav />
        <main id="konten-utama">{children}</main>
        <Footer />
        <WhatsAppFab />
        <MotionDirector />
      </>
    </SitePreferencesProvider>
  );
}
