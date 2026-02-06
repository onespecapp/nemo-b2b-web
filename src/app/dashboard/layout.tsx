'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
      setLoading(false)
    }
    getUser()
  }, [router, supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navLinks = [
    { href: '/dashboard', label: 'Overview', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { href: '/dashboard/customers', label: 'Customers', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )},
    { href: '/dashboard/appointments', label: 'Appointments', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { href: '/dashboard/calls', label: 'Call History', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    )},
    { href: '/dashboard/campaigns', label: 'Campaigns', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    )},
    { href: '/dashboard/settings', label: 'Settings', icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#0f1f1a]/20 border-t-[#f97316]" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#0f1f1a]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(15,118,110,0.18),rgba(248,245,239,0.02)_65%)] blur-3xl" />
        <div className="absolute right-10 top-32 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.22),rgba(248,245,239,0.05)_65%)] blur-2xl" />
      </div>

      <div className="relative">
        <header className="lg:hidden border-b border-[#0f1f1a]/10 bg-white/80 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl border border-[#0f1f1a]/10 bg-white px-3 py-2 text-[#0f1f1a] shadow-sm"
            >
              {mobileMenuOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <Link href="/dashboard">
              <Image src="/logo.png" alt="OneSpec" width={200} height={48} className="w-full max-w-[180px]" />
            </Link>
            <button
              onClick={handleSignOut}
              className="rounded-xl border border-[#0f1f1a]/10 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/70"
            >
              Logout
            </button>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[#0f1f1a]/10 bg-white/95 px-4 pb-4">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    pathname === link.href
                      ? 'bg-[#0f1f1a] text-white shadow'
                      : 'bg-white text-[#0f1f1a]/70 hover:bg-[#0f1f1a]/5'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] px-4 py-3 text-xs text-[#0f1f1a]/70">
              Signed in as {user.email}
            </div>
          </div>
        )}

        <div className="lg:flex lg:min-h-screen">
          <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:gap-6 lg:border-r lg:border-[#0f1f1a]/10 lg:bg-white/70 lg:px-6 lg:py-8">
            <Link href="/dashboard">
              <Image src="/logo.png" alt="OneSpec" width={250} height={60} className="w-full max-w-[220px]" />
            </Link>

            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    pathname === link.href
                      ? 'bg-[#0f1f1a] text-white shadow-lg shadow-black/20'
                      : 'text-[#0f1f1a]/70 hover:bg-[#0f1f1a]/5'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] p-4 text-sm text-[#0f1f1a]/70">
              <div className="text-xs uppercase tracking-[0.25em] text-[#0f1f1a]/40">Signed in</div>
              <div className="mt-2 font-medium text-[#0f1f1a] truncate">{user.email}</div>
              <button
                onClick={handleSignOut}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-[#0f1f1a]/15 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/70 transition hover:border-[#0f1f1a]/30"
              >
                Sign out
              </button>
            </div>
          </aside>

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-6xl space-y-6">
              {children}
            </div>
          </main>
        </div>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#0f1f1a]/10 bg-white/95 backdrop-blur">
          <div className="grid grid-cols-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-center py-4 ${
                  pathname === link.href
                    ? 'text-[#0f1f1a]'
                    : 'text-[#0f1f1a]/40'
                }`}
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </nav>

        <div className="h-16 lg:hidden" />
      </div>
    </div>
  )
}
