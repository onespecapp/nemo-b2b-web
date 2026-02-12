'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// Business category options
const BUSINESS_CATEGORIES = [
  { value: 'BARBERSHOP', label: 'Barbershop' },
  { value: 'SALON', label: 'Hair Salon' },
  { value: 'DENTAL', label: 'Dental Office' },
  { value: 'MEDICAL', label: 'Medical Clinic' },
  { value: 'AUTO_REPAIR', label: 'Auto Repair Shop' },
  { value: 'PET_GROOMING', label: 'Pet Grooming' },
  { value: 'SPA', label: 'Spa & Wellness' },
  { value: 'FITNESS', label: 'Fitness & Training' },
  { value: 'TUTORING', label: 'Tutoring & Education' },
  { value: 'OTHER', label: 'Other' },
]

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessCategory, setBusinessCategory] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!businessCategory) {
      setError('Please select a business category')
      setLoading(false)
      return
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          business_name: businessName,
          business_category: businessCategory,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (authData.user) {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f1f1a] p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#0f766e]/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#f97316]/20 rounded-full blur-3xl" />

        <Link href="/" className="relative z-10">
          <Image src="/logo.png" alt="OneSpec" width={250} height={60} className="w-full max-w-[220px] brightness-0 invert" />
        </Link>

        <div className="relative z-10">
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Create your free account
          </h1>
          <p className="text-white/70 text-lg mb-8">
            No credit card required. Launch in minutes and start recovering appointments this week.
          </p>

          <div className="space-y-4">
            {[
              '50 free calls every month',
              'Human-sounding AI reminder calls',
              'Upgrade to Growth for $99/month when ready',
              'Cancel anytime',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-white/70 text-sm relative z-10">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>256-bit encryption</span>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#f8f5ef]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden mb-8 inline-block">
            <Image src="/logo.png" alt="OneSpec" width={250} height={60} className="w-full max-w-[200px]" />
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#0f1f1a] mb-2">
              Start free in under 3 minutes
            </h2>
            <p className="text-[#0f1f1a]/60">
              No credit card required. Already have an account?{' '}
              <Link href="/login" className="text-[#0f766e] hover:text-[#0f766e]/80 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSignup}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-[#0f1f1a] mb-1.5">
                Business Name
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="block w-full px-4 py-3 bg-white border border-[#0f1f1a]/20 rounded-xl shadow-sm placeholder-[#0f1f1a]/40 focus:outline-none focus:ring-2 focus:ring-[#0f766e] focus:border-[#0f766e] transition-colors"
                placeholder="Your Business Name"
              />
            </div>

            <div>
              <label htmlFor="businessCategory" className="block text-sm font-medium text-[#0f1f1a] mb-1.5">
                Business Type
              </label>
              <select
                id="businessCategory"
                name="businessCategory"
                required
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                className="block w-full px-4 py-3 bg-white border border-[#0f1f1a]/20 rounded-xl shadow-sm text-[#0f1f1a] focus:outline-none focus:ring-2 focus:ring-[#0f766e] focus:border-[#0f766e] transition-colors"
              >
                <option value="">Select your business type...</option>
                {BUSINESS_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-sm text-[#0f1f1a]/50">This helps us customize your reminder calls</p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0f1f1a] mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 bg-white border border-[#0f1f1a]/20 rounded-xl shadow-sm placeholder-[#0f1f1a]/40 focus:outline-none focus:ring-2 focus:ring-[#0f766e] focus:border-[#0f766e] transition-colors"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#0f1f1a] mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-white border border-[#0f1f1a]/20 rounded-xl shadow-sm placeholder-[#0f1f1a]/40 focus:outline-none focus:ring-2 focus:ring-[#0f766e] focus:border-[#0f766e] transition-colors"
                placeholder="••••••••"
              />
              <p className="mt-1.5 text-sm text-[#0f1f1a]/50">At least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-full text-base font-semibold text-white bg-[#0f1f1a] hover:shadow-lg hover:shadow-black/15 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f766e] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create free account'
              )}
            </button>

            <p className="text-center text-xs text-[#0f1f1a]/50">
              By signing up, you agree to our{' '}
              <a href="/terms" className="text-[#0f766e] hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-[#0f766e] hover:underline">Privacy Policy</a>
            </p>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#0f1f1a]/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#f8f5ef] text-[#0f1f1a]/50">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-[#0f1f1a]/20 rounded-full text-sm font-medium text-[#0f1f1a] bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-[#0f1f1a]/20 rounded-full text-sm font-medium text-[#0f1f1a] bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
                Apple
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
