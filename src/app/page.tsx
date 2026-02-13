'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const stats = [
  { value: '50%', label: 'Fewer no-shows in the first month' },
  { value: '3 min', label: 'To launch your first campaign' },
  { value: '98%', label: 'Call completion rate' },
]

const steps = [
  {
    title: 'Connect your calendar + brand',
    description: 'Create your account, pick your voice, and choose exactly when reminders go out.',
  },
  {
    title: 'Import this week&apos;s schedule',
    description: 'Upload a CSV or add appointments manually in minutes.',
  },
  {
    title: 'OneSpec confirms automatically',
    description: 'Our AI handles reminders, captures outcomes, and flags reschedule requests for fast follow-up.',
  },
]

const features = [
  {
    title: 'Calls that sound like your front desk',
    description: 'Cut manual reminder work while keeping every customer conversation personal.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 14.5v2.2a2 2 0 0 1-2.2 2 13.8 13.8 0 0 1-6-2.2 13.4 13.4 0 0 1-4.1-4.1A13.8 13.8 0 0 1 2 6.4a2 2 0 0 1 2-2.2h2.2a2 2 0 0 1 2 1.7l.4 2.1a2 2 0 0 1-.6 1.9l-1 1a10.9 10.9 0 0 0 4.1 4.1l1-1a2 2 0 0 1 1.9-.6l2.1.4a2 2 0 0 1 1.7 2Z" />
        <path strokeLinecap="round" d="M14.5 6.2a3.5 3.5 0 0 1 3.3 3.3" />
        <path strokeLinecap="round" d="M14.5 3.7a6 6 0 0 1 5.8 5.8" />
      </svg>
    ),
  },
  {
    title: 'Smart timing controls',
    description: 'Reach customers at the right time to reduce day-of no-shows.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5v4.8l3.2 1.9" />
      </svg>
    ),
  },
  {
    title: 'Confirm, cancel, or reschedule requests',
    description: 'Capture outcomes instantly so your team can refill open slots faster.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="5.5" width="18" height="15" rx="2.5" />
        <path strokeLinecap="round" d="M8 3.5v4M16 3.5v4M3 10h18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m9 15 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Every call logged automatically',
    description: 'Track outcomes and transcripts in one dashboard to improve fill rate.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5h6l3 3v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
        <path strokeLinecap="round" d="M12.5 4.5v4h4" />
        <path strokeLinecap="round" d="M9.5 12h5M9.5 15.5h5" />
      </svg>
    ),
  },
  {
    title: 'Security and compliance built in',
    description: 'Protect customer data with enterprise-grade encryption and audit-ready logs.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5 5 6.8v5.4c0 4.4 2.9 7.5 7 8.3 4.1-.8 7-3.9 7-8.3V6.8L12 3.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.3 12.4 1.8 1.8 3.6-3.6" />
      </svg>
    ),
  },
  {
    title: 'Built for busy teams',
    description: 'Keep your front desk aligned with shared templates and role-based permissions.',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="8" cy="9" r="3" />
        <circle cx="16.5" cy="8" r="2.5" />
        <path strokeLinecap="round" d="M3.8 18.5a4.8 4.8 0 0 1 8.4 0M13 18.5a4 4 0 0 1 7 0" />
      </svg>
    ),
  },
]

const industries = [
  { name: 'Barbershops', detail: 'Fill every chair with timely, friendly reminders.' },
  { name: 'Hair Salons', detail: 'Keep your stylists booked and clients confirmed.' },
  { name: 'Dental Offices', detail: 'Reduce missed cleanings and protect your schedule.' },
  { name: 'Medical Clinics', detail: 'Cut no-shows and keep patient flow on track.' },
  { name: 'Auto Repair Shops', detail: 'Confirm drop-offs and reduce last-minute gaps.' },
  { name: 'Pet Groomers', detail: 'Remind pet parents so every slot stays full.' },
  { name: 'Spas + Wellness', detail: 'Gentle, brand-aligned reminders for every booking.' },
  { name: 'Fitness + Training', detail: 'Keep sessions on track and memberships engaged.' },
  { name: 'Tutoring + Education', detail: 'Make sure students and parents never miss a session.' },
  { name: 'Other Services', detail: 'Any appointment-based business can get started in minutes.' },
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

        <section className="relative z-10 px-4 pb-20 pt-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0f1f1a]/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f1f1a]/70 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#f97316]" />
                AI reminder calls for appointment-based teams
              </div>

              <div className="space-y-6">
                <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
                  Stop losing revenue
                  <span className="block text-[#0f766e]">to no-shows.</span>
                </h1>
                <p className="text-lg text-[#0f1f1a]/70 sm:text-xl">
                  OneSpec calls every customer before their visit, captures confirmations instantly, and flags reschedules for follow-up so your team keeps calendars full.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-[#f97316] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5">
                  Start free - no card required
                </Link>
                <a href="#demo" className="inline-flex items-center justify-center rounded-full border border-[#0f1f1a]/20 px-6 py-3 text-base font-semibold text-[#0f1f1a] transition hover:border-[#0f1f1a]/40">
                  Hear how calls sound
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-[#0f1f1a]/60">
                <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#0f766e]" />
                  Up to 50% fewer no-shows
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
                  <span>Live call snapshot</span>
                  <span className="rounded-full bg-white/10 px-2 py-1">02:18</span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-sm font-semibold">Outbound reminder</div>
                    <div className="mt-2 text-xs text-white/60">Bloom Dental • Today 3:30 PM</div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-white/80">Status</span>
                      <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-200">Confirmed</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#111f1c] p-4">
                    <p className="text-sm text-white/80">&quot;Hi Jamie, just confirming your cleaning today at 3:30 PM. Press 1 to confirm or 2 to reschedule.&quot;</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                      <span>Voice: Aoede</span>
                      <span>Outcome saved</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4 text-center">
                    <div className="text-xs uppercase text-white/50">Calls today</div>
                    <div className="mt-2 text-2xl font-semibold">46</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 text-center">
                    <div className="text-xs uppercase text-white/50">Recovered slots</div>
                    <div className="mt-2 text-2xl font-semibold">8</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[#0f1f1a]/10 bg-white/80 p-4 shadow-sm" id="demo">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                  <span>Demo call preview</span>
                  <span className="rounded-full bg-[#0f1f1a]/10 px-2 py-1">00:36</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#f97316]/20" />
                  <div>
                    <div className="text-sm font-semibold">&quot;Hey Alex, it&apos;s OneSpec calling from Solara Spa…&quot;</div>
                    <div className="text-xs text-[#0f1f1a]/60">Tap Play in-app to hear the full call.</div>
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
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-[180px]">
              <div className="text-3xl font-semibold text-[#0f1f1a]">{stat.value}</div>
              <div className="text-sm text-[#0f1f1a]/60">{stat.label}</div>
            </div>
          ))}
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
              <h2 className="font-display text-3xl sm:text-4xl">Set it once. Recover revenue every week.</h2>
              <p className="text-base text-[#0f1f1a]/70">
                Your team stops chasing confirmations. Customers get a call that sounds personal, and you get a fuller schedule.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {steps.map((step, index) => (
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
              <h2 className="font-display text-3xl sm:text-4xl">Everything you need to protect your schedule.</h2>
            </div>
            <div className="rounded-full border border-[#0f1f1a]/10 bg-white px-5 py-2 text-sm text-[#0f1f1a]/70">
              Calls, outcomes, and follow-ups in one place
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
              Up to 50% fewer no-shows in the first month
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

      {/* Industries — expanded */}
      <section id="industries" className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[32px] border border-[#0f1f1a]/10 bg-[#0f1f1a] px-6 py-12 text-white sm:px-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Industries</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">Built for the businesses that live on schedule.</h2>
            <p className="mt-4 text-white/70">
              From Commercial Drive barbershops to Kerrisdale dental offices — OneSpec is tuned for high-volume appointment teams that can&apos;t afford empty slots.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {industries.map((industry) => (
              <div key={industry.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm font-semibold">{industry.name}</div>
                <div className="mt-2 text-sm text-white/60">{industry.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — NEW */}
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
                features: ['50 calls / month', 'Single location', 'Core analytics', 'Email support'],
                cta: 'Start free',
                highlight: false,
              },
              {
                name: 'Growth',
                price: '$99 per month',
                detail: 'Most popular for busy appointment teams',
                features: ['500 calls / month', 'Multi-user access', 'Advanced analytics', 'Custom templates'],
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

      {/* FAQ — expanded */}
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
          <h2 className="font-display text-3xl sm:text-4xl">Turn next week&apos;s schedule into confirmed revenue.</h2>
          <p className="mt-4 text-[#0f1f1a]/70">
            Launch in minutes, start free with no card, and upgrade to $99/month when your call volume grows.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup" className="rounded-full bg-[#0f1f1a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/15">
              Create free account
            </Link>
            <Link href="/login" className="rounded-full border border-[#0f1f1a]/20 px-6 py-3 text-sm font-semibold text-[#0f1f1a]">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer — rebuilt */}
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
                <a href="#features" className="block hover:text-[#0f1f1a]">Features</a>
                <a href="#how" className="block hover:text-[#0f1f1a]">How it works</a>
                <a href="#pricing" className="block hover:text-[#0f1f1a]">Pricing</a>
                <a href="#faq" className="block hover:text-[#0f1f1a]">FAQ</a>
              </div>
            </div>

            {/* Free Tools */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/50">Free Tools</div>
              <div className="mt-4 space-y-3 text-sm text-[#0f1f1a]/70">
                <Link href="/tools/appointment-reminder-template" className="block hover:text-[#0f1f1a]">Reminder Template Generator</Link>
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
            <div>© 2026 OneSpec. All rights reserved.</div>
            <div>Made in Vancouver, BC</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
