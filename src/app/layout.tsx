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
  title: "OneSpec - Automated Appointment Reminders",
  description: "Reduce no-shows by 50% with AI-powered phone call reminders. Simple setup, powerful results for healthcare providers, salons, and service businesses.",
  keywords: ["appointment reminders", "no-show reduction", "AI phone calls", "healthcare", "salon software"],
  openGraph: {
    title: "OneSpec - Automated Appointment Reminders",
    description: "Reduce no-shows by 50% with AI-powered phone call reminders.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${fraunces.variable} ${manrope.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
