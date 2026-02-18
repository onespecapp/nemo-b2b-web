'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const features = [
  {
    title: 'Answer Every Call',
    description: 'Your AI receptionist picks up 24/7. Greets callers, answers questions, and takes messages when you can\'t.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        <path strokeLinecap="round" d="M14.5 6.2a3.5 3.5 0 013.3 3.3M14.5 3.7a6 6 0 015.8 5.8" />
      </svg>
    ),
  },
  {
    title: 'Book Appointments',
    description: 'Customers book directly through your AI. No phone tag, no double-booking.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="5.5" width="18" height="15" rx="2.5" />
        <path strokeLinecap="round" d="M8 3.5v4M16 3.5v4M3 10h18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 15 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Smart Reminders',
    description: 'Automated phone call reminders reduce no-shows by up to 50%.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5v4.8l3.2 1.9" />
      </svg>
    ),
  },
  {
    title: 'Win Back Customers',
    description: 'Re-engagement campaigns bring lapsed customers back with a friendly AI call.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
  },
  {
    title: 'Message Inbox',
    description: 'Every message, transcribed and organized. Never lose a lead.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    title: 'Your Voice, Your Brand',
    description: 'Choose from 5 AI voices. Custom greetings. Sounds like your front desk.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
]

const testimonials = [
  {
    name: 'Dr. Priya Sharma',
    business: 'Main Street Dental',
    location: 'Mount Pleasant',
    initials: 'PS',
    quote: 'Our no-show rate dropped by nearly half in the first month. The calls sound so natural that patients think it\'s our receptionist.',
  },
  {
    name: 'Liam Chen',
    business: 'Westside Barber Co.',
    location: 'Kitsilano',
    initials: 'LC',
    quote: 'I used to spend my mornings calling clients to confirm. Now OneSpec handles it and I can focus on cutting hair.',
  },
  {
    name: 'Angela Torres',
    business: 'Paws & Claws Grooming',
    location: 'Burnaby',
    initials: 'AT',
    quote: 'Pet parents love getting a friendly reminder call. We\'ve recovered at least 8 slots a week that would have been no-shows.',
  },
  {
    name: 'Marcus Johnson',
    business: 'Peak Performance Fitness',
    location: 'North Vancouver',
    initials: 'MJ',
    quote: 'Setup took five minutes. Now every personal training session gets confirmed automatically. It\'s been a game-changer for our gym.',
  },
]

const faqs = [
  {
    question: 'Do I need new phone numbers?',
    answer: 'No. OneSpec works with your existing numbers and routes calls through SIP.',
  },
  {
    question: 'How long does setup take?',
    answer: 'Most teams are live in under 10 minutes with a quick import and voice selection.',
  },
  {
    question: 'Can I customize the script?',
    answer: 'Yes. Templates and voice preferences let you match your brand tone and policies.',
  },
  {
    question: 'What happens if a customer wants to reschedule?',
    answer: 'OneSpec captures intent and notes the preferred time for your team to follow up.',
  },
  {
    question: 'Is OneSpec compliant with Canadian privacy laws?',
    answer: 'Yes. OneSpec is fully PIPEDA compliant and also meets HIPAA requirements for healthcare providers. Your data is encrypted at rest and in transit.',
  },
  {
    question: 'Do you only serve Vancouver?',
    answer: 'We\'re launching in Greater Vancouver first, but OneSpec works anywhere in Canada and the US. If you have a phone number and appointments, we can help.',
  },
  {
    question: 'What does it cost to get started?',
    answer: 'Starter is free with 50 calls per month and no credit card required. Growth is $99 per month for up to 500 calls, multi-user access, and advanced analytics.',
  },
]

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#0f1f1a]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.22),rgba(248,245,239,0.05)_65%)] blur-3xl" />
          <div className="absolute right-0 top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.25),rgba(248,245,239,0.1)_70%)] blur-2xl" />
          <div className="absolute left-8 bottom-10 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(15,118,110,0.22),rgba(248,245,239,0.05)_65%)] blur-2xl" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,26,0.04),transparent,rgba(15,23,26,0.06))]" />
        </div>

        <header className="relative z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
            <Image src="/logo.png" alt="OneSpec" width={200} height={48} className="w-full max-w-[180px]" priority />

            <nav className="hidden items-center gap-8 text-sm font-medium text-[#0f1f1a]/70 md:flex">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="transition hover:text-[#0f1f1a]">
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden text-sm font-medium text-[#0f1f1a]/70 transition hover:text-[#0f1f1a] sm:inline-flex">
                Sign in
              </Link>
              <Link href="/signup" className="rounded-full bg-[#0f1f1a] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:shadow-xl">
                Start free
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center rounded-lg p-2 text-[#0f1f1a]/70 transition hover:bg-[#0f1f1a]/10 md:hidden"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="border-t border-[#0f1f1a]/10 bg-white/95 backdrop-blur-sm md:hidden">
              <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-base font-medium text-[#0f1f1a]/70 transition hover:bg-[#0f1f1a]/5 hover:text-[#0f1f1a]"
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-[#0f1f1a]/70 transition hover:bg-[#0f1f1a]/5 hover:text-[#0f1f1a] sm:hidden"
                >
                  Sign in
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* Hero */}
        <section className="relative z-10 px-4 pb-20 pt-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0f1f1a]/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f1f1a]/70 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#0f766e]" />
                AI receptionist for appointment-based businesses
              </div>

              <div className="space-y-6">
                <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
                  Your AI Receptionist.
                  <span className="block text-[#0f766e]">Always On.</span>
                </h1>
                <p className="text-lg text-[#0f1f1a]/70 sm:text-xl">
                  Answer every call. Book appointments. Send reminders. Never miss a customer.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-[#f97316] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5">
                  Start Free
                </Link>
                <a href="#features" className="inline-flex items-center justify-center rounded-full border border-[#0f1f1a]/20 px-6 py-3 text-base font-semibold text-[#0f1f1a] transition hover:border-[#0f1f1a]/40">
                  See how it works
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-[#0f1f1a]/60">
                <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#0f766e]" />
                  24/7 call answering
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#f97316]" />
                  Starts free, scales to $99/month
                </div>
              </div>
            </div>

            <div className="relative animate-fade-up" style={{ animationDelay: '120ms' }}>
              <div className="absolute -left-6 top-8 h-20 w-20 rounded-3xl bg-[#0f766e]/20 blur-xl animate-float" />
              <div className="absolute -right-6 bottom-6 h-16 w-16 rounded-full bg-[#f97316]/30 blur-xl animate-float" style={{ animationDelay: '1.5s' }} />

              <div className="rounded-[28px] border border-white/40 bg-[#0f1f1a] p-6 text-white shadow-2xl shadow-black/25">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
                  <span>Inbound call — live</span>
                  <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-emerald-200">Active</span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-sm font-semibold">Incoming Call</div>
                    <div className="mt-2 text-xs text-white/60">+1 (604) 555-0192 • New caller</div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-white/80">Status</span>
                      <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-200">Answering</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#111f1c] p-4">
                    <p className="text-sm text-white/80">&quot;Hi, thanks for calling Bloom Dental! I can help you book an appointment, answer questions, or take a message. How can I help?&quot;</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                      <span>Voice: Aoede</span>
                      <span>AI Receptionist</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4 text-center">
                    <div className="text-xs uppercase text-white/50">Calls today</div>
                    <div className="mt-2 text-2xl font-semibold">46</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 text-center">
                    <div className="text-xs uppercase text-white/50">Booked</div>
                    <div className="mt-2 text-2xl font-semibold">12</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 text-center">
                    <div className="text-xs uppercase text-white/50">Messages</div>
                    <div className="mt-2 text-2xl font-semibold">8</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Stats bar */}
      <section className="border-y border-[#0f1f1a]/10 bg-white/70 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
          <div className="min-w-[180px]">
            <div className="text-3xl font-semibold text-[#0f1f1a]">24/7</div>
            <div className="text-sm text-[#0f1f1a]/60">Always answering, never a missed call</div>
          </div>
          <div className="min-w-[180px]">
            <div className="text-3xl font-semibold text-[#0f1f1a]">50%</div>
            <div className="text-sm text-[#0f1f1a]/60">Fewer no-shows in the first month</div>
          </div>
          <div className="min-w-[180px]">
            <div className="text-3xl font-semibold text-[#0f1f1a]">3 min</div>
            <div className="text-sm text-[#0f1f1a]/60">To set up and go live</div>
          </div>
          <div className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] px-5 py-4 text-sm text-[#0f1f1a]/70">
            Trusted by clinics, salons, and service teams across Greater Vancouver.
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.45fr_0.55fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">How it works</p>
              <h2 className="font-display text-3xl sm:text-4xl">Set it once. Never miss a call again.</h2>
              <p className="text-base text-[#0f1f1a]/70">
                Your AI receptionist answers calls, books appointments, sends reminders, and takes messages — so your team can focus on what they do best.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { title: 'Connect your number', description: 'Forward your business line to OneSpec. Pick your AI voice and set your hours.' },
                { title: 'AI answers every call', description: 'Your receptionist greets callers, answers FAQs, books appointments, and takes messages.' },
                { title: 'Stay in the loop', description: 'Get transcripts, messages, and booking confirmations in your dashboard instantly.' },
              ].map((step, index) => (
                <div key={step.title} className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0f1f1a] text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-[#0f1f1a]">{step.title}</h3>
                  <p className="mt-3 text-sm text-[#0f1f1a]/60">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Features</p>
              <h2 className="font-display text-3xl sm:text-4xl">Everything your front desk does. Automated.</h2>
            </div>
            <div className="rounded-full border border-[#0f1f1a]/10 bg-white px-5 py-2 text-sm text-[#0f1f1a]/70">
              Calls, bookings, reminders, and messages in one place
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group rounded-3xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${index === 0 ? 'border-[#0f766e]/30 bg-[#f7fffd]' : 'border-[#0f1f1a]/10 bg-white'}`}
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${index === 0 ? 'bg-[#0f766e]/15 text-[#0f766e]' : 'bg-[#f97316]/15 text-[#0f1f1a]'}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#0f1f1a]">{feature.title}</h3>
                <p className="mt-3 text-sm text-[#0f1f1a]/60">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#0f1f1a]/10 bg-white/80 px-5 py-4 sm:flex-row sm:items-center">
            <div className="inline-flex items-center gap-2 text-sm text-[#0f1f1a]/70">
              <span className="h-2 w-2 rounded-full bg-[#0f766e]" />
              Never miss a call or a customer again
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-[#0f1f1a] px-4 py-2 text-sm font-semibold text-white">
                Start free
              </Link>
              <a href="#pricing" className="inline-flex items-center justify-center rounded-full border border-[#0f1f1a]/20 px-4 py-2 text-sm font-semibold text-[#0f1f1a]">
                See pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Testimonials</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">What Vancouver businesses are saying.</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm">
                <p className="text-base text-[#0f1f1a]/80">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f766e]/15 text-sm font-semibold text-[#0f766e]">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#0f1f1a]">{t.name}</div>
                    <div className="text-sm text-[#0f1f1a]/60">{t.business} · {t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Pricing</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">Simple pricing that grows with your volume.</h2>
            <p className="mt-3 text-[#0f1f1a]/60">Start free with no credit card, then upgrade to Growth for $99 per month.</p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                name: 'Starter',
                price: 'Free',
                detail: 'Best for testing call quality',
                features: ['50 calls / month', 'AI receptionist', 'Message inbox', 'Email support'],
                cta: 'Start free',
                highlight: false,
              },
              {
                name: 'Growth',
                price: '$99 per month',
                detail: 'Most popular for busy appointment teams',
                features: ['500 calls / month', 'Multi-user access', 'Advanced analytics', 'Custom greetings & FAQs'],
                cta: 'Choose Growth',
                highlight: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                detail: 'For multi-location organizations',
                features: ['Unlimited calls', 'Dedicated success', 'PIPEDA + HIPAA compliance', 'Custom integrations'],
                cta: 'Talk to sales',
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl border p-6 shadow-sm ${plan.highlight ? 'border-[#0f1f1a] bg-[#0f1f1a] text-white' : 'border-[#0f1f1a]/10 bg-white'}`}
              >
                <div className="text-sm uppercase tracking-[0.3em] text-current/60">{plan.name}</div>
                <div className="mt-4 text-3xl font-semibold">{plan.price}</div>
                <div className="mt-2 text-sm text-current/70">{plan.detail}</div>
                <div className="mt-6 space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${plan.highlight ? 'bg-[#f97316]' : 'bg-[#0f1f1a]'}`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/signup"
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold transition ${plan.highlight ? 'bg-white text-[#0f1f1a]' : 'bg-[#0f1f1a] text-white'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">FAQ</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">Questions before you launch.</h2>
          </div>
          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-[#0f1f1a]/10 bg-white p-6">
                <div className="text-base font-semibold text-[#0f1f1a]">{faq.question}</div>
                <div className="mt-2 text-sm text-[#0f1f1a]/60">{faq.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[36px] border border-[#0f1f1a]/10 bg-gradient-to-br from-[#f97316]/20 via-white to-[#0f766e]/15 p-12 text-center shadow-lg">
          <h2 className="font-display text-3xl sm:text-4xl">Your AI receptionist is ready to answer.</h2>
          <p className="mt-4 text-[#0f1f1a]/70">
            Launch in minutes, start free with no card, and never miss a customer again.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup" className="rounded-full bg-[#0f1f1a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/15">
              Start Free
            </Link>
            <Link href="/login" className="rounded-full border border-[#0f1f1a]/20 px-6 py-3 text-sm font-semibold text-[#0f1f1a]">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#0f1f1a]/10 bg-white/70 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-4">
              <Image src="/logo.png" alt="OneSpec" width={160} height={40} className="w-full max-w-[140px]" />
              <p className="text-sm text-[#0f1f1a]/60">
                AI receptionist that answers calls, books appointments, and sends reminders.
              </p>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/50">Product</div>
              <div className="mt-4 space-y-3 text-sm text-[#0f1f1a]/70">
                <a href="#features" className="block hover:text-[#0f1f1a]">Features</a>
                <a href="#how" className="block hover:text-[#0f1f1a]">How it works</a>
                <a href="#pricing" className="block hover:text-[#0f1f1a]">Pricing</a>
                <a href="#faq" className="block hover:text-[#0f1f1a]">FAQ</a>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/50">Free Tools</div>
              <div className="mt-4 space-y-3 text-sm text-[#0f1f1a]/70">
                <Link href="/tools/appointment-reminder-template" className="block hover:text-[#0f1f1a]">Reminder Template Generator</Link>
              </div>
            </div>

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

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/50">Contact</div>
              <div className="mt-4 space-y-3 text-sm text-[#0f1f1a]/70">
                <a href="mailto:info@onespec.io" className="block hover:text-[#0f1f1a]">info@onespec.io</a>
                <div>Greater Vancouver, BC, Canada</div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#0f1f1a]/10 pt-6 text-sm text-[#0f1f1a]/50">
            <div>© 2026 OneSpec. All rights reserved.</div>
            <div>Made in Vancouver, BC</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
