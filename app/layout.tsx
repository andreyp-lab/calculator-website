import type { Metadata, Viewport } from "next";
import { Heebo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { AccessibilityWidget } from "@/components/accessibility/AccessibilityWidget";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { SEARCH_CONSOLE } from "@/lib/config/search-console";
import { Analytics } from "@vercel/analytics/next";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// Canonical domain is the apex (matches GSC property, sitemap.ts, robots.txt, site-info.ts).
// Vercel must be configured so apex serves direct (no redirect) and www→apex redirects to it.
const SITE_URL = "https://cheshbonai.co.il";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
  colorScheme: "light",
};

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
  authors: [{ name: "חשבונאי" }],
  creator: "חשבונאי",
  publisher: "חשבונאי",
  // NOTE: alternates.canonical is intentionally NOT set here. In Next.js App Router,
  // any canonical declared at the root layout cascades to every child page that doesn't
  // explicitly override it — which causes Google to see "I'm the homepage" on every
  // sub-page and deindex all of them. Each page.tsx must declare its own canonical.
  alternates: {
    languages: {
      "he-IL": "https://cheshbonai.co.il",
      "x-default": "https://cheshbonai.co.il",
    },
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: SITE_URL,
    title: "חשבונאי - 30 מחשבונים פיננסיים בעברית | מעודכן 2026",
    description:
      "30 מחשבונים פיננסיים מקצועיים: מס הכנסה, משכנתא עם אופטימייזר Solver-Style, השקעות, פיצויים, רכב ועוד. בחינם וב-2026.",
    siteName: "חשבונאי",
    // NOTE: images is intentionally NOT set here.
    // app/opengraph-image.tsx auto-generates the OG image and cascades to all child routes
    // that don't have their own opengraph-image file.
    // Explicitly setting images: ['/og-default.png'] would override the auto-generated image
    // with a file that doesn't exist, breaking social sharing for every page.
  },
  twitter: {
    card: "summary_large_image",
    title: "חשבונאי - 30 מחשבונים פיננסיים בעברית",
    description: "מס הכנסה, משכנתא, השקעות, פיצויים ועוד 26 מחשבונים מעודכנים 2026",
    // NOTE: images is intentionally NOT set here — auto-cascades from app/opengraph-image.tsx
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
  verification: {
    // ימולא לאחר רישום ב-Google Search Console + Bing Webmaster Tools
    // ראה: lib/config/search-console.ts
    google: SEARCH_CONSOLE.google || undefined,
    other: SEARCH_CONSOLE.bing
      ? { "msvalidate.01": SEARCH_CONSOLE.bing }
      : undefined,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "חשבונאי",
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
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
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
        <AccessibilityProvider>
          <SkipToContent />
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <AccessibilityWidget />
        </AccessibilityProvider>
        <Analytics />
      </body>
    </html>
  );
}
