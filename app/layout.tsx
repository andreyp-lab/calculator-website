import type { Metadata } from "next";
import { Heebo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://cheshbonai.co.il";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "חשבונאי - 30 מחשבונים פיננסיים בעברית | מעודכן 2026",
    template: "%s | חשבונאי",
  },
  description:
    "30 מחשבונים פיננסיים מקצועיים בעברית: מס הכנסה, משכנתא (אופטימייזר Solver), השקעות, ב.ל. לעצמאי, פיצויי פיטורין, רכב ועוד. עדכני 2026, בחינם.",
  keywords: [
    "מחשבון מס הכנסה",
    "מחשבון משכנתא",
    "החזר מס",
    "פיצויי פיטורין",
    "ביטוח לאומי לעצמאי",
    'מע"מ',
    "מס שבח",
    "מס רכישה",
    "ריבית דריבית",
    "FIRE ישראל",
    "תכנון פרישה",
    "אופטימייזר משכנתא",
    "מדרגות מס 2026",
  ],
  authors: [{ name: "חשבונאי - FinCalc" }],
  creator: "FinCalc",
  publisher: "FinCalc",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: SITE_URL,
    title: "חשבונאי - 30 מחשבונים פיננסיים בעברית | מעודכן 2026",
    description:
      "30 מחשבונים פיננסיים מקצועיים: מס הכנסה, משכנתא עם אופטימייזר Solver-Style, השקעות, פיצויים, רכב ועוד. בחינם וב-2026.",
    siteName: "חשבונאי",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "חשבונאי - מחשבונים פיננסיים בעברית",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "חשבונאי - 30 מחשבונים פיננסיים בעברית",
    description: "מס הכנסה, משכנתא, השקעות, פיצויים ועוד 26 מחשבונים מעודכנים 2026",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "חשבונאי - FinCalc",
  url: SITE_URL,
  description: "30 מחשבונים פיננסיים מקצועיים בעברית עם נתונים מעודכנים ל-2026",
  inLanguage: "he-IL",
  areaServed: "IL",
  knowsAbout: [
    "מס הכנסה",
    "משכנתאות",
    "השקעות",
    "ביטוח לאומי",
    "פיצויי פיטורין",
    "תכנון פרישה",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "חשבונאי",
  url: SITE_URL,
  description: "מחשבונים פיננסיים מקצועיים בעברית, מעודכנים 2026",
  inLanguage: "he-IL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
