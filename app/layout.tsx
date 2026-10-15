import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { clinicLocations, site } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.fullName} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description:
    "Praktik spesialis konservasi gigi di Pekanbaru dan Taluk Kuantan. Konsultasi, restorasi gigi, dan perawatan saluran akar dengan booking online.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: site.fullName,
    title: `${site.fullName} — ${site.tagline}`,
    description:
      "Konsultasi dan perawatan spesialis konservasi gigi di Pekanbaru dan Taluk Kuantan. Jadwalkan kunjungan online atau melalui WhatsApp.",
  },
};

const clinicJsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: site.fullName,
  alternateName: site.name,
  description: "Praktik spesialis konservasi gigi dengan konsultasi, restorasi gigi, dan perawatan saluran akar.",
  medicalSpecialty: "Konservasi Gigi",
  telephone: site.phoneDisplay,
  address: clinicLocations.map((location) => ({
    "@type": "PostalAddress",
    addressLocality: location.city,
    addressRegion: location.region,
    addressCountry: "ID",
  })),
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "09:00",
      closes: "14:00",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${jakarta.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('dava:theme');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t;var l=localStorage.getItem('dava:language');if(l==='id'||l==='en')document.documentElement.lang=l}catch{}`,
          }}
        />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd) }}
        />
      </body>
    </html>
  );
}
