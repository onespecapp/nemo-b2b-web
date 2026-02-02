'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Customer {
  id: string
  name: string
  phone: string
}

interface Appointment {
  id: string
  title: string
  description?: string
  scheduled_at: string
  reminder_minutes_before: number
  status: string
  customer_id: string
  customer?: Customer
  created_at: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    customer_id: '',
    title: '',
    description: '',
    scheduled_at: '',
    reminder_minutes_before: 30,
  })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const fetchData = useCallback(async () => {
    const [appointmentsRes, customersRes] = await Promise.all([
      supabase
        .from('b2b_appointments')
        .select(`*, customer:b2b_customers(id, name, phone)`)
        .order('scheduled_at', { ascending: true }),
      supabase.from('b2b_customers').select('id, name, phone').order('name'),
    ])
    
    setAppointments(appointmentsRes.data || [])
    setCustomers(customersRes.data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase.from('b2b_appointments').insert({
      ...formData,
      business_id: user?.id,
      status: 'scheduled',
    })

    if (error) {
      alert('Error creating appointment: ' + error.message)
    } else {
      setFormData({
        customer_id: '',
        title: '',
        description: '',
        scheduled_at: '',
        reminder_minutes_before: 30,
      })
      setShowForm(false)
      fetchData()
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return
    
    const { error } = await supabase.from('b2b_appointments').delete().eq('id', id)
    if (error) {
      alert('Error deleting appointment: ' + error.message)
    } else {
      fetchData()
    }
  }

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toUpperCase() || ''
    const styles: Record<string, string> = {
      SCHEDULED: 'bg-blue-50 text-blue-700 border-blue-200',
      REMINDED: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      CONFIRMED: 'bg-green-50 text-green-700 border-green-200',
      COMPLETED: 'bg-green-50 text-green-700 border-green-200',
      RESCHEDULED: 'bg-orange-50 text-orange-700 border-orange-200',
      CANCELED: 'bg-red-50 text-red-700 border-red-200',
      CANCELLED: 'bg-red-50 text-red-700 border-red-200',
      NO_SHOW: 'bg-gray-50 text-gray-700 border-gray-200',
    }
    return styles[normalizedStatus] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const formatStatus = (status: string) => {
    const labels: Record<string, string> = {
      SCHEDULED: 'Scheduled',
      REMINDED: 'Reminded',
      CONFIRMED: '✓ Confirmed',
      COMPLETED: 'Completed',
      RESCHEDULED: '↻ Rescheduled',
      CANCELED: 'Canceled',
      CANCELLED: 'Canceled',
      NO_SHOW: 'No Show',
    }
    const normalizedStatus = status?.toUpperCase() || ''
    return labels[normalizedStatus] || status
  }

  const isUpcoming = (date: string) => new Date(date) > new Date()
  const isPast = (date: string) => new Date(date) < new Date()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const upcomingAppointments = appointments.filter(a => isUpcoming(a.scheduled_at))
  const pastAppointments = appointments.filter(a => isPast(a.scheduled_at))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-gray-500">{upcomingAppointments.length} upcoming</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
            showForm 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
          }`}
        >
          {showForm ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Appointment
            </>
          )}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New Appointment</h2>
          {customers.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">Add customers first before creating appointments.</p>
              <Link href="/dashboard/customers" className="text-blue-600 font-medium hover:text-blue-700">
                Go to Customers →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Customer *</label>
                  <select
                    required
                    value={formData.customer_id}
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.phone})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Dental Checkup"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Remind Before</label>
                  <select
                    value={formData.reminder_minutes_before}
                    onChange={(e) => setFormData({ ...formData, reminder_minutes_before: parseInt(e.target.value) })}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value={0}>On time (at scheduled time)</option>
                    <option value={15}>15 minutes before</option>
                    <option value={30}>30 minutes before</option>
                    <option value={60}>1 hour before</option>
                    <option value={120}>2 hours before</option>
                    <option value={1440}>1 day before</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Additional details for the reminder call..."
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Appointment
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Appointments List */}
      {appointments.length > 0 ? (
        <div className="space-y-6">
          {/* Upcoming */}
          {upcomingAppointments.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Upcoming
              </h2>
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Date badge */}
                      <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white flex-shrink-0">
                        <span className="text-2xl font-bold leading-none">
                          {new Date(appointment.scheduled_at).getDate()}
                        </span>
                        <span className="text-xs uppercase">
                          {new Date(appointment.scheduled_at).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{appointment.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <span className="sm:hidden">
                                {new Date(appointment.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                {' · '}
                              </span>
                              {new Date(appointment.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(appointment.status)}`}>
                            {formatStatus(appointment.status)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{appointment.customer?.name}</p>
                            <a href={`tel:${appointment.customer?.phone}`} className="text-sm text-blue-600 hover:text-blue-700">
                              {appointment.customer?.phone}
                            </a>
                          </div>
                          <button
                            onClick={() => handleDelete(appointment.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        {appointment.description && (
                          <p className="text-sm text-gray-500 mt-3">{appointment.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past */}
          {pastAppointments.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-500 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Past
              </h2>
              <div className="space-y-3 opacity-75">
                {pastAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 bg-gray-200 rounded-xl text-gray-600 flex-shrink-0">
                        <span className="text-2xl font-bold leading-none">
                          {new Date(appointment.scheduled_at).getDate()}
                        </span>
                        <span className="text-xs uppercase">
                          {new Date(appointment.scheduled_at).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-700">{appointment.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                              <span className="sm:hidden">
                                {new Date(appointment.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                {' · '}
                              </span>
                              {new Date(appointment.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(appointment.status)}`}>
                            {formatStatus(appointment.status)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0" />
                          <p className="text-sm text-gray-500 truncate">{appointment.customer?.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">Schedule your first appointment to start sending automated reminder calls.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Your First Appointment
          </button>
        </div>
      )}
    </div>
  )
}
