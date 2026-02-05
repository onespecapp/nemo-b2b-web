'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (New York)' },
  { value: 'America/Chicago', label: 'Central Time (Chicago)' },
  { value: 'America/Denver', label: 'Mountain Time (Denver)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)' },
  { value: 'America/Anchorage', label: 'Alaska Time (Anchorage)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (Honolulu)' },
  { value: 'America/Toronto', label: 'Eastern Time (Toronto)' },
  { value: 'America/Vancouver', label: 'Pacific Time (Vancouver)' },
  { value: 'America/Edmonton', label: 'Mountain Time (Edmonton)' },
  { value: 'America/Winnipeg', label: 'Central Time (Winnipeg)' },
  { value: 'America/Halifax', label: 'Atlantic Time (Halifax)' },
  { value: 'Europe/London', label: 'GMT (London)' },
  { value: 'Europe/Paris', label: 'CET (Paris)' },
  { value: 'Europe/Berlin', label: 'CET (Berlin)' },
  { value: 'Asia/Tokyo', label: 'JST (Tokyo)' },
  { value: 'Asia/Shanghai', label: 'CST (Shanghai)' },
  { value: 'Asia/Kolkata', label: 'IST (Kolkata)' },
  { value: 'Asia/Dubai', label: 'GST (Dubai)' },
  { value: 'Australia/Sydney', label: 'AEST (Sydney)' },
  { value: 'Australia/Melbourne', label: 'AEST (Melbourne)' },
  { value: 'Pacific/Auckland', label: 'NZST (Auckland)' },
]

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  notes?: string
  timezone?: string | null
  created_at: string
}

interface Appointment {
  id: string
  title: string
  scheduled_at: string
  status: string
}

interface CallLog {
  id: string
  call_type: string
  call_outcome: string | null
  duration_sec: number | null
  summary: string | null
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

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    timezone: '',
  })
  const [saving, setSaving] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    timezone: '',
  })
  const [editSaving, setEditSaving] = useState(false)
  const [customerAppointments, setCustomerAppointments] = useState<Appointment[]>([])
  const [customerCalls, setCustomerCalls] = useState<CallLog[]>([])
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [businessTimezone, setBusinessTimezone] = useState('America/Los_Angeles')
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchCustomers = useCallback(async () => {
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data: business, error: bizError } = await supabase
        .from('b2b_businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single()

      if (bizError || !business) {
        setError(bizError?.message || 'No business found. Please set up your business in Settings first.')
        setLoading(false)
        return
      }

      setBusinessTimezone(business.timezone || 'America/Los_Angeles')

      const { data, error: custError } = await supabase
        .from('b2b_customers')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false })

      if (custError) {
        setError(custError.message)
        setLoading(false)
        return
      }

      setCustomers(data || [])
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Not authenticated')
      setSaving(false)
      return
    }

    const { data: business, error: bizError } = await supabase
      .from('b2b_businesses')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (bizError || !business) {
      alert('No business found. Please set up your business in Settings first.')
      setSaving(false)
      return
    }

    const { error } = await supabase.from('b2b_customers').insert({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      notes: formData.notes,
      timezone: formData.timezone || null,
      business_id: business.id,
    })

    if (error) {
      alert('Error creating customer: ' + error.message)
    } else {
      setFormData({ name: '', phone: '', email: '', notes: '', timezone: '' })
      setShowForm(false)
      fetchCustomers()
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return

    const { error } = await supabase.from('b2b_customers').delete().eq('id', id)
    if (error) {
      alert('Error deleting customer: ' + error.message)
    } else {
      fetchCustomers()
    }
  }

  const formatDateTime = (dateString: string) => {
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

  const openEdit = async (customer: Customer) => {
    setEditingCustomer(customer)
    setEditFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      notes: customer.notes || '',
      timezone: customer.timezone || '',
    })

    setCustomerAppointments([])
    setCustomerCalls([])
    setDetailsError(null)
    setDetailsLoading(true)

    const [appointmentsRes, callsRes] = await Promise.all([
      supabase
        .from('b2b_appointments')
        .select('id, title, scheduled_at, status')
        .eq('customer_id', customer.id)
        .order('scheduled_at', { ascending: false }),
      supabase
        .from('b2b_call_logs')
        .select('id, call_type, call_outcome, duration_sec, summary, created_at')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false }),
    ])

    if (appointmentsRes.error || callsRes.error) {
      setDetailsError(appointmentsRes.error?.message || callsRes.error?.message || 'Unable to load details.')
    } else {
      setCustomerAppointments(appointmentsRes.data || [])
      setCustomerCalls(callsRes.data || [])
    }

    setDetailsLoading(false)
  }

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCustomer) return
    setEditSaving(true)

    const { error } = await supabase
      .from('b2b_customers')
      .update({
        name: editFormData.name,
        phone: editFormData.phone,
        email: editFormData.email,
        notes: editFormData.notes,
        timezone: editFormData.timezone || null,
      })
      .eq('id', editingCustomer.id)

    if (error) {
      alert('Error updating customer: ' + error.message)
    } else {
      setEditingCustomer(null)
      fetchCustomers()
    }
    setEditSaving(false)
  }

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredCustomers = customers.filter((customer) => {
    if (!normalizedSearch) return true
    const haystack = [
      customer.name,
      customer.phone,
      customer.email,
      customer.notes,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(normalizedSearch)
  })
  const showingCount = normalizedSearch ? filteredCustomers.length : customers.length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#0f1f1a]/20 border-t-[#f97316]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="rounded-3xl border border-dashed border-[#ef4444]/30 bg-white/80 p-10 text-center">
          <h3 className="font-display text-2xl">Something went wrong</h3>
          <p className="mt-2 text-sm text-[#0f1f1a]/60">{error}</p>
          <button
            onClick={() => { setLoading(true); fetchCustomers() }}
            className="mt-5 inline-flex items-center justify-center rounded-full bg-[#0f1f1a] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Customers</p>
          <h1 className="font-display text-3xl sm:text-4xl">People you remind</h1>
          <p className="mt-1 text-sm text-[#0f1f1a]/60">
            {showingCount} customer{showingCount !== 1 ? 's' : ''} in your roster.
            {normalizedSearch && (
              <span className="ml-2 text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/40">
                of {customers.length}
              </span>
            )}
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
          {showForm ? 'Close form' : 'Add customer'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">New customer</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Required *</span>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                  placeholder="Jordan Lee"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                  placeholder="jordan@example.com"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Notes</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                  placeholder="Prefers morning appointments"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Timezone</label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                >
                  <option value="">Business default ({TIMEZONES.find(tz => tz.value === businessTimezone)?.label || businessTimezone})</option>
                  {TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-full bg-[#f97316] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save customer'}
            </button>
          </form>
        </div>
      )}

      {customers.length > 0 ? (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 rounded-full border border-[#0f1f1a]/10 bg-white px-4 py-2 text-sm shadow-sm">
              <label htmlFor="customer-search" className="sr-only">Search customers</label>
              <input
                id="customer-search"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, phone, email, or notes..."
                className="w-full bg-transparent text-sm text-[#0f1f1a] placeholder:text-[#0f1f1a]/40 focus:outline-none"
              />
            </div>
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#0f1f1a]/20 bg-white/80 p-10 text-center">
              <h3 className="font-display text-2xl">No matches</h3>
              <p className="mt-2 text-sm text-[#0f1f1a]/60">Try a different name, phone, or email.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-5 inline-flex items-center justify-center rounded-full border border-[#0f1f1a]/15 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/70"
              >
                Clear search
              </button>
            </div>
          ) : (
            <>
              <div className="sm:hidden space-y-4">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f1f1a] text-sm font-semibold text-white">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0f1f1a]">{customer.name}</h3>
                      <a href={`tel:${customer.phone}`} className="text-xs text-[#0f1f1a]/60">{customer.phone}</a>
                    </div>
                  </div>
                  <button
                    onClick={() => openEdit(customer)}
                    className="rounded-full border border-[#0f1f1a]/10 px-3 py-1 text-xs text-[#0f1f1a]/60"
                  >
                    Edit
                  </button>
                </div>
                {customer.email && (
                  <div className="mt-3 text-xs text-[#0f1f1a]/60">{customer.email}</div>
                )}
                {customer.notes && (
                  <div className="mt-2 text-xs text-[#0f1f1a]/60">{customer.notes}</div>
                )}
                <div className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[#0f1f1a]/40">
                  Added {new Date(customer.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden sm:block rounded-3xl border border-[#0f1f1a]/10 bg-white/90 shadow-sm">
            <table className="min-w-full divide-y divide-[#0f1f1a]/10">
              <thead className="bg-[#f8f5ef]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Customer</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Phone</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Email</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Created</th>
                  <th className="px-6 py-4 text-right text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0f1f1a]/10">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#f8f5ef]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f1f1a] text-sm font-semibold text-white">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#0f1f1a]">{customer.name}</div>
                          {customer.notes && <div className="text-xs text-[#0f1f1a]/60">{customer.notes}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#0f1f1a]/70">
                      <a href={`tel:${customer.phone}`} className="hover:text-[#0f1f1a]">{customer.phone}</a>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#0f1f1a]/60">{customer.email || '-'}</td>
                    <td className="px-6 py-4 text-sm text-[#0f1f1a]/60">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/appointments?customerId=${customer.id}`}
                          className="rounded-full bg-[#0f1f1a] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                        >
                          New appointment
                        </Link>
                        <button
                          onClick={() => openEdit(customer)}
                          className="rounded-full border border-[#0f1f1a]/10 px-3 py-1 text-xs text-[#0f1f1a]/60 hover:border-[#0f1f1a]/30"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            </>
          )}
        </>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#0f1f1a]/20 bg-white/80 p-10 text-center">
          <h3 className="font-display text-2xl">No customers yet</h3>
          <p className="mt-2 text-sm text-[#0f1f1a]/60">Add your first customer to start scheduling reminders.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 inline-flex items-center justify-center rounded-full bg-[#0f1f1a] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
          >
            Add customer
          </button>
        </div>
      )}

      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-[#0f1f1a]/10 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#0f1f1a]/10 px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Edit customer</p>
                <h3 className="font-display text-2xl">{editingCustomer.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/appointments?customerId=${editingCustomer.id}`}
                  className="rounded-full bg-[#0f1f1a] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                >
                  New appointment
                </Link>
                <button
                  onClick={() => setEditingCustomer(null)}
                  className="rounded-full border border-[#0f1f1a]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-6">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-5">
                  <h4 className="font-display text-xl">Customer details</h4>
                  <form onSubmit={handleEditSave} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Name *</label>
                        <input
                          type="text"
                          required
                          value={editFormData.name}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Phone *</label>
                        <input
                          type="tel"
                          required
                          value={editFormData.phone}
                          onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                          className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Email</label>
                        <input
                          type="email"
                          value={editFormData.email}
                          onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                          className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Notes</label>
                        <input
                          type="text"
                          value={editFormData.notes}
                          onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                          className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Timezone</label>
                        <select
                          value={editFormData.timezone}
                          onChange={(e) => setEditFormData({ ...editFormData, timezone: e.target.value })}
                          className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                        >
                          <option value="">Business default ({TIMEZONES.find(tz => tz.value === businessTimezone)?.label || businessTimezone})</option>
                          {TIMEZONES.map((tz) => (
                            <option key={tz.value} value={tz.value}>{tz.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sticky bottom-0 mt-6 flex flex-wrap items-center gap-3 border-t border-[#0f1f1a]/10 bg-white/95 pb-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setEditingCustomer(null)}
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
                      <button
                        type="button"
                        onClick={() => handleDelete(editingCustomer.id)}
                        className="ml-auto rounded-full border border-[#ef4444]/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#b91c1c] hover:bg-[#fef2f2]"
                      >
                        Delete customer
                      </button>
                    </div>
                  </form>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl border border-[#0f1f1a]/10 bg-[#f8f5ef] p-5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-xl">Appointments</h4>
                      <span className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">
                        {customerAppointments.length} total
                      </span>
                    </div>

                    {detailsLoading ? (
                      <div className="mt-6 flex items-center gap-3 text-sm text-[#0f1f1a]/60">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0f1f1a]/20 border-t-[#f97316]" />
                        Loading details...
                      </div>
                    ) : detailsError ? (
                      <div className="mt-6 rounded-2xl border border-dashed border-[#0f1f1a]/20 bg-white/70 px-5 py-6 text-sm text-[#0f1f1a]/60">
                        {detailsError}
                      </div>
                    ) : customerAppointments.length === 0 ? (
                      <div className="mt-6 rounded-2xl border border-dashed border-[#0f1f1a]/20 bg-white/70 px-5 py-6 text-sm text-[#0f1f1a]/60">
                        No appointments yet for this customer.
                      </div>
                    ) : (
                      <div className="mt-5 space-y-3">
                        {customerAppointments.map((appointment) => (
                          <div key={appointment.id} className="rounded-2xl border border-[#0f1f1a]/10 bg-white px-4 py-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-[#0f1f1a]">{appointment.title}</p>
                                <p className="mt-1 text-xs text-[#0f1f1a]/60">
                                  {formatDateTime(appointment.scheduled_at)}
                                </p>
                              </div>
                              <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${getStatusBadge(appointment.status)}`}>
                                {formatStatus(appointment.status)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-xl">Call history</h4>
                      <span className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">
                        {customerCalls.length} calls
                      </span>
                    </div>

                    {detailsLoading ? (
                      <div className="mt-6 flex items-center gap-3 text-sm text-[#0f1f1a]/60">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0f1f1a]/20 border-t-[#f97316]" />
                        Loading details...
                      </div>
                    ) : detailsError ? (
                      <div className="mt-6 rounded-2xl border border-dashed border-[#0f1f1a]/20 bg-[#f8f5ef] px-5 py-6 text-sm text-[#0f1f1a]/60">
                        {detailsError}
                      </div>
                    ) : customerCalls.length === 0 ? (
                      <div className="mt-6 rounded-2xl border border-dashed border-[#0f1f1a]/20 bg-[#f8f5ef] px-5 py-6 text-sm text-[#0f1f1a]/60">
                        No calls yet for this customer.
                      </div>
                    ) : (
                      <div className="mt-5 space-y-3">
                        {customerCalls.map((call) => (
                          <div key={call.id} className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] px-4 py-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-[#0f1f1a]">
                                  {callTypeLabels[call.call_type] || call.call_type} • {formatDateTime(call.created_at)}
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
                              <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${
                                callOutcomeStyles[call.call_outcome || ''] || 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70'
                              }`}>
                                {callOutcomeLabels[call.call_outcome || ''] || call.call_outcome || 'Pending'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
