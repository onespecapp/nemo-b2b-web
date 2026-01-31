import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Nemo - Automated Appointment Reminders",
  description: "Reduce no-shows by 50% with AI-powered phone call reminders. Simple setup, powerful results for healthcare providers, salons, and service businesses.",
  keywords: ["appointment reminders", "no-show reduction", "AI phone calls", "healthcare", "salon software"],
  openGraph: {
    title: "Nemo - Automated Appointment Reminders",
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
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
