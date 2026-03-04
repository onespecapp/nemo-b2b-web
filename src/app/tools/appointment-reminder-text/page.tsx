import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import SmsGenerator from './SmsGenerator'

export const metadata: Metadata = {
  title: 'Free Appointment Reminder Text & SMS Generator | OneSpec',
  description:
    'Generate appointment reminder text messages for SMS. Templates for confirmations, day-before reminders, same-day alerts, reschedules, and no-show follow-ups. Free and instant.',
  alternates: {
    canonical: 'https://onespec.io/tools/appointment-reminder-text',
  },
  openGraph: {
    title: 'Free Appointment Reminder Text & SMS Generator | OneSpec',
    description:
      'Generate SMS reminder templates for every scenario — confirmations, reminders, reschedules, and no-show follow-ups.',
    type: 'website',
    url: 'https://onespec.io/tools/appointment-reminder-text',
    locale: 'en_CA',
  },
}

const faqs = [
  {
    question: 'How long should an appointment reminder text be?',
    answer:
      'Keep SMS reminders under 160 characters when possible. Messages over 160 characters are split into multiple segments, which can increase costs and sometimes arrive out of order. Include the essentials: business name, date, time, and a clear action (confirm or reschedule).',
  },
  {
    question: 'When should I send appointment reminder texts?',
    answer:
      'Send a confirmation text immediately after booking, a reminder 24 hours before the appointment, and optionally a same-day reminder 2-4 hours before. Avoid sending texts before 9 AM or after 8 PM to respect your customers\' time.',
  },
  {
    question: 'Do I need consent to send appointment reminder texts?',
    answer:
      'Yes. Under regulations like TCPA (US), CASL (Canada), and GDPR (EU), you need explicit consent before sending SMS messages. Get written or digital consent during the booking process and always include opt-out instructions like "Reply STOP to unsubscribe."',
  },
  {
    question: 'Are text message reminders effective at reducing no-shows?',
    answer:
      'SMS reminders can reduce no-shows by 25-35%. However, studies show that phone call reminders achieve even higher confirmation rates (40-50% reduction) because they create a two-way conversation and personal commitment. The best approach combines both channels.',
  },
  {
    question: 'What should I include in a no-show follow-up text?',
    answer:
      'Keep it empathetic, not accusatory. Include your business name, acknowledge the missed appointment, and offer an easy way to rebook. Avoid mentioning fees in the text — save policy discussions for phone calls or emails.',
  },
  {
    question: 'Can I automate appointment reminder texts?',
    answer:
      'Yes. Many booking systems and CRM platforms can send automated SMS reminders. For businesses wanting higher engagement, AI-powered phone calls (like OneSpec) combine the automation of texts with the personal touch and confirmation rates of phone calls.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
}

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Appointment Reminder Text & SMS Generator',
  url: 'https://onespec.io/tools/appointment-reminder-text',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function AppointmentReminderTextPage() {
  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#0f1f1a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />

      {/* Header */}
      <header className="relative z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/"><Image src="/logo.png" alt="OneSpec" width={200} height={48} className="w-full max-w-[180px]" /></Link>
          <Link href="/signup" className="rounded-full bg-[#0f1f1a] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:shadow-xl">Start free</Link>
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
            <span className="h-2 w-2 rounded-full bg-[#f97316]" />Free Tool
          </div>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Free Appointment Reminder<span className="block text-[#0f766e]">Text &amp; SMS Generator</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#0f1f1a]/70">
            Generate ready-to-send SMS reminder messages for every scenario — confirmations, day-before reminders, same-day alerts, reschedule requests, and no-show follow-ups.
          </p>
        </div>
      </section>

      {/* Generator */}
      <section className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl"><SmsGenerator /></div>
      </section>

      {/* SEO: How to Write Effective Reminder Texts */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.45fr_0.55fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Guide</p>
              <h2 className="font-display text-3xl sm:text-4xl">How to write effective appointment reminder texts</h2>
            </div>
            <div className="space-y-4 text-[#0f1f1a]/70">
              <p>
                The best appointment reminder texts are short, clear, and actionable. Your customer should understand who is messaging, when their appointment is, and what to do — all within a few seconds of reading.
              </p>
              <p>
                <strong>Always identify your business.</strong> Start with your business name or include it early in the message. Unidentified texts are often ignored or flagged as spam. A simple &ldquo;Hi Sarah, this is Bloom Dental&rdquo; sets the context immediately.
              </p>
              <p>
                <strong>Include a clear call-to-action.</strong> Tell the customer exactly what to do: &ldquo;Reply C to confirm&rdquo; or &ldquo;Call us to reschedule.&rdquo; Without a CTA, you&apos;re hoping they read the message — with one, you&apos;re driving a response.
              </p>
              <p>
                <strong>Keep it under 160 characters when possible.</strong> Single-segment SMS messages are cheaper and more reliable. If you need more space, consider sending the detailed information via email and the quick reminder via text. For multi-channel templates, try our <Link href="/tools/appointment-reminder-template" className="text-[#0f766e] underline hover:no-underline">reminder template generator</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO: SMS Best Practices */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Best Practices</p>
            <h2 className="font-display text-3xl sm:text-4xl">SMS reminder best practices &amp; compliance</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#0f1f1a]">📏 Character Limits</h3>
              <p className="mt-2 text-sm text-[#0f1f1a]/60">
                A single SMS segment is 160 characters (GSM-7 encoding). Messages with emojis or special characters use UCS-2 encoding, dropping the limit to 70 characters per segment. Stick to plain text for appointment reminders.
              </p>
            </div>
            <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#0f1f1a]">⚖️ Compliance</h3>
              <p className="mt-2 text-sm text-[#0f1f1a]/60">
                TCPA (US) and CASL (Canada) require prior consent for commercial texts. Appointment reminders are generally considered transactional, but always include opt-out language and get consent during booking.
              </p>
            </div>
            <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#0f1f1a]">⏰ Timing</h3>
              <p className="mt-2 text-sm text-[#0f1f1a]/60">
                Send reminders during business hours (9 AM – 8 PM local time). The sweet spot for day-before reminders is between 10 AM and 2 PM. Same-day reminders work best 2-4 hours before the appointment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO: SMS vs Phone Calls */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.45fr_0.55fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Comparison</p>
              <h2 className="font-display text-3xl sm:text-4xl">SMS reminders vs. phone call reminders</h2>
            </div>
            <div className="space-y-4 text-[#0f1f1a]/70">
              <p>
                Text messages have a 98% open rate, but only about 45% of recipients respond to appointment reminder texts. Phone calls, while answered less frequently, achieve much higher confirmation rates because they create a real-time conversation.
              </p>
              <p>
                The biggest limitation of SMS reminders is that they&apos;re easy to dismiss. A customer might read the text, intend to confirm later, and forget. Phone calls demand immediate attention and create a verbal commitment that&apos;s psychologically harder to break.
              </p>
              <p>
                For businesses with high no-show rates, the most effective strategy is a <strong>layered approach</strong>: send an SMS reminder 48 hours out, then follow up with an automated phone call 24 hours before. Services like OneSpec handle the phone call automatically using AI that sounds like your front desk.
              </p>
              <p>
                Want to hand clients a physical reminder too? Generate a printable <Link href="/tools/appointment-reminder-cards" className="text-[#0f766e] underline hover:no-underline">appointment reminder card</Link> they can keep in their wallet.
              </p>
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

      {/* CTA */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[36px] border border-[#0f1f1a]/10 bg-gradient-to-br from-[#f97316]/20 via-white to-[#0f766e]/15 p-12 text-center shadow-lg">
          <h2 className="font-display text-3xl sm:text-4xl">Texts get ignored. AI phone calls don&apos;t.</h2>
          <p className="mt-4 text-[#0f1f1a]/70">OneSpec calls every customer before their appointment, captures confirmations and reschedules, and keeps your calendar full — without your team sending a single text.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup" className="rounded-full bg-[#0f1f1a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5">Try OneSpec free</Link>
            <Link href="/" className="rounded-full border border-[#0f1f1a]/20 px-6 py-3 text-sm font-semibold text-[#0f1f1a] transition hover:border-[#0f1f1a]/40">Learn more</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#0f1f1a]/10 bg-white/70 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-4">
              <Image src="/logo.png" alt="OneSpec" width={160} height={40} className="w-full max-w-[140px]" />
              <p className="text-sm text-[#0f1f1a]/60">AI reminder calls that keep calendars full and teams focused.</p>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/50">Product</div>
              <div className="mt-4 space-y-3 text-sm text-[#0f1f1a]/70">
                <Link href="/#features" className="block hover:text-[#0f1f1a]">Features</Link>
                <Link href="/#how" className="block hover:text-[#0f1f1a]">How it works</Link>
                <Link href="/#pricing" className="block hover:text-[#0f1f1a]">Pricing</Link>
                <Link href="/#faq" className="block hover:text-[#0f1f1a]">FAQ</Link>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/50">Free Tools</div>
              <div className="mt-4 space-y-3 text-sm text-[#0f1f1a]/70">
                <Link href="/tools/appointment-reminder-template" className="block hover:text-[#0f1f1a]">Reminder Template Generator</Link>
                <Link href="/tools/appointment-reminder-cards" className="block hover:text-[#0f1f1a]">Reminder Card Generator</Link>
                <Link href="/tools/appointment-reminder-text" className="block hover:text-[#0f1f1a]">SMS Reminder Generator</Link>
                <Link href="/tools/no-show-cancellation-policy" className="block hover:text-[#0f1f1a]">Cancellation Policy Generator</Link>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/50">Legal</div>
              <div className="mt-4 space-y-3 text-sm text-[#0f1f1a]/70">
                <a href="/terms" className="block hover:text-[#0f1f1a]">Terms of Service</a>
                <a href="/privacy" className="block hover:text-[#0f1f1a]">Privacy Policy</a>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#0f766e]/20 bg-[#0f766e]/10 px-3 py-1 text-xs font-medium text-[#0f766e]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0f766e]" />PIPEDA Compliant
                </div>
              </div>
            </div>
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
