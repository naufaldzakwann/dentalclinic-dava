import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.fullName} — Senyum sehat tanpa rasa cemas`,
    template: `%s · ${site.name}`,
  },
  description:
    "Praktik kedokteran gigi drg Dava Fathiyatuzzakiyah — scaling, tambal gigi, perawatan saluran akar, behel, pemutihan gigi, dan perawatan gigi anak dengan penjelasan yang jelas dan biaya transparan.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: site.fullName,
    title: `${site.fullName} — Praktik Kedokteran Gigi`,
    description:
      "Perawatan gigi yang telaten, jujur soal biaya, dan nyaman untuk semua usia. Booking janji temu lewat WhatsApp.",
  },
};

const clinicJsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: site.fullName,
  alternateName: site.name,
  description: "Praktik kedokteran gigi dengan perawatan yang telaten dan biaya transparan.",
  telephone: site.phoneDisplay,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address,
    addressCountry: "ID",
  },
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
    <html lang="id">
      <body className={`${jakarta.variable} antialiased`}>
        <a href="#konten-utama" className="skip-link">
          Lewati ke konten utama
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd) }}
        />
      </body>
    </html>
  );
}
