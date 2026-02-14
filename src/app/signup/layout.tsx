import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Free Account | OneSpec",
  description:
    "Sign up for OneSpec free — AI-powered appointment reminder calls. No credit card required, launch in minutes.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
