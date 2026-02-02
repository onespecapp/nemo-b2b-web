'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const parseUTCDate = (dateStr: string): Date => {
  if (!dateStr.endsWith('Z') && !dateStr.includes('+')) {
    return new Date(dateStr + 'Z')
  }
  return new Date(dateStr)
}

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

interface CallLog {
  id: string
  call_type: string
  call_outcome: string | null
  duration_sec: number | null
  summary: string | null
  transcript?: any[] | null
  created_at: string
}

const callTypeLabels: Record<string, string> = {
  REMINDER: 'Reminder call',
  TEST: 'Test call',
  FOLLOW_UP: 'Follow-up call',
  CONFIRMATION: 'Confirmation call',
}

const callOutcomeLabels: Record<string, string> = {
  CONFIRMED: 'Confirmed',
  RESCHEDULED: 'Rescheduled',
  CANCELED: 'Canceled',
  ANSWERED: 'Answered',
  NO_ANSWER: 'No Answer',
  VOICEMAIL: 'Voicemail',
  BUSY: 'Busy',
  FAILED: 'Failed',
}

const callOutcomeStyles: Record<string, string> = {
  CONFIRMED: 'bg-[#0f766e]/15 text-[#0f766e]',
  RESCHEDULED: 'bg-[#f97316]/20 text-[#b45309]',
  CANCELED: 'bg-[#ef4444]/15 text-[#991b1b]',
  ANSWERED: 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70',
  NO_ANSWER: 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70',
  VOICEMAIL: 'bg-[#6366f1]/15 text-[#4338ca]',
  BUSY: 'bg-[#fb7185]/15 text-[#be123c]',
  FAILED: 'bg-[#ef4444]/15 text-[#991b1b]',
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
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [editFormData, setEditFormData] = useState({
    customer_id: '',
    title: '',
    description: '',
    scheduled_at: '',
    reminder_minutes_before: 30,
    status: 'SCHEDULED',
  })
  const [editSaving, setEditSaving] = useState(false)
  const [editCalls, setEditCalls] = useState<CallLog[]>([])
  const [editCallsLoading, setEditCallsLoading] = useState(false)
  const [editCallsError, setEditCallsError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
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

    const { data: business, error: bizError } = await supabase
      .from('b2b_businesses')
      .select('id')
      .eq('owner_id', user?.id)
      .single()

    if (bizError || !business) {
      alert('Error: No business found for your account. Please contact support.')
      setSaving(false)
      return
    }

    const scheduledAtUTC = new Date(formData.scheduled_at).toISOString()

    const { error } = await supabase.from('b2b_appointments').insert({
      ...formData,
      scheduled_at: scheduledAtUTC,
      business_id: business.id,
      status: 'SCHEDULED',
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

  const toLocalInputValue = (dateStr: string) => {
    const date = parseUTCDate(dateStr)
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    return local.toISOString().slice(0, 16)
  }

  const formatCallDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '-'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getRelativeLabel = (dateStr: string) => {
    const date = parseUTCDate(dateStr)
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const diffDays = Math.round((startOfDate.getTime() - startOfToday.getTime()) / 86400000)

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays > 1) return `In ${diffDays} days`
    return `${Math.abs(diffDays)} days ago`
  }

  const formatLocalDateTime = (value: string) => {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const openEdit = async (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setEditFormData({
      customer_id: appointment.customer_id,
      title: appointment.title,
      description: appointment.description || '',
      scheduled_at: toLocalInputValue(appointment.scheduled_at),
      reminder_minutes_before: appointment.reminder_minutes_before ?? 30,
      status: appointment.status || 'SCHEDULED',
    })

    setEditCalls([])
    setEditCallsError(null)
    setEditCallsLoading(true)
    const { data, error } = await supabase
      .from('b2b_call_logs')
      .select('id, call_type, call_outcome, duration_sec, summary, transcript, created_at')
      .eq('appointment_id', appointment.id)
      .order('created_at', { ascending: false })

    if (error) {
      setEditCallsError(error.message)
    } else {
      setEditCalls(data || [])
    }
    setEditCallsLoading(false)
  }

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAppointment) return
    setEditSaving(true)

    const scheduledAtUTC = new Date(editFormData.scheduled_at).toISOString()

    const { error } = await supabase
      .from('b2b_appointments')
      .update({
        customer_id: editFormData.customer_id,
        title: editFormData.title,
        description: editFormData.description,
        scheduled_at: scheduledAtUTC,
        reminder_minutes_before: editFormData.reminder_minutes_before,
        status: editFormData.status,
      })
      .eq('id', editingAppointment.id)

    if (error) {
      alert('Error updating appointment: ' + error.message)
    } else {
      setEditingAppointment(null)
      fetchData()
    }
    setEditSaving(false)
  }

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toUpperCase() || ''
    const styles: Record<string, string> = {
      SCHEDULED: 'bg-[#0f1f1a] text-white',
      REMINDED: 'bg-[#f97316]/15 text-[#b45309]',
      CONFIRMED: 'bg-[#0f766e]/15 text-[#0f766e]',
      COMPLETED: 'bg-[#0f766e]/15 text-[#0f766e]',
      RESCHEDULED: 'bg-[#fb7185]/15 text-[#be123c]',
      CANCELED: 'bg-[#ef4444]/15 text-[#991b1b]',
      CANCELLED: 'bg-[#ef4444]/15 text-[#991b1b]',
      NO_SHOW: 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70',
    }
    return styles[normalizedStatus] || 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70'
  }

  const formatStatus = (status: string) => {
    const labels: Record<string, string> = {
      SCHEDULED: 'Scheduled',
      REMINDED: 'Reminded',
      CONFIRMED: 'Confirmed',
      COMPLETED: 'Completed',
      RESCHEDULED: 'Rescheduled',
      CANCELED: 'Canceled',
      CANCELLED: 'Canceled',
      NO_SHOW: 'No Show',
    }
    const normalizedStatus = status?.toUpperCase() || ''
    return labels[normalizedStatus] || status
  }

  const isUpcoming = (date: string) => parseUTCDate(date) > new Date()
  const isPast = (date: string) => parseUTCDate(date) < new Date()
  const timezoneLabel = Intl.DateTimeFormat().resolvedOptions().timeZone

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#0f1f1a]/20 border-t-[#f97316]" />
      </div>
    )
  }

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredAppointments = appointments.filter((appointment) => {
    const normalizedStatus = appointment.status?.toUpperCase() || ''
    const matchesStatus = statusFilter === 'all'
      || normalizedStatus === statusFilter
      || (statusFilter === 'CANCELED' && normalizedStatus === 'CANCELLED')
    if (!matchesStatus) return false
    if (!normalizedSearch) return true

    const haystack = [
      appointment.title,
      appointment.description,
      appointment.customer?.name,
      appointment.customer?.phone,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(normalizedSearch)
  })

  const upcomingAppointments = filteredAppointments.filter(a => isUpcoming(a.scheduled_at))
  const pastAppointments = filteredAppointments.filter(a => isPast(a.scheduled_at))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Appointments</p>
          <h1 className="font-display text-3xl sm:text-4xl">Your schedule</h1>
          <p className="mt-1 text-sm text-[#0f1f1a]/60">
            {upcomingAppointments.length} upcoming · {filteredAppointments.length} total
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
            showForm
              ? 'border border-[#0f1f1a]/15 bg-white text-[#0f1f1a]/70'
              : 'bg-[#0f1f1a] text-white shadow-lg shadow-black/15'
          }`}
        >
          {showForm ? 'Close form' : 'New appointment'}
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1 rounded-full border border-[#0f1f1a]/10 bg-white px-4 py-2 text-sm shadow-sm">
          <label htmlFor="appointment-search" className="sr-only">Search appointments</label>
          <input
            id="appointment-search"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer, phone, or title..."
            className="w-full bg-transparent text-sm text-[#0f1f1a] placeholder:text-[#0f1f1a]/40 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3 rounded-full border border-[#0f1f1a]/10 bg-white px-4 py-2 text-sm shadow-sm">
          <label htmlFor="status-filter" className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Status</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-sm font-semibold text-[#0f1f1a] focus:outline-none"
          >
            <option value="all">All</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="RESCHEDULED">Rescheduled</option>
            <option value="CANCELED">Canceled</option>
            <option value="COMPLETED">Completed</option>
            <option value="NO_SHOW">No Show</option>
          </select>
        </div>
      </div>

      {showForm && (
        <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
          <h2 className="font-display text-2xl">New appointment</h2>
          {customers.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#0f1f1a]/20 bg-[#f8f5ef] px-6 py-8 text-center">
              <p className="text-sm text-[#0f1f1a]/60">Add customers first before creating appointments.</p>
              <Link href="/dashboard/customers" className="mt-3 inline-flex text-sm font-semibold text-[#0f1f1a]">
                Go to Customers →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Customer *</label>
                  <select
                    required
                    value={formData.customer_id}
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
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
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                    placeholder="Dental Checkup"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Date & time *</label>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#0f1f1a]/40">
                    Local time ({timezoneLabel})
                  </p>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Remind before</label>
                  <select
                    value={formData.reminder_minutes_before}
                    onChange={(e) => setFormData({ ...formData, reminder_minutes_before: parseInt(e.target.value) })}
                    className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
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
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                    placeholder="Additional details for the reminder call..."
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-full bg-[#f97316] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Create appointment'}
              </button>
            </form>
          )}
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#0f1f1a]/20 bg-white/80 p-10 text-center">
          <h3 className="font-display text-2xl">No appointments yet</h3>
          <p className="mt-2 text-sm text-[#0f1f1a]/60">Schedule your first appointment to start sending reminders.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 inline-flex items-center justify-center rounded-full bg-[#0f1f1a] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
          >
            Create appointment
          </button>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#0f1f1a]/20 bg-white/80 p-10 text-center">
          <h3 className="font-display text-2xl">No matches</h3>
          <p className="mt-2 text-sm text-[#0f1f1a]/60">Try clearing filters or adjusting your search.</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('all')
            }}
            className="mt-5 inline-flex items-center justify-center rounded-full border border-[#0f1f1a]/15 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/70"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {upcomingAppointments.length > 0 && (
            <div>
              <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">
                <span className="h-2 w-2 rounded-full bg-[#0f766e]" /> Upcoming
              </div>
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[#0f1f1a]">{appointment.title}</h3>
                        <p className="text-sm text-[#0f1f1a]/60">
                          {parseUTCDate(appointment.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {' · '}
                          {parseUTCDate(appointment.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                          <span className="ml-2 inline-flex items-center rounded-full border border-[#0f1f1a]/10 bg-white px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] text-[#0f1f1a]/50">
                            {getRelativeLabel(appointment.scheduled_at)}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(appointment.status)}`}>
                          {formatStatus(appointment.status)}
                        </span>
                        <button
                          onClick={() => openEdit(appointment)}
                          className="rounded-full bg-[#0f1f1a] px-3 py-1 text-xs font-semibold text-white"
                        >
                          Edit
                        </button>
                        <details className="relative">
                          <summary className="list-none rounded-full border border-[#0f1f1a]/15 px-3 py-1 text-xs text-[#0f1f1a]/60 hover:bg-[#f8f5ef]">
                            More
                          </summary>
                          <div className="absolute right-0 z-10 mt-2 w-36 rounded-2xl border border-[#0f1f1a]/10 bg-white p-2 text-left text-xs shadow-lg">
                            <button
                              onClick={() => handleDelete(appointment.id)}
                              className="w-full rounded-xl px-3 py-2 text-left text-[#b91c1c] hover:bg-[#fef2f2]"
                            >
                              Delete appointment
                            </button>
                          </div>
                        </details>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-[#0f1f1a]">{appointment.customer?.name}</p>
                        <a href={`tel:${appointment.customer?.phone}`} className="text-xs text-[#0f1f1a]/60">
                          {appointment.customer?.phone}
                        </a>
                      </div>
                    </div>
                    {appointment.description && (
                      <p className="mt-3 text-sm text-[#0f1f1a]/60">{appointment.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {pastAppointments.length > 0 && (
            <div>
              <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/40">
                <span className="h-2 w-2 rounded-full bg-[#0f1f1a]/30" /> Past
              </div>
              <div className="space-y-3">
                {pastAppointments.map((appointment) => (
                  <div key={appointment.id} className="rounded-3xl border border-[#0f1f1a]/10 bg-white/70 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-[#0f1f1a]/80">{appointment.title}</h3>
                        <p className="text-sm text-[#0f1f1a]/50">
                          {parseUTCDate(appointment.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {' · '}
                          {parseUTCDate(appointment.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                          <span className="ml-2 inline-flex items-center rounded-full border border-[#0f1f1a]/10 bg-white px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] text-[#0f1f1a]/50">
                            {getRelativeLabel(appointment.scheduled_at)}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(appointment.status)}`}>
                          {formatStatus(appointment.status)}
                        </span>
                        <button
                          onClick={() => openEdit(appointment)}
                          className="rounded-full border border-[#0f1f1a]/15 px-3 py-1 text-xs font-semibold text-[#0f1f1a]/70 hover:bg-white"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-[#0f1f1a]/60">{appointment.customer?.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {editingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-[#0f1f1a]/10 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#0f1f1a]/10 px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Edit appointment</p>
                <h3 className="font-display text-2xl">{editingAppointment.title}</h3>
              </div>
              <button
                onClick={() => setEditingAppointment(null)}
                className="rounded-full border border-[#0f1f1a]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60"
              >
                Close
              </button>
            </div>

            <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-6">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-5">
                  <h4 className="font-display text-xl">Appointment details</h4>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#0f1f1a]/50">
                    <span className="rounded-full border border-[#0f1f1a]/10 bg-[#f8f5ef] px-3 py-1">
                      {customers.find((customer) => customer.id === editFormData.customer_id)?.name || 'Unassigned'}
                    </span>
                    <span className="rounded-full border border-[#0f1f1a]/10 bg-white px-3 py-1">
                      {formatLocalDateTime(editFormData.scheduled_at) || 'Pick a time'}
                    </span>
                    <span className={`rounded-full px-3 py-1 ${getStatusBadge(editFormData.status)}`}>
                      {formatStatus(editFormData.status)}
                    </span>
                  </div>
                  {customers.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-[#0f1f1a]/20 bg-[#f8f5ef] px-6 py-8 text-center">
                      <p className="text-sm text-[#0f1f1a]/60">Add customers first before editing appointments.</p>
                      <Link href="/dashboard/customers" className="mt-3 inline-flex text-sm font-semibold text-[#0f1f1a]">
                        Go to Customers →
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleEditSave} className="mt-6 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Customer *</label>
                          <select
                            required
                            value={editFormData.customer_id}
                            onChange={(e) => setEditFormData({ ...editFormData, customer_id: e.target.value })}
                            className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
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
                          <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Title *</label>
                          <input
                            type="text"
                            required
                            value={editFormData.title}
                            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                            className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                            placeholder="Dental Checkup"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Date & time *</label>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#0f1f1a]/40">
                            Local time ({timezoneLabel})
                          </p>
                          <input
                            type="datetime-local"
                            required
                            value={editFormData.scheduled_at}
                            onChange={(e) => setEditFormData({ ...editFormData, scheduled_at: e.target.value })}
                            className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Remind before</label>
                          <select
                            value={editFormData.reminder_minutes_before}
                            onChange={(e) => setEditFormData({ ...editFormData, reminder_minutes_before: parseInt(e.target.value) })}
                            className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                          >
                            <option value={0}>On time (at scheduled time)</option>
                            <option value={15}>15 minutes before</option>
                            <option value={30}>30 minutes before</option>
                            <option value={60}>1 hour before</option>
                            <option value={120}>2 hours before</option>
                            <option value={1440}>1 day before</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Status</label>
                          <select
                            value={editFormData.status}
                            onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                            className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                          >
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="RESCHEDULED">Rescheduled</option>
                            <option value="CANCELED">Canceled</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="NO_SHOW">No Show</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Description</label>
                          <textarea
                            value={editFormData.description}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            rows={3}
                            className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                            placeholder="Additional details for the reminder call..."
                          />
                        </div>
                      </div>
                      <div className="sticky bottom-0 mt-6 flex flex-wrap items-center gap-3 border-t border-[#0f1f1a]/10 bg-white/95 pb-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setEditingAppointment(null)}
                          className="rounded-full border border-[#0f1f1a]/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/60"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={editSaving}
                          className="inline-flex items-center justify-center rounded-full bg-[#f97316] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition disabled:opacity-60"
                        >
                          {editSaving ? 'Saving...' : 'Save changes'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="rounded-3xl border border-[#0f1f1a]/10 bg-[#f8f5ef] p-5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-xl">Call log</h4>
                    <span className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">
                      {editCalls.length} calls
                    </span>
                  </div>

                  {editCallsLoading ? (
                    <div className="mt-6 flex items-center gap-3 text-sm text-[#0f1f1a]/60">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0f1f1a]/20 border-t-[#f97316]" />
                      Loading call history...
                    </div>
                  ) : editCallsError ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-[#0f1f1a]/20 bg-white/70 px-5 py-6 text-sm text-[#0f1f1a]/60">
                      Unable to load call logs: {editCallsError}
                    </div>
                  ) : editCalls.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-[#0f1f1a]/20 bg-white/70 px-5 py-6 text-sm text-[#0f1f1a]/60">
                      No calls yet for this appointment.
                    </div>
                  ) : (
                    <div className="mt-5 space-y-3">
                      {editCalls.map((call) => (
                        <div key={call.id} className="rounded-2xl border border-[#0f1f1a]/10 bg-white px-4 py-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-[#0f1f1a]">
                                {callTypeLabels[call.call_type] || call.call_type} • {formatCallDate(call.created_at)}
                              </p>
                              <p className="mt-1 text-xs text-[#0f1f1a]/60">
                                Outcome: {callOutcomeLabels[call.call_outcome || ''] || call.call_outcome || 'Pending'}
                                {' · '}
                                Duration: {formatDuration(call.duration_sec)}
                              </p>
                              {call.summary && (
                                <p className="mt-2 text-xs text-[#0f1f1a]/60">{call.summary}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${
                                callOutcomeStyles[call.call_outcome || ''] || 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70'
                              }`}>
                                {callOutcomeLabels[call.call_outcome || ''] || call.call_outcome || 'Pending'}
                              </span>
                            </div>
                          </div>
                          {call.transcript && call.transcript.length > 0 && (
                            <details className="mt-3 rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] px-3 py-2 text-xs text-[#0f1f1a]/70">
                              <summary className="cursor-pointer text-[11px] uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                                View transcript
                              </summary>
                              <div className="mt-3 space-y-2">
                                {call.transcript.map((msg, i) => (
                                  <div
                                    key={i}
                                    className={`flex ${msg.role === 'agent' ? 'justify-start' : msg.role === 'user' ? 'justify-end' : 'justify-center'}`}
                                  >
                                    {msg.role === 'system' ? (
                                      <div className="rounded-full border border-[#0f1f1a]/10 bg-white px-3 py-1 text-[11px] text-[#0f1f1a]/50">
                                        {msg.content}
                                      </div>
                                    ) : (
                                      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs ${
                                        msg.role === 'agent'
                                          ? 'bg-[#0f1f1a] text-white'
                                          : 'bg-white text-[#0f1f1a]'
                                      }`}>
                                        <p className="text-[10px] uppercase tracking-[0.2em] opacity-70">
                                          {msg.role === 'agent' ? 'Nemo' : 'Customer'}
                                        </p>
                                        <p>{msg.content}</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
