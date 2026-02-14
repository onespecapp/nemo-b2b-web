import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import TemplateGenerator from './TemplateGenerator'

export const metadata: Metadata = {
  title: 'Free Appointment Reminder Template Generator | OneSpec',
  description:
    'Generate free appointment reminder templates for SMS, email, and phone scripts. Customize by industry, tone, and service type. Copy and use instantly.',
  alternates: {
    canonical: 'https://onespec.io/tools/appointment-reminder-template',
  },
  openGraph: {
    title: 'Free Appointment Reminder Template Generator | OneSpec',
    description:
      'Generate free appointment reminder templates for SMS, email, and phone scripts. Customize by industry, tone, and service type.',
    type: 'website',
    url: 'https://onespec.io/tools/appointment-reminder-template',
    locale: 'en_CA',
  },
}

const faqs = [
  {
    question: 'What is an appointment reminder template?',
    answer:
      'An appointment reminder template is a pre-written message you can customize with details like the customer name, service, date, and time. Templates save time by giving your team a consistent starting point for SMS, email, or phone reminders.',
  },
  {
    question: 'How do I write an appointment reminder SMS?',
    answer:
      'Keep it under 160 characters, include the business name, appointment date and time, and a clear call-to-action like "reply C to confirm." Use a friendly but professional tone and always identify your business so the message isn\'t mistaken for spam.',
  },
  {
    question: 'What should an appointment reminder email include?',
    answer:
      'A good reminder email includes a clear subject line, the appointment date and time, the service booked, your business name and location, and instructions for rescheduling or cancelling. Adding a personal greeting improves open rates.',
  },
  {
    question: 'How far in advance should I send appointment reminders?',
    answer:
      'Best practice is to send two reminders: one 48 hours before the appointment and another 2-4 hours before. For phone call reminders, a single call 24 hours in advance works well. Adjust timing based on your no-show patterns.',
  },
  {
    question: 'Can I automate appointment reminder calls?',
    answer:
      'Yes. Services like OneSpec use AI to make reminder calls that sound like your front desk. Automated calls capture confirmations, cancellations, and reschedule requests without any manual effort from your team.',
  },
  {
    question: 'What tone should I use for appointment reminders?',
    answer:
      'Match the tone to your brand. Healthcare and legal offices typically use a professional tone, while salons, spas, and fitness studios can be friendlier or more casual. The most important thing is clarity — make sure the date, time, and next steps are unmistakable.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Appointment Reminder Template Generator',
  url: 'https://onespec.io/tools/appointment-reminder-template',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
}

export default function AppointmentReminderTemplatePage() {
  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#0f1f1a]">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      {/* Header — simplified */}
      <header className="relative z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/">
            <Image src="/logo.png" alt="OneSpec" width={200} height={48} className="w-full max-w-[180px]" />
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[#0f1f1a] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Start free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.22),rgba(248,245,239,0.05)_65%)] blur-3xl" />
          <div className="absolute right-0 top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.25),rgba(248,245,239,0.1)_70%)] blur-2xl" />
          <div className="absolute left-8 bottom-10 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(15,118,110,0.22),rgba(248,245,239,0.05)_65%)] blur-2xl" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,26,0.04),transparent,rgba(15,23,26,0.06))]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0f1f1a]/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f1f1a]/70 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#f97316]" />
            Free Tool
          </div>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Free Appointment Reminder
            <span className="block text-[#0f766e]">Template Generator</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#0f1f1a]/70">
            Create ready-to-use reminder templates for SMS, email, and phone scripts. Customize by industry, tone, and service — then copy and send.
          </p>
        </div>
      </section>

      {/* Template Generator */}
      <section className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <TemplateGenerator />
        </div>
      </section>

      {/* SEO: What Is an Appointment Reminder? */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.45fr_0.55fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Best Practices</p>
              <h2 className="font-display text-3xl sm:text-4xl">What is an appointment reminder?</h2>
            </div>
            <div className="space-y-4 text-[#0f1f1a]/70">
              <p>
                An appointment reminder is a message sent to a customer before their scheduled visit to reduce no-shows and last-minute cancellations. Reminders can be delivered via SMS, email, or phone call — each channel with its own strengths.
              </p>
              <p>
                SMS reminders work best for quick, day-of confirmations. They have near-instant open rates and let customers reply to confirm or reschedule in seconds. Email reminders are ideal for sending detailed information like preparation instructions, office directions, or cancellation policies 48 hours in advance.
              </p>
              <p>
                Phone call reminders are the most personal channel and tend to have the highest confirmation rates, especially for high-value appointments. They give customers a chance to ask questions and feel the human connection with your business — even when the call is handled by AI.
              </p>
              <p>
                The most effective reminder strategy combines multiple channels: an email 48 hours out, followed by an SMS or phone call the day before. This layered approach can reduce no-shows by 30-50% across industries like dental, medical, salon, auto repair, and fitness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO: Templates by Channel */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Examples</p>
            <h2 className="font-display text-3xl sm:text-4xl">Appointment reminder templates by channel</h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* SMS example */}
            <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#0f1f1a]">SMS Template</h3>
              <p className="mt-2 text-sm text-[#0f1f1a]/60">
                Short, direct, and under 160 characters for maximum deliverability.
              </p>
              <div className="mt-4 rounded-xl bg-[#f8f5ef] p-4 text-sm text-[#0f1f1a]/80">
                Hi Sarah, this is Bloom Dental. Reminder: your cleaning is tomorrow at 2:00 PM. Reply C to confirm or R to reschedule.
              </div>
            </div>

            {/* Email example */}
            <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#0f1f1a]">Email Template</h3>
              <p className="mt-2 text-sm text-[#0f1f1a]/60">
                Room for details like prep instructions and cancellation policy.
              </p>
              <div className="mt-4 rounded-xl bg-[#f8f5ef] p-4 text-sm text-[#0f1f1a]/80">
                <strong>Subject:</strong> Your cleaning is tomorrow!<br /><br />
                Hi Sarah, just a reminder that your cleaning at Bloom Dental is scheduled for Tuesday, March 18 at 2:00 PM. Let us know if you need to reschedule.
              </div>
            </div>

            {/* Phone script example */}
            <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#0f1f1a]">Phone Script</h3>
              <p className="mt-2 text-sm text-[#0f1f1a]/60">
                Natural, conversational scripts for live or AI-powered calls.
              </p>
              <div className="mt-4 rounded-xl bg-[#f8f5ef] p-4 text-sm text-[#0f1f1a]/80">
                &ldquo;Hi Sarah, this is Bloom Dental calling to confirm your cleaning tomorrow at 2:00 PM. Does that still work for you?&rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">FAQ</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">Frequently asked questions</h2>
          </div>
          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-[#0f1f1a]/10 bg-white p-6">
                <h3 className="text-base font-semibold text-[#0f1f1a]">{faq.question}</h3>
                <p className="mt-2 text-sm text-[#0f1f1a]/60">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[36px] border border-[#0f1f1a]/10 bg-gradient-to-br from-[#f97316]/20 via-white to-[#0f766e]/15 p-12 text-center shadow-lg">
          <h2 className="font-display text-3xl sm:text-4xl">
            Turn templates into automated reminder calls
          </h2>
          <p className="mt-4 text-[#0f1f1a]/70">
            OneSpec calls every customer before their appointment, captures confirmations, and flags reschedules — so your team keeps calendars full without lifting a finger.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-full bg-[#0f1f1a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5"
            >
              Create free account
            </Link>
            <Link
              href="/"
              className="rounded-full border border-[#0f1f1a]/20 px-6 py-3 text-sm font-semibold text-[#0f1f1a] transition hover:border-[#0f1f1a]/40"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#0f1f1a]/10 bg-white/70 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="space-y-4">
              <Image src="/logo.png" alt="OneSpec" width={160} height={40} className="w-full max-w-[140px]" />
              <p className="text-sm text-[#0f1f1a]/60">
                AI reminder calls that keep calendars full and teams focused.
              </p>
            </div>

            {/* Product */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/50">Product</div>
              <div className="mt-4 space-y-3 text-sm text-[#0f1f1a]/70">
                <Link href="/#features" className="block hover:text-[#0f1f1a]">Features</Link>
                <Link href="/#how" className="block hover:text-[#0f1f1a]">How it works</Link>
                <Link href="/#pricing" className="block hover:text-[#0f1f1a]">Pricing</Link>
                <Link href="/#faq" className="block hover:text-[#0f1f1a]">FAQ</Link>
              </div>
            </div>

            {/* Free Tools */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/50">Free Tools</div>
              <div className="mt-4 space-y-3 text-sm text-[#0f1f1a]/70">
                <Link href="/tools/appointment-reminder-template" className="block hover:text-[#0f1f1a]">Reminder Template Generator</Link>
                <Link href="/tools/appointment-reminder-cards" className="block hover:text-[#0f1f1a]">Reminder Card Generator</Link>
                <Link href="/tools/appointment-reminder-text" className="block hover:text-[#0f1f1a]">SMS Reminder Generator</Link>
                <Link href="/tools/no-show-cancellation-policy" className="block hover:text-[#0f1f1a]">Cancellation Policy Generator</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/50">Legal</div>
              <div className="mt-4 space-y-3 text-sm text-[#0f1f1a]/70">
                <a href="/terms" className="block hover:text-[#0f1f1a]">Terms of Service</a>
                <a href="/privacy" className="block hover:text-[#0f1f1a]">Privacy Policy</a>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#0f766e]/20 bg-[#0f766e]/10 px-3 py-1 text-xs font-medium text-[#0f766e]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0f766e]" />
                  PIPEDA Compliant
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/50">Contact</div>
              <div className="mt-4 space-y-3 text-sm text-[#0f1f1a]/70">
                <a href="mailto:info@onespec.io" className="block hover:text-[#0f1f1a]">info@onespec.io</a>
                <div>Greater Vancouver, BC, Canada</div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#0f1f1a]/10 pt-6 text-sm text-[#0f1f1a]/50">
            <div>&copy; 2026 OneSpec. All rights reserved.</div>
            <div>Made in Vancouver, BC</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
