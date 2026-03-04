import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import CardGenerator from './CardGenerator'

export const metadata: Metadata = {
  title: 'Free Appointment Reminder Card Generator | OneSpec',
  description:
    'Create printable appointment reminder cards for your business. Customize with your business name, service, date, and contact info. Free and instant.',
  alternates: {
    canonical: 'https://onespec.io/tools/appointment-reminder-cards',
  },
  openGraph: {
    title: 'Free Appointment Reminder Card Generator | OneSpec',
    description:
      'Create printable appointment reminder cards for your business. Customize and print instantly.',
    type: 'website',
    url: 'https://onespec.io/tools/appointment-reminder-cards',
    locale: 'en_CA',
  },
}

const faqs = [
  {
    question: 'What are appointment reminder cards?',
    answer:
      'Appointment reminder cards are small printed or digital cards handed to customers after booking an appointment. They include the date, time, service, and business contact information — similar to a business card but specific to their next visit.',
  },
  {
    question: 'Do physical appointment reminder cards still work?',
    answer:
      'Yes. Physical cards are tactile reminders that customers keep in wallets, on fridges, or on desks. Studies show that tangible reminders create stronger memory cues than digital-only notifications, especially for older demographics or clients who prefer less screen time.',
  },
  {
    question: 'What size should an appointment reminder card be?',
    answer:
      'The standard size is 3.5" × 2" (business card size) — it fits in a wallet or pocket. Some businesses use 4" × 6" postcards for mailing. Our generator creates cards optimized for the standard business card format.',
  },
  {
    question: 'Can I use digital appointment reminder cards?',
    answer:
      'Absolutely. You can copy the card text and send it via email, text, or messaging apps. Digital cards are great for eco-conscious businesses and customers who prefer paperless communication.',
  },
  {
    question: 'How do I print appointment reminder cards?',
    answer:
      'Click the "Print Card" button after generating your card. This opens a print-optimized view sized for standard business card stock (3.5" × 2"). You can print on card stock from any office printer or use a professional printing service.',
  },
  {
    question: 'Should I use appointment cards or automated reminders?',
    answer:
      'The best approach is both. Hand a card at checkout for an immediate physical reminder, then follow up with an automated call or text 24-48 hours before the appointment. This layered approach can reduce no-shows by up to 50%.',
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
  name: 'Appointment Reminder Card Generator',
  url: 'https://onespec.io/tools/appointment-reminder-cards',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'All',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
}

export default function AppointmentReminderCardsPage() {
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
            Free Appointment Reminder<span className="block text-[#0f766e]">Card Generator</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#0f1f1a]/70">
            Create professional appointment reminder cards your team can hand to clients at checkout. Customize, preview, then print or copy instantly.
          </p>
        </div>
      </section>

      {/* Generator */}
      <section className="relative z-10 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl"><CardGenerator /></div>
      </section>

      {/* SEO: What Are Appointment Reminder Cards? */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.45fr_0.55fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Guide</p>
              <h2 className="font-display text-3xl sm:text-4xl">What are appointment reminder cards?</h2>
            </div>
            <div className="space-y-4 text-[#0f1f1a]/70">
              <p>
                Appointment reminder cards are small cards — typically business-card sized — that a receptionist or service provider hands to a client after booking their next appointment. They contain the appointment date, time, service details, and the business&apos;s contact information.
              </p>
              <p>
                For decades, appointment cards have been a staple of dental offices, salons, medical clinics, and auto repair shops. Even in the digital age, they serve a unique purpose: a tangible, physical object that sits in a wallet or on a fridge as a constant visual reminder.
              </p>
              <p>
                Research in behavioral psychology shows that physical objects create stronger memory associations than digital notifications alone. A card you can touch and see every time you open your wallet reinforces the appointment in a way that a dismissed push notification cannot.
              </p>
              <p>
                The most effective reminder strategies combine physical cards with digital follow-ups. Hand a card at checkout, then send an automated <Link href="/tools/appointment-reminder-text" className="text-[#0f766e] underline hover:no-underline">SMS reminder</Link> or AI phone call 24 hours before the appointment. This multi-channel approach can reduce no-shows by 40-50%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO: Physical vs Digital */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Comparison</p>
            <h2 className="font-display text-3xl sm:text-4xl">Physical vs. digital appointment reminder cards</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#0f1f1a]">📇 Physical Cards</h3>
              <ul className="mt-4 space-y-2 text-sm text-[#0f1f1a]/70">
                <li>✓ Tangible reminder clients keep in wallets</li>
                <li>✓ Works for all demographics, no tech required</li>
                <li>✓ Reinforces your brand with every glance</li>
                <li>✓ Personal touch at checkout builds relationships</li>
                <li>△ Can be lost or forgotten at home</li>
                <li>△ Cost of card stock and printing</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#0f1f1a]">📱 Digital Cards</h3>
              <ul className="mt-4 space-y-2 text-sm text-[#0f1f1a]/70">
                <li>✓ Instantly shareable via text or email</li>
                <li>✓ Zero printing costs, eco-friendly</li>
                <li>✓ Easy to update if appointment changes</li>
                <li>✓ Can include links to reschedule online</li>
                <li>△ Easily lost in message threads</li>
                <li>△ No physical memory cue</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SEO: Best Practices */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.45fr_0.55fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Tips</p>
              <h2 className="font-display text-3xl sm:text-4xl">Best practices for appointment reminder cards</h2>
            </div>
            <div className="space-y-4 text-[#0f1f1a]/70">
              <p><strong>Keep it clear and scannable.</strong> The date, time, and service should be the most prominent information. Avoid cluttering the card with excessive text or fine print.</p>
              <p><strong>Include your phone number prominently.</strong> Make it effortless for clients to call and reschedule. A visible phone number reduces the chance they simply no-show instead of cancelling.</p>
              <p><strong>Add your cancellation policy.</strong> A brief note like &ldquo;Please call 24 hours in advance to reschedule&rdquo; sets expectations. Need a full policy? Use our <Link href="/tools/no-show-cancellation-policy" className="text-[#0f766e] underline hover:no-underline">cancellation policy generator</Link>.</p>
              <p><strong>Hand the card directly to the client.</strong> Don&apos;t leave cards on the counter — the personal handoff creates a moment of acknowledgment that reinforces the commitment to the appointment.</p>
              <p><strong>Use quality card stock.</strong> A flimsy card gets thrown away. Thick, professional card stock signals that your business takes appointments seriously.</p>
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
          <h2 className="font-display text-3xl sm:text-4xl">Automate your reminders with AI phone calls</h2>
          <p className="mt-4 text-[#0f1f1a]/70">Cards are great for the checkout counter. But for the day before? OneSpec calls every customer automatically, captures confirmations, and flags reschedules — so your team keeps calendars full.</p>
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
