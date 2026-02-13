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
  title: "OneSpec - AI Appointment Reminders for Vancouver Businesses",
  description: "Reduce no-shows by 50% with AI-powered phone call reminders built for Greater Vancouver businesses. Simple setup, powerful results for dental offices, salons, clinics, and service teams across BC.",
  keywords: [
    "appointment reminders Vancouver",
    "no-show reduction",
    "AI phone calls",
    "Vancouver dental reminders",
    "salon appointment software BC",
    "medical clinic reminders Vancouver",
    "auto repair scheduling",
    "pet groomer reminders",
    "PIPEDA compliant reminders",
    "Canadian appointment software",
    "Greater Vancouver business tools",
    "BC healthcare scheduling",
  ],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "OneSpec - AI Appointment Reminders for Vancouver Businesses",
    description: "Reduce no-shows by 50% with AI-powered phone call reminders built for Greater Vancouver businesses.",
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
                "AI-powered appointment reminder calls for service businesses",
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
