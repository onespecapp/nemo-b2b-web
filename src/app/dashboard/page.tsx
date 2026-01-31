import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Fetch stats
  const { count: customerCount } = await supabase
    .from('b2b_customers')
    .select('*', { count: 'exact', head: true })
  
  const { count: appointmentCount } = await supabase
    .from('b2b_appointments')
    .select('*', { count: 'exact', head: true })
    .gte('scheduled_at', new Date().toISOString())
  
  const { data: upcomingAppointments } = await supabase
    .from('b2b_appointments')
    .select(`
      *,
      customer:b2b_customers(name, phone)
    `)
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(5)

  const stats = [
    {
      label: 'Total Customers',
      value: customerCount || 0,
      change: '+12%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      href: '/dashboard/customers',
    },
    {
      label: 'Upcoming',
      value: appointmentCount || 0,
      change: 'Next 7 days',
      changeType: 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/dashboard/appointments',
    },
    {
      label: 'Calls Today',
      value: 0,
      change: 'Scheduled',
      changeType: 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      href: '/dashboard/appointments',
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <Link
            key={i}
            href={stat.href}
            className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
                {stat.icon}
              </div>
              <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                stat.changeType === 'positive' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/customers"
          className="flex items-center gap-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-lg">Add Customer</div>
            <div className="text-blue-100 text-sm">Create a new customer profile</div>
          </div>
        </Link>
        
        <Link
          href="/dashboard/appointments"
          className="flex items-center gap-4 bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-lg text-gray-900">Schedule Appointment</div>
            <div className="text-gray-500 text-sm">Book a new appointment</div>
          </div>
        </Link>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
          <Link href="/dashboard/appointments" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View all →
          </Link>
        </div>
        
        {upcomingAppointments && upcomingAppointments.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {upcomingAppointments.map((appointment) => (
              <li key={appointment.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{appointment.title}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {appointment.customer?.name} • {appointment.customer?.phone}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(appointment.scheduled_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(appointment.scheduled_at).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      Call scheduled
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-gray-900 font-medium mb-1">No upcoming appointments</h4>
            <p className="text-gray-500 text-sm mb-4">Get started by scheduling your first appointment</p>
            <Link 
              href="/dashboard/appointments" 
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create appointment
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
