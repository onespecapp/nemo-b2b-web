import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | OneSpec",
  description:
    "Sign in to your OneSpec dashboard to manage appointments and reminder calls.",
  robots: { index: false, follow: true },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
