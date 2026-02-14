import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import PolicyGenerator from './PolicyGenerator'

export const metadata: Metadata = {
  title: 'Free No-Show & Cancellation Policy Generator | OneSpec',
  description:
    'Generate a professional no-show and cancellation policy for your business. Customize by industry, notice period, fees, and policy strictness. Free template — copy and use instantly.',
  alternates: {
    canonical: 'https://onespec.io/tools/no-show-cancellation-policy',
  },
  openGraph: {
    title: 'Free No-Show & Cancellation Policy Generator | OneSpec',
    description:
      'Generate a customized cancellation and no-show policy for your salon, dental office, clinic, or any appointment-based business.',
    type: 'website',
    url: 'https://onespec.io/tools/no-show-cancellation-policy',
    locale: 'en_CA',
  },
}

const faqs = [
  {
    question: 'Why does my business need a cancellation policy?',
    answer:
      'A cancellation policy protects your revenue and time. No-shows cost service businesses an average of $200 per missed appointment. A clear policy sets expectations, reduces last-minute cancellations, and gives you grounds to charge fees when clients don\'t show up.',
  },
  {
    question: 'What is a fair cancellation notice period?',
    answer:
      '24 hours is the most common notice period and is generally considered fair by clients. High-demand businesses (salons on weekends, specialist medical offices) may require 48 hours. 72 hours is appropriate for long or specialized appointments that are difficult to rebook.',
  },
  {
    question: 'How much should I charge for no-shows?',
    answer:
      'Common no-show fees range from $25-$50 for standard services and up to the full service cost for premium or lengthy appointments. The fee should be meaningful enough to deter no-shows but not so high that it drives clients away. Many businesses start with $50 and adjust.',
  },
  {
    question: 'How do I communicate my cancellation policy to clients?',
    answer:
      'Share your policy at the time of booking (on your website, booking confirmation email, and intake forms). Display it in your waiting area. Include a brief mention in appointment reminder messages. The key is that clients should never be surprised by the policy.',
  },
  {
    question: 'Should I enforce the no-show fee every time?',
    answer:
      'Use discretion for first-time offenders or genuine emergencies — waiving the fee once with a friendly reminder builds goodwill. However, be consistent with repeat offenders. Having a clear policy gives you the authority to charge when needed, even if you choose to waive it occasionally.',
  },
  {
    question: 'What is the average no-show rate for appointment-based businesses?',
    answer:
      'No-show rates vary by industry: medical practices average 18-23%, dental offices 10-15%, salons and spas 15-20%, and fitness studios 20-30%. Implementing a cancellation policy combined with automated reminders can reduce no-shows by 30-50%.',
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
  name: 'No-Show & Cancellation Policy Generator',
  url: 'https://onespec.io/tools/no-show-cancellation-policy',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function NoShowCancellationPolicyPage() {
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
            Free No-Show &amp; Cancellation<span className="block text-[#0f766e]">Policy Generator</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#0f1f1a]/70">
            Create a professional cancellation and no-show policy customized for your industry. Configure notice periods, fees, and policy strictness — then copy and use instantly.
          </p>
        </div>
      </section>

      {/* Generator */}
      <section className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl"><PolicyGenerator /></div>
      </section>

      {/* SEO: Why Every Business Needs a Cancellation Policy */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.45fr_0.55fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Guide</p>
              <h2 className="font-display text-3xl sm:text-4xl">Why every appointment-based business needs a cancellation policy</h2>
            </div>
            <div className="space-y-4 text-[#0f1f1a]/70">
              <p>
                No-shows are one of the biggest revenue drains for service businesses. A single missed appointment doesn&apos;t just cost you the service fee — it wastes staff time, prevents other clients from booking, and disrupts your entire schedule.
              </p>
              <p>
                A clear cancellation policy sets expectations from the moment a client books. When people know there are consequences for missing an appointment, they&apos;re significantly more likely to show up or cancel in advance so you can fill the slot.
              </p>
              <p>
                The most effective approach to no-shows is prevention, not punishment. Combine your cancellation policy with proactive appointment reminders — whether that&apos;s <Link href="/tools/appointment-reminder-text" className="text-[#0f766e] underline hover:no-underline">SMS reminders</Link>, <Link href="/tools/appointment-reminder-cards" className="text-[#0f766e] underline hover:no-underline">physical reminder cards</Link>, or automated AI phone calls. Businesses that use both a clear policy and automated reminders see no-show rates drop by 40-60%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO: Industry No-Show Benchmarks */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Data</p>
            <h2 className="font-display text-3xl sm:text-4xl">No-show rates by industry</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#0f1f1a]">🏥 Healthcare &amp; Dental</h3>
              <p className="mt-1 text-3xl font-bold text-[#0f766e]">15-23%</p>
              <p className="mt-2 text-sm text-[#0f1f1a]/60">Medical offices and dental practices see some of the highest no-show rates. Long wait times for new appointments and insurance complexities contribute to cancellations.</p>
            </div>
            <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#0f1f1a]">✂️ Salons &amp; Spas</h3>
              <p className="mt-1 text-3xl font-bold text-[#0f766e]">15-20%</p>
              <p className="mt-2 text-sm text-[#0f1f1a]/60">Salon no-shows are particularly costly because stylists work on commission. A missed color appointment that blocks 2-3 hours of chair time can cost $150-400 in lost revenue.</p>
            </div>
            <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#0f1f1a]">💪 Fitness &amp; Training</h3>
              <p className="mt-1 text-3xl font-bold text-[#0f766e]">20-30%</p>
              <p className="mt-2 text-sm text-[#0f1f1a]/60">Personal training sessions and group fitness classes have the highest no-show rates. Motivation fluctuations and &ldquo;I&apos;ll go next time&rdquo; thinking are common culprits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO: How to Enforce Without Losing Clients */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.45fr_0.55fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Strategy</p>
              <h2 className="font-display text-3xl sm:text-4xl">How to enforce your policy without losing clients</h2>
            </div>
            <div className="space-y-4 text-[#0f1f1a]/70">
              <p>
                <strong>Communicate early and often.</strong> Share your policy at booking, in confirmation emails, and on your website. Clients who are informed upfront rarely feel blindsided when a fee is applied.
              </p>
              <p>
                <strong>Give a grace period for first-time offenders.</strong> Waiving the fee the first time — while clearly explaining the policy — builds goodwill and gives clients a chance to adjust their behavior.
              </p>
              <p>
                <strong>Focus on prevention, not punishment.</strong> The goal isn&apos;t to collect fees — it&apos;s to get clients to show up. Automated reminders via <Link href="/tools/appointment-reminder-template" className="text-[#0f766e] underline hover:no-underline">SMS, email, or phone</Link> dramatically reduce no-shows and make enforcement less necessary.
              </p>
              <p>
                <strong>Use empathetic language.</strong> Frame the policy as protecting all clients&apos; access to appointments, not as punishment. &ldquo;We want to make sure every client can access the time they need&rdquo; lands better than &ldquo;You will be charged.&rdquo;
              </p>
              <p>
                <strong>Make rescheduling easy.</strong> If it&apos;s easier to reschedule than to no-show, clients will choose rescheduling. Provide multiple channels (phone, text, online) for changes.
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
          <h2 className="font-display text-3xl sm:text-4xl">A policy handles no-shows after they happen. OneSpec prevents them.</h2>
          <p className="mt-4 text-[#0f1f1a]/70">OneSpec makes AI-powered reminder calls before every appointment. Customers confirm, cancel, or reschedule — so your calendar stays full and you rarely need to enforce that policy.</p>
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
