'use client'

import Link from 'next/link'
import { useUser } from '@/lib/context/UserContext'

export default function TrialBanner() {
  const { business } = useUser()

  if (!business) return null

  const { subscription_status, subscription_tier, trial_ends_at } = business

  // Paid users — no banner
  if (subscription_status === 'ACTIVE') return null

  // Canceled subscription
  if (subscription_status === 'CANCELED') {
    return (
      <div className="rounded-2xl border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 text-sm text-[#991b1b]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>Your subscription has been canceled. Subscribe to reactivate your AI receptionist.</span>
          <Link
            href="/dashboard/settings"
            className="rounded-full bg-[#ef4444] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#dc2626]"
          >
            Choose a plan
          </Link>
        </div>
      </div>
    )
  }

  // Trialing
  if (subscription_status === 'TRIALING') {
    let daysRemaining: number | null = null
    if (trial_ends_at) {
      const msLeft = new Date(trial_ends_at).getTime() - Date.now()
      daysRemaining = Math.ceil(msLeft / (1000 * 60 * 60 * 24))
    }

    // Expired trial
    if (daysRemaining !== null && daysRemaining <= 0) {
      return (
        <div className="rounded-2xl border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 text-sm text-[#991b1b]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>Your free trial has ended. Subscribe to reactivate your AI receptionist.</span>
            <Link
              href="/dashboard/settings"
              className="rounded-full bg-[#ef4444] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#dc2626]"
            >
              Choose a plan
            </Link>
          </div>
        </div>
      )
    }

    // Active trial
    if (daysRemaining !== null) {
      return (
        <div className="rounded-2xl border border-[#f97316]/30 bg-[#f97316]/10 px-4 py-3 text-sm text-[#9a3412]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>
              {daysRemaining === 1
                ? '1 day left in your free trial'
                : `${daysRemaining} days left in your free trial`}
            </span>
            <Link
              href="/dashboard/settings"
              className="rounded-full bg-[#f97316] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#ea580c]"
            >
              Upgrade now
            </Link>
          </div>
        </div>
      )
    }
  }

  return null
}
