'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@/lib/context/UserContext'
import { useRealtimeSubscription } from '@/lib/hooks/useRealtimeSubscription'
import { CallVolumeChart, OutcomeBreakdownChart } from '@/components/AnalyticsCharts'

const parseUTCDate = (dateStr: string): Date => {
  if (!dateStr.endsWith('Z') && !dateStr.includes('+')) {
    return new Date(dateStr + 'Z')
  }
  return new Date(dateStr)
}

interface RecentCall {
  id: string
  call_type: string
  call_outcome: string | null
  duration_sec: number | null
  created_at: string
  customer: { name: string; phone: string } | null
}

interface UpcomingAppointment {
  id: string
  title: string
  scheduled_at: string
  customer: { name: string; phone: string } | null
}

export default function DashboardPage() {
  const { business, loading: userLoading } = useUser()
  const supabase = createClient()

  const [callsToday, setCallsToday] = useState<number>(0)
  const [unreadMessages, setUnreadMessages] = useState<number>(0)
  const [appointmentCount, setAppointmentCount] = useState<number>(0)
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([])
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([])
  const [loading, setLoading] = useState(true)
  const [dailyVolume, setDailyVolume] = useState<{ date: string; label: string; count: number }[]>([])
  const [outcomeBreakdown, setOutcomeBreakdown] = useState<{ name: string; value: number }[]>([])
  const [conversionRate, setConversionRate] = useState<number>(0)

  const fetchStats = useCallback(async () => {
    if (!business) return
    setLoading(true)

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const [
      callsTodayResult,
      unreadResult,
      appointmentCountResult,
      upcomingResult,
      recentCallsResult,
      analyticsResult,
    ] = await Promise.all([
      supabase
        .from('b2b_call_logs')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', business.id)
        .eq('call_type', 'INBOUND')
        .gte('created_at', todayStart.toISOString()),
      supabase
        .from('b2b_messages')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', business.id)
        .eq('read', false),
      supabase
        .from('b2b_appointments')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', business.id)
        .gte('scheduled_at', new Date().toISOString()),
      supabase
        .from('b2b_appointments')
        .select('id, title, scheduled_at, customer:b2b_customers(name, phone)')
        .eq('business_id', business.id)
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(5),
      supabase
        .from('b2b_call_logs')
        .select('id, call_type, call_outcome, duration_sec, created_at, customer:b2b_customers(name, phone)')
        .eq('business_id', business.id)
        .eq('call_type', 'INBOUND')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('b2b_call_logs')
        .select('created_at, call_outcome')
        .eq('business_id', business.id)
        .gte('created_at', sevenDaysAgo.toISOString()),
    ])

    setCallsToday(callsTodayResult.count ?? 0)
    setUnreadMessages(unreadResult.count ?? 0)
    setAppointmentCount(appointmentCountResult.count ?? 0)
    setUpcomingAppointments((upcomingResult.data as unknown as UpcomingAppointment[]) ?? [])
    setRecentCalls((recentCallsResult.data as unknown as RecentCall[]) ?? [])

    // Process analytics data
    const calls7d = (analyticsResult.data || []) as { created_at: string; call_outcome: string | null }[]

    // Daily volume
    const dayMap = new Map<string, number>()
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      dayMap.set(key, 0)
    }
    for (const call of calls7d) {
      const key = call.created_at.split('T')[0]
      if (dayMap.has(key)) {
        dayMap.set(key, (dayMap.get(key) || 0) + 1)
      }
    }
    const volumeData = Array.from(dayMap.entries()).map(([date, count]) => {
      const d = new Date(date + 'T12:00:00')
      return {
        date,
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        count,
      }
    })
    setDailyVolume(volumeData)

    // Outcome breakdown
    const outcomeMap = new Map<string, number>()
    let bookedCount = 0
    for (const call of calls7d) {
      const outcome = call.call_outcome || 'UNKNOWN'
      outcomeMap.set(outcome, (outcomeMap.get(outcome) || 0) + 1)
      if (outcome === 'BOOKED') bookedCount++
    }
    const outcomeData = Array.from(outcomeMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
    setOutcomeBreakdown(outcomeData)

    // Conversion rate
    setConversionRate(calls7d.length > 0 ? Math.round((bookedCount / calls7d.length) * 100) : 0)

    setLoading(false)
  }, [business, supabase])

  useEffect(() => {
    if (userLoading) return
    let cancelled = false
    queueMicrotask(() => {
      if (cancelled) return
      if (!business) {
        setLoading(false)
        return
      }
      void fetchStats()
    })
    return () => { cancelled = true }
  }, [business, userLoading, fetchStats])

  useRealtimeSubscription({
    table: 'b2b_call_logs',
    businessId: business?.id,
    events: ['INSERT', 'UPDATE'],
    onChange: fetchStats,
  })
  useRealtimeSubscription({
    table: 'b2b_appointments',
    businessId: business?.id,
    events: ['INSERT', 'UPDATE'],
    onChange: fetchStats,
  })
  useRealtimeSubscription({
    table: 'b2b_messages',
    businessId: business?.id,
    events: ['INSERT'],
    onChange: fetchStats,
  })

  const businessTimezone = business?.timezone || 'America/Los_Angeles'
  const telnyxPhone = business?.telnyx_phone_number ?? null

  const stats = [
    {
      label: 'Calls Today',
      value: callsToday,
      meta: 'Inbound',
      href: '/dashboard/calls',
    },
    {
      label: 'Unread Leads',
      value: unreadMessages,
      meta: 'Needs follow-up',
      href: '/dashboard/messages',
    },
    {
      label: 'Upcoming Appointments',
      value: appointmentCount,
      meta: 'Test drive / service',
      href: '/dashboard/appointments',
    },
  ]

  if (userLoading || loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Overview</p>
          <div className="h-8 w-48 animate-pulse rounded-full bg-[#0f1f1a]/10" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-3xl bg-[#0f1f1a]/5" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Overview</p>
        <h1 className="font-display text-3xl sm:text-4xl">Welcome back</h1>
        <p className="text-sm text-[#0f1f1a]/60">
          Here&apos;s how your dealership AI assistant is performing today.
        </p>
      </div>

      {telnyxPhone && (
        <div className="flex items-center gap-3 rounded-2xl border border-[#0f766e]/20 bg-[#0f766e]/5 px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0f766e]/15">
            <svg className="h-5 w-5 text-[#0f766e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-[#0f766e]/70">Your dealership AI number</p>
            <p className="mt-0.5 text-lg font-semibold text-[#0f766e]">{telnyxPhone}</p>
          </div>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(telnyxPhone)}
            className="shrink-0 rounded-xl border border-[#0f766e]/20 bg-white px-3 py-2 text-xs font-semibold text-[#0f766e] transition hover:bg-[#0f766e]/10"
          >
            Copy
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="text-xs uppercase tracking-[0.25em] text-[#0f1f1a]/50">{stat.label}</div>
            <div className="mt-4 flex items-end justify-between">
              <div className="text-3xl font-semibold text-[#0f1f1a]">{stat.value}</div>
              <span className="rounded-full border border-[#0f1f1a]/10 bg-[#f8f5ef] px-3 py-1 text-xs text-[#0f1f1a]/60">
                {stat.meta}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {(dailyVolume.length > 0 || outcomeBreakdown.length > 0) && (
        <div className="grid gap-6 lg:grid-cols-2">
          <CallVolumeChart data={dailyVolume} />
          <div className="space-y-6">
            <OutcomeBreakdownChart data={outcomeBreakdown} />
            <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.25em] text-[#0f1f1a]/50">Conversion rate</p>
              <h3 className="mt-1 font-display text-xl">Booked / Total (7d)</h3>
              <div className="mt-4 text-4xl font-semibold text-[#0f766e]">{conversionRate}%</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl">Recent inbound calls</h2>
              <p className="text-sm text-[#0f1f1a]/60">Latest calls answered by your AI assistant.</p>
            </div>
            <Link href="/dashboard/calls" className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0f1f1a]/60">
              View all
            </Link>
          </div>

          {recentCalls.length > 0 ? (
            <div className="mt-6 space-y-3">
              {recentCalls.map((call) => (
                <div key={call.id} className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-[#0f1f1a]">
                        {call.customer?.name || 'Unknown caller'}
                      </div>
                      <div className="text-xs text-[#0f1f1a]/60">
                        {call.customer?.phone}
                      </div>
                    </div>
                    <div className="text-right text-xs text-[#0f1f1a]/60">
                      <div>
                        {parseUTCDate(call.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          timeZone: businessTimezone,
                        })}
                      </div>
                      <div>
                        {parseUTCDate(call.created_at).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                          timeZone: businessTimezone,
                        })}
                      </div>
                      {call.call_outcome && (
                        <div className="mt-1 font-semibold text-[#0f1f1a]/80">{call.call_outcome.replace('_', ' ')}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-[#0f1f1a]/20 bg-[#f8f5ef] px-6 py-8 text-center">
              <p className="text-sm text-[#0f1f1a]/60">No inbound calls yet.</p>
              <Link href="/dashboard/receptionist" className="mt-3 inline-flex items-center justify-center rounded-full bg-[#0f1f1a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Configure assistant
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
              <h2 className="font-display text-2xl">Upcoming appointments</h2>
              <p className="text-sm text-[#0f1f1a]/60">Next test drive or service slots.</p>
              </div>
              <Link href="/dashboard/appointments" className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0f1f1a]/60">
                View all
              </Link>
            </div>

            {upcomingAppointments.length > 0 ? (
              <div className="mt-4 space-y-2">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-[#0f1f1a]">{appointment.title}</div>
                        <div className="text-xs text-[#0f1f1a]/60">{appointment.customer?.name}</div>
                      </div>
                      <div className="text-right text-xs text-[#0f1f1a]/60">
                        <div>{parseUTCDate(appointment.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: businessTimezone })}</div>
                        <div>{parseUTCDate(appointment.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: businessTimezone })}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-[#0f1f1a]/20 bg-[#f8f5ef] px-6 py-6 text-center">
                <p className="text-sm text-[#0f1f1a]/60">No upcoming appointments.</p>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-[#0f1f1a]/10 bg-[#0f1f1a] p-6 text-white shadow-lg">
            <div className="text-xs uppercase tracking-[0.3em] text-white/60">Quick actions</div>
            <h3 className="mt-3 font-display text-2xl">Keep your pipeline full.</h3>
            <p className="mt-2 text-sm text-white/70">
              Add leads or schedule appointments in seconds.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/dashboard/customers" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0f1f1a]">
                Add lead
              </Link>
              <Link href="/dashboard/appointments" className="rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white">
                Schedule slot
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
