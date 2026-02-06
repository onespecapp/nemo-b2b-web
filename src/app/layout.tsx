import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
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

export const metadata: Metadata = {
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
  openGraph: {
    title: "OneSpec - AI Appointment Reminders for Vancouver Businesses",
    description: "Reduce no-shows by 50% with AI-powered phone call reminders built for Greater Vancouver businesses.",
    type: "website",
    locale: "en_CA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA" className="scroll-smooth">
      <body className={`${fraunces.variable} ${manrope.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
