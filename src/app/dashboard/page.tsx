import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const parseUTCDate = (dateStr: string): Date => {
  if (!dateStr.endsWith('Z') && !dateStr.includes('+')) {
    return new Date(dateStr + 'Z')
  }
  return new Date(dateStr)
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let businessId: string | null = null
  let businessTimezone = 'America/Los_Angeles'
  if (user) {
    const { data: business } = await supabase
      .from('b2b_businesses')
      .select('id, timezone')
      .eq('owner_id', user.id)
      .single()

    businessId = business?.id ?? null
    businessTimezone = business?.timezone || 'America/Los_Angeles'
  }

  const { count: customerCount } = businessId
    ? await supabase
      .from('b2b_customers')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
    : { count: 0 }

  const { count: appointmentCount } = businessId
    ? await supabase
      .from('b2b_appointments')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .gte('scheduled_at', new Date().toISOString())
    : { count: 0 }

  const { data: upcomingAppointments } = businessId
    ? await supabase
      .from('b2b_appointments')
      .select(`
        *,
        customer:b2b_customers(name, phone)
      `)
      .eq('business_id', businessId)
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(5)
    : { data: [] }

  const stats = [
    {
      label: 'Customers',
      value: customerCount || 0,
      meta: 'Active profiles',
      href: '/dashboard/customers',
    },
    {
      label: 'Upcoming appointments',
      value: appointmentCount || 0,
      meta: 'Next 7 days',
      href: '/dashboard/appointments',
    },
    {
      label: 'Calls scheduled',
      value: 0,
      meta: 'Today',
      href: '/dashboard/calls',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Overview</p>
        <h1 className="font-display text-3xl sm:text-4xl">Welcome back</h1>
        <p className="text-sm text-[#0f1f1a]/60">
          Here&apos;s how your appointment pipeline looks today.
        </p>
      </div>

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

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl">Upcoming appointments</h2>
              <p className="text-sm text-[#0f1f1a]/60">Next 5 scheduled reminders.</p>
            </div>
            <Link href="/dashboard/appointments" className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0f1f1a]/60">
              View all
            </Link>
          </div>

          {upcomingAppointments && upcomingAppointments.length > 0 ? (
            <div className="mt-6 space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-[#0f1f1a]">{appointment.title}</div>
                      <div className="text-xs text-[#0f1f1a]/60">
                        {appointment.customer?.name} • {appointment.customer?.phone}
                      </div>
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
            <div className="mt-6 rounded-2xl border border-dashed border-[#0f1f1a]/20 bg-[#f8f5ef] px-6 py-8 text-center">
              <p className="text-sm text-[#0f1f1a]/60">No upcoming appointments yet.</p>
              <Link href="/dashboard/appointments" className="mt-3 inline-flex items-center justify-center rounded-full bg-[#0f1f1a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Create appointment
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-[#0f1f1a]/10 bg-[#0f1f1a] p-6 text-white shadow-lg">
            <div className="text-xs uppercase tracking-[0.3em] text-white/60">Quick actions</div>
            <h3 className="mt-3 font-display text-2xl">Keep your calendar full.</h3>
            <p className="mt-2 text-sm text-white/70">
              Add customers or schedule appointments in seconds.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/dashboard/customers" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0f1f1a]">
                Add customer
              </Link>
              <Link href="/dashboard/appointments" className="rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white">
                Schedule appointment
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
            <div className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Insights</div>
            <h3 className="mt-3 font-display text-2xl">Stay ahead of no-shows.</h3>
            <p className="mt-2 text-sm text-[#0f1f1a]/60">
              Review call outcomes and confirmations inside Call History.
            </p>
            <Link href="/dashboard/calls" className="mt-5 inline-flex items-center text-sm font-semibold text-[#0f1f1a]">
              View call history →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
