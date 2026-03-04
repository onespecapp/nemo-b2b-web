import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Free Account | OneSpec",
  description:
    "Sign up for OneSpec free — AI-powered dealership receptionist calls and lead follow-up. No credit card required.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
