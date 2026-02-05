import Link from 'next/link'

const stats = [
  { value: '50%', label: 'Lower no-show rates' },
  { value: '3 min', label: 'Average setup time' },
  { value: '98%', label: 'Call completion rate' },
]

const steps = [
  {
    title: 'Connect your business',
    description: 'Create your account, set your voice, and choose when reminders go out.',
  },
  {
    title: 'Add customers + appointments',
    description: 'Import a list or add appointments manually in minutes.',
  },
  {
    title: 'OneSpec calls and confirms',
    description: 'Our AI handles reminders, confirmations, and reschedules automatically.',
  },
]

const features = [
  {
    title: 'Human-sounding AI calls',
    description: 'Warm, natural conversations that feel like a real front desk call.',
  },
  {
    title: 'Smart timing controls',
    description: 'Call 24 hours before, morning-of, or custom windows per service.',
  },
  {
    title: 'Confirm or reschedule',
    description: 'Captures outcomes instantly and updates appointment status.',
  },
  {
    title: 'Call logs + transcripts',
    description: 'Review outcomes, durations, and call summaries in your dashboard.',
  },
  {
    title: 'Secure by design',
    description: 'Supabase-backed data with row-level security and audit-ready logs.',
  },
  {
    title: 'Team-ready workflows',
    description: 'Multi-user access, templates, and category-specific scripts.',
  },
]

const industries = [
  { name: 'Dental + Medical', detail: 'Reduce missed appointments and protect schedules.' },
  { name: 'Salons + Spas', detail: 'Keep chairs full with gentle, brand-aligned reminders.' },
  { name: 'Auto + Repair', detail: 'Confirm drop-offs and reduce last-minute gaps.' },
  { name: 'Fitness + Coaching', detail: 'Keep sessions on track and memberships engaged.' },
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
]

export default function HomePage() {
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
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f1f1a] text-white shadow-lg shadow-black/20">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg">OneSpec</span>
                <span className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">B2B</span>
              </div>
            </div>

            <nav className="hidden items-center gap-8 text-sm font-medium text-[#0f1f1a]/70 md:flex">
              <a href="#features" className="transition hover:text-[#0f1f1a]">Features</a>
              <a href="#how" className="transition hover:text-[#0f1f1a]">How it works</a>
              <a href="#pricing" className="transition hover:text-[#0f1f1a]">Pricing</a>
              <a href="#faq" className="transition hover:text-[#0f1f1a]">FAQ</a>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden text-sm font-medium text-[#0f1f1a]/70 transition hover:text-[#0f1f1a] sm:inline-flex">
                Sign in
              </Link>
              <Link href="/signup" className="rounded-full bg-[#0f1f1a] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:shadow-xl">
                Start free
              </Link>
            </div>
          </div>
        </header>

        <section className="relative z-10 px-4 pb-20 pt-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0f1f1a]/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f1f1a]/70 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#f97316]" />
                AI voice reminders for busy teams
              </div>

              <div className="space-y-6">
                <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
                  Make every appointment
                  <span className="block text-[#0f766e]">feel personally confirmed.</span>
                </h1>
                <p className="text-lg text-[#0f1f1a]/70 sm:text-xl">
                  OneSpec calls your customers before their visit, confirms attendance, and captures reschedule requests. Your team gets the schedule back without the phone tag.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-full bg-[#f97316] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5">
                  Start free trial
                </Link>
                <a href="#demo" className="inline-flex items-center justify-center rounded-full border border-[#0f1f1a]/20 px-6 py-3 text-base font-semibold text-[#0f1f1a] transition hover:border-[#0f1f1a]/40">
                  Listen to a demo call
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-[#0f1f1a]/60">
                <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#0f766e]" />
                  Avg. 50% fewer no-shows
                </div>
                <div className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#f97316]" />
                  500+ businesses onboarded
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
                    <p className="text-sm text-white/80">“Hi Jamie, just confirming your cleaning today at 3:30 PM. Press 1 to confirm or 2 to reschedule.”</p>
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
                    <div className="text-sm font-semibold">"Hey Alex, it's OneSpec calling from Solara Spa…"</div>
                    <div className="text-xs text-[#0f1f1a]/60">Tap Play in-app to hear the full call.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="border-y border-[#0f1f1a]/10 bg-white/70 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-[180px]">
              <div className="text-3xl font-semibold text-[#0f1f1a]">{stat.value}</div>
              <div className="text-sm text-[#0f1f1a]/60">{stat.label}</div>
            </div>
          ))}
          <div className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] px-5 py-4 text-sm text-[#0f1f1a]/70">
            Trusted by clinics, salons, and service teams across the US.
          </div>
        </div>
      </section>

      <section id="how" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.45fr_0.55fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">How it works</p>
              <h2 className="font-display text-3xl sm:text-4xl">Set it once. OneSpec handles the rest.</h2>
              <p className="text-base text-[#0f1f1a]/70">
                Your team stops chasing confirmations. Customers get a call that sounds personal, not robotic.
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

      <section id="features" className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Features</p>
              <h2 className="font-display text-3xl sm:text-4xl">A full reminder system, not just calls.</h2>
            </div>
            <div className="rounded-full border border-[#0f1f1a]/10 bg-white px-5 py-2 text-sm text-[#0f1f1a]/70">
              Works with LiveKit + Telnyx voice infrastructure
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="group rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 h-12 w-12 rounded-2xl bg-[#f97316]/15" />
                <h3 className="text-lg font-semibold text-[#0f1f1a]">{feature.title}</h3>
                <p className="mt-3 text-sm text-[#0f1f1a]/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[32px] border border-[#0f1f1a]/10 bg-[#0f1f1a] px-6 py-12 text-white sm:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Industries</p>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl">Built for the businesses that live on schedule.</h2>
              <p className="mt-4 text-white/70">
                OneSpec is tuned for high-volume appointment teams that can't afford empty slots.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {industries.map((industry) => (
                <div key={industry.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-sm font-semibold">{industry.name}</div>
                  <div className="mt-2 text-sm text-white/60">{industry.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Pricing</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">Clear tiers for every team size.</h2>
            <p className="mt-3 text-[#0f1f1a]/60">Start free, scale when your call volume grows.</p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                name: 'Starter',
                price: 'Free',
                detail: 'Best for trying OneSpec',
                features: ['50 calls / month', 'Single location', 'Core analytics', 'Email support'],
                cta: 'Get started',
                highlight: false,
              },
              {
                name: 'Growth',
                price: '$49',
                detail: 'For growing practices',
                features: ['500 calls / month', 'Multi-user access', 'Advanced analytics', 'Custom templates'],
                cta: 'Start free trial',
                highlight: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                detail: 'For multi-location orgs',
                features: ['Unlimited calls', 'Dedicated success', 'HIPAA BAA', 'Custom integrations'],
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

      <section id="faq" className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">FAQ</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">Questions we hear a lot.</h2>
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

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[36px] border border-[#0f1f1a]/10 bg-gradient-to-br from-[#f97316]/20 via-white to-[#0f766e]/15 p-12 text-center shadow-lg">
          <h2 className="font-display text-3xl sm:text-4xl">Give your team their time back.</h2>
          <p className="mt-4 text-[#0f1f1a]/70">
            Start for free and see your next week of appointments confirm themselves.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup" className="rounded-full bg-[#0f1f1a] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/15">
              Start free trial
            </Link>
            <Link href="/login" className="rounded-full border border-[#0f1f1a]/20 px-6 py-3 text-sm font-semibold text-[#0f1f1a]">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#0f1f1a]/10 bg-white/70 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 text-sm text-[#0f1f1a]/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#0f1f1a] text-white flex items-center justify-center">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <div className="font-display text-base text-[#0f1f1a]">OneSpec</div>
              <div className="text-xs uppercase tracking-[0.2em]">B2B</div>
            </div>
          </div>
          <div>© 2026 OneSpec. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#features" className="hover:text-[#0f1f1a]">Features</a>
            <a href="#pricing" className="hover:text-[#0f1f1a]">Pricing</a>
            <a href="#faq" className="hover:text-[#0f1f1a]">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
