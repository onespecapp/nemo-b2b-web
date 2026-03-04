'use client'

import { useState } from 'react'
import Link from 'next/link'

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#results', label: 'Results' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

const services = [
  {
    title: 'AI Strategy & Roadmapping',
    description: 'We assess your operations, data, and goals to build a prioritized AI roadmap that delivers measurable ROI.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-1.5M12 12.75l3-1.5m0 0l3-1.5M12 12.75V18" />
      </svg>
    ),
  },
  {
    title: 'Custom AI Development',
    description: 'From intelligent agents and LLM pipelines to computer vision and NLP — we build production-grade AI systems tailored to your business.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    title: 'AI Integration & Deployment',
    description: 'We integrate AI into your existing tech stack — CRMs, ERPs, data warehouses — and deploy to production with monitoring and guardrails.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: 'Ongoing Support & Optimization',
    description: 'Post-launch, we monitor performance, retrain models, and continuously optimize to keep your AI systems ahead of the curve.',
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
      </svg>
    ),
  },
]

const processSteps = [
  { step: '01', title: 'Discovery', description: 'We audit your workflows, data infrastructure, and business goals to identify the highest-impact AI opportunities.' },
  { step: '02', title: 'Strategy', description: 'We design a phased roadmap with clear milestones, timelines, and expected outcomes for each initiative.' },
  { step: '03', title: 'Build & Deploy', description: 'Our engineers build, test, and deploy production-ready AI systems integrated with your existing stack.' },
  { step: '04', title: 'Measure & Optimize', description: 'We track performance against KPIs, iterate on models, and scale what works across your organization.' },
]

const caseStudies = [
  {
    industry: 'Healthcare',
    challenge: 'A regional health network needed to reduce patient intake processing time across 12 clinics.',
    outcome: 'Deployed an AI-powered document processing system that cut intake time by 65% and reduced data entry errors by 90%.',
    tag: 'Document AI',
  },
  {
    industry: 'Financial Services',
    challenge: 'A mid-size lending company struggled with manual underwriting reviews taking 5+ days per application.',
    outcome: 'Built a custom risk assessment model that reduced review time to under 4 hours while improving accuracy by 30%.',
    tag: 'Predictive Analytics',
  },
  {
    industry: 'Retail & E-Commerce',
    challenge: 'A national retailer wanted to personalize customer support across 2M+ monthly interactions.',
    outcome: 'Implemented an AI agent system that handles 70% of support queries autonomously with a 94% satisfaction rate.',
    tag: 'Conversational AI',
  },
]

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#0f172a]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <img src="/logo.png" alt="OneSpec" className="h-10 w-auto" />

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-[#0f172a]">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-medium text-slate-500 transition hover:text-[#0f172a] sm:inline-flex">
              Sign in
            </Link>
            <a href="#contact" className="rounded-full bg-[#4f46e5] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-[#4338ca] hover:shadow-xl">
              Book a Consultation
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 md:hidden"
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
          <div className="border-t border-slate-200 bg-white md:hidden">
            <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#0f172a]"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#0f172a] sm:hidden"
              >
                Sign in
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-36">
        <div className="absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.08),transparent_65%)] blur-3xl" />
          <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent_70%)] blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center animate-fade-up">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#4f46e5]" />
            AI Consulting & Engineering
          </div>

          <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            AI strategy and engineering
            <span className="block text-[#4f46e5]">for enterprises that move fast.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
            From roadmap to production — we help mid-market and enterprise teams design, build, and deploy AI systems that deliver real business outcomes.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#contact" className="inline-flex items-center justify-center rounded-full bg-[#4f46e5] px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-[#4338ca]">
              Book a Consultation
            </a>
            <a href="#results" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-7 py-3.5 text-base font-semibold text-[#0f172a] transition hover:border-slate-400 hover:bg-slate-50">
              See Our Work
            </a>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Trusted by teams across</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {['Enterprise', 'Healthcare', 'Finance', 'Retail', 'Logistics'].map((industry) => (
              <div key={industry} className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-medium text-slate-500">
                {industry}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">What we do</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">End-to-end AI consulting.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
              We partner with your team from initial assessment through production deployment and beyond.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-[#4f46e5] transition-transform group-hover:scale-105">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#0f172a]">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="bg-[#0f172a] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">How we work</p>
            <h2 className="mt-4 font-display text-3xl text-white sm:text-4xl">A proven process, tailored to you.</h2>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <div key={step.step} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 text-3xl font-bold text-[#6366f1]">{step.step}</div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results / Metrics */}
      <section id="results" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Results</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">Numbers that speak for themselves.</h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              { stat: '40+', label: 'AI solutions deployed across industries' },
              { stat: '3x', label: 'Average ROI for our clients' },
              { stat: '<90 days', label: 'From kickoff to production' },
            ].map((item) => (
              <div key={item.stat} className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="text-4xl font-bold text-[#4f46e5]">{item.stat}</div>
                <div className="mt-3 text-sm text-slate-600">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Case Studies */}
          <div className="mt-20">
            <h3 className="text-center font-display text-2xl sm:text-3xl">Selected case studies.</h3>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {caseStudies.map((study) => (
                <div key={study.industry} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#0f172a]">{study.industry}</span>
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-[#4f46e5]">{study.tag}</span>
                  </div>
                  <p className="text-sm text-slate-500"><span className="font-medium text-slate-700">Challenge:</span> {study.challenge}</p>
                  <p className="mt-3 text-sm text-slate-500"><span className="font-medium text-slate-700">Outcome:</span> {study.outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-y border-slate-200 bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">About</p>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl">Built by operators, not just engineers.</h2>
          <p className="mt-6 text-base leading-relaxed text-slate-600">
            OneSpec was founded on a simple belief: AI should create measurable business value, not just impressive demos. Our team blends deep technical expertise in machine learning, data engineering, and software architecture with hands-on experience running businesses and scaling operations. We build AI that works in the real world.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-12 text-center shadow-lg sm:p-16">
          <h2 className="font-display text-3xl sm:text-4xl">Ready to bring AI into your business?</h2>
          <p className="mt-4 text-slate-600">
            Book a free consultation to discuss your goals and explore how AI can transform your operations.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="mailto:info@onespec.io" className="inline-flex items-center justify-center rounded-full bg-[#4f46e5] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-[#4338ca]">
              Book a Consultation
            </a>
            <a href="mailto:info@onespec.io" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-7 py-3.5 text-sm font-semibold text-[#0f172a] transition hover:border-slate-400 hover:bg-slate-50">
              info@onespec.io
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <img src="/logo.png" alt="OneSpec" className="h-9 w-auto" />
              <p className="text-sm text-slate-500">
                AI consulting and engineering for mid-market and enterprise teams.
              </p>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Company</div>
              <div className="mt-4 space-y-3 text-sm text-slate-500">
                <a href="#services" className="block hover:text-[#0f172a]">Services</a>
                <a href="#process" className="block hover:text-[#0f172a]">Process</a>
                <a href="#about" className="block hover:text-[#0f172a]">About</a>
                <a href="#contact" className="block hover:text-[#0f172a]">Contact</a>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Legal</div>
              <div className="mt-4 space-y-3 text-sm text-slate-500">
                <a href="/terms" className="block hover:text-[#0f172a]">Terms of Service</a>
                <a href="/privacy" className="block hover:text-[#0f172a]">Privacy Policy</a>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Contact</div>
              <div className="mt-4 space-y-3 text-sm text-slate-500">
                <a href="mailto:info@onespec.io" className="block hover:text-[#0f172a]">info@onespec.io</a>
                <div>Vancouver, BC, Canada</div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-400">
            <div>&copy; 2026 OneSpec. All rights reserved.</div>
            <div>Vancouver, BC</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
