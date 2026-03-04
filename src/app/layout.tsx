import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

const isProduction = process.env.VERCEL_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL("https://onespec.io"),
  title: "OneSpec — AI Receptionist for Car Dealerships",
  description: "AI receptionist and follow-up automation for car dealerships. Answer every call, capture leads, and schedule test drives and service appointments.",
  keywords: [
    "AI receptionist",
    "car dealership AI",
    "dealership lead follow-up",
    "automotive call handling",
    "test drive scheduling",
    "service appointment AI",
    "voice AI for dealerships",
    "automotive customer support",
  ],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "OneSpec — AI Receptionist for Car Dealerships",
    description: "Answer calls, capture leads, and automate dealership follow-up with a natural voice AI assistant.",
    type: "website",
    locale: "en_CA",
    siteName: "OneSpec",
    url: "https://onespec.io",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: isProduction
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L8MJVFVFZY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L8MJVFVFZY');
          `}
        </Script>
      </head>
      <body className={`${fraunces.variable} ${manrope.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "OneSpec",
              url: "https://onespec.io",
              logo: "https://onespec.io/logo.png",
              description:
                "AI receptionist and lead follow-up automation for car dealerships",
              areaServed: "CA",
              contactPoint: {
                "@type": "ContactPoint",
                email: "info@onespec.io",
                contactType: "customer service",
              },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
