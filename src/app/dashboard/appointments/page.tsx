'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import AccessibleModal from '@/components/AccessibleModal'
import { useToast } from '@/components/ToastProvider'

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

function AppointmentsPageInner() {
  const { showToast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    customer_id: '',
    title: '',
    description: '',
    scheduled_at: '',
    reminder_minutes_before: 30,
  })
  const [customerQuery, setCustomerQuery] = useState('')
  const [customerMenuOpen, setCustomerMenuOpen] = useState(false)
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
  const [editCustomerQuery, setEditCustomerQuery] = useState('')
  const [editCustomerMenuOpen, setEditCustomerMenuOpen] = useState(false)
  const [editSaving, setEditSaving] = useState(false)
  const [editCalls, setEditCalls] = useState<CallLog[]>([])
  const [editCallsLoading, setEditCallsLoading] = useState(false)
  const [editCallsError, setEditCallsError] = useState<string | null>(null)
  const [newActiveIndex, setNewActiveIndex] = useState(-1)
  const [editActiveIndex, setEditActiveIndex] = useState(-1)
  const newInputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [businessTimezone, setBusinessTimezone] = useState<string | null>(null)
  const supabase = createClient()
  const searchParams = useSearchParams()
  const customerIdFromQuery = searchParams.get('customerId') || searchParams.get('customer_id') || ''

  const fetchData = useCallback(async () => {
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data: business, error: bizError } = await supabase
        .from('b2b_businesses')
        .select('id, timezone')
        .eq('owner_id', user.id)
        .single()

      if (bizError || !business) {
        setError(bizError?.message || 'No business found. Please set up your business in Settings first.')
        setLoading(false)
        return
      }

      setBusinessTimezone(business.timezone || null)

      const [appointmentsRes, customersRes] = await Promise.all([
        supabase
          .from('b2b_appointments')
          .select(`*, customer:b2b_customers(id, name, phone)`)
          .eq('business_id', business.id)
          .order('scheduled_at', { ascending: true }),
        supabase
          .from('b2b_customers')
          .select('id, name, phone')
          .eq('business_id', business.id)
          .order('name'),
      ])

      if (appointmentsRes.error) {
        setError(appointmentsRes.error.message)
        setLoading(false)
        return
      }

      setAppointments(appointmentsRes.data || [])
      setCustomers(customersRes.data || [])
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!customerIdFromQuery) return
    setShowForm(true)
    setFormData((prev) => ({ ...prev, customer_id: customerIdFromQuery }))
  }, [customerIdFromQuery])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    if (!formData.customer_id) {
      showToast('Please select a customer.', 'warning')
      setSaving(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()

    const { data: business, error: bizError } = await supabase
      .from('b2b_businesses')
      .select('id')
      .eq('owner_id', user?.id)
      .single()

    if (bizError || !business) {
      showToast('No business found for your account. Please contact support.', 'error')
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
      showToast('Error creating appointment: ' + error.message, 'error')
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
      showToast('Error deleting appointment: ' + error.message, 'error')
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

  const getCustomerLabel = (customer: Customer) => `${customer.name} (${customer.phone})`

  const filterCustomers = (query: string) => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return customers
    return customers.filter((customer) => {
      const haystack = `${customer.name} ${customer.phone} ${getCustomerLabel(customer)}`.toLowerCase()
      return haystack.includes(normalized)
    })
  }

  const selectedCustomer = customers.find((customer) => customer.id === formData.customer_id) || null
  const selectedEditCustomer = customers.find((customer) => customer.id === editFormData.customer_id) || null
  const filteredCustomers = filterCustomers(customerQuery)
  const filteredEditCustomers = filterCustomers(editCustomerQuery)

  // Reset active index when filtered results change or dropdown closes
  useEffect(() => {
    setNewActiveIndex(-1)
  }, [customerQuery, customerMenuOpen])

  useEffect(() => {
    setEditActiveIndex(-1)
  }, [editCustomerQuery, editCustomerMenuOpen])

  const newListboxRef = useRef<HTMLUListElement>(null)
  const editListboxRef = useRef<HTMLUListElement>(null)

  // Scroll the active option into view within the listbox
  useEffect(() => {
    if (newActiveIndex >= 0 && newListboxRef.current) {
      const activeEl = newListboxRef.current.children[newActiveIndex] as HTMLElement | undefined
      activeEl?.scrollIntoView?.({ block: 'nearest' })
    }
  }, [newActiveIndex])

  useEffect(() => {
    if (editActiveIndex >= 0 && editListboxRef.current) {
      const activeEl = editListboxRef.current.children[editActiveIndex] as HTMLElement | undefined
      activeEl?.scrollIntoView?.({ block: 'nearest' })
    }
  }, [editActiveIndex])

  const newActiveOptionId = newActiveIndex >= 0 && newActiveIndex < filteredCustomers.length
    ? `new-customer-option-${filteredCustomers[newActiveIndex].id}`
    : undefined

  const editActiveOptionId = editActiveIndex >= 0 && editActiveIndex < filteredEditCustomers.length
    ? `edit-customer-option-${filteredEditCustomers[editActiveIndex].id}`
    : undefined

  const handleNewCustomerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!customerMenuOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        setCustomerMenuOpen(true)
        setNewActiveIndex(0)
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setNewActiveIndex((prev) =>
          prev < filteredCustomers.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setNewActiveIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCustomers.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (newActiveIndex >= 0 && newActiveIndex < filteredCustomers.length) {
          const customer = filteredCustomers[newActiveIndex]
          setFormData({ ...formData, customer_id: customer.id })
          setCustomerQuery(getCustomerLabel(customer))
          setCustomerMenuOpen(false)
          setNewActiveIndex(-1)
        }
        break
      case 'Escape':
        e.preventDefault()
        setCustomerMenuOpen(false)
        setNewActiveIndex(-1)
        break
    }
  }

  const handleEditCustomerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!editCustomerMenuOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        setEditCustomerMenuOpen(true)
        setEditActiveIndex(0)
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setEditActiveIndex((prev) =>
          prev < filteredEditCustomers.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setEditActiveIndex((prev) =>
          prev > 0 ? prev - 1 : filteredEditCustomers.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (editActiveIndex >= 0 && editActiveIndex < filteredEditCustomers.length) {
          const customer = filteredEditCustomers[editActiveIndex]
          setEditFormData({ ...editFormData, customer_id: customer.id })
          setEditCustomerQuery(getCustomerLabel(customer))
          setEditCustomerMenuOpen(false)
          setEditActiveIndex(-1)
        }
        break
      case 'Escape':
        e.preventDefault()
        setEditCustomerMenuOpen(false)
        setEditActiveIndex(-1)
        break
    }
  }

  useEffect(() => {
    if (formData.customer_id && selectedCustomer && customerQuery.trim() === '') {
      setCustomerQuery(getCustomerLabel(selectedCustomer))
    }
  }, [formData.customer_id, selectedCustomer, customerQuery])

  const openEdit = async (appointment: Appointment) => {
    const appointmentCustomer = appointment.customer
      || customers.find((customer) => customer.id === appointment.customer_id)
      || null

    setEditingAppointment(appointment)
    setEditFormData({
      customer_id: appointment.customer_id,
      title: appointment.title,
      description: appointment.description || '',
      scheduled_at: toLocalInputValue(appointment.scheduled_at),
      reminder_minutes_before: appointment.reminder_minutes_before ?? 30,
      status: appointment.status || 'SCHEDULED',
    })
    setEditCustomerQuery(appointmentCustomer ? getCustomerLabel(appointmentCustomer) : '')
    setEditCustomerMenuOpen(false)

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

    if (!editFormData.customer_id) {
      showToast('Please select a customer.', 'warning')
      setEditSaving(false)
      return
    }

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
      showToast('Error updating appointment: ' + error.message, 'error')
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

  const getTimezoneAbbr = (tz: string) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' })
      const parts = formatter.formatToParts(new Date())
      return parts.find(p => p.type === 'timeZoneName')?.value || ''
    } catch {
      return ''
    }
  }

  const browserTz = timezoneLabel
  const bizTz = businessTimezone || browserTz
  const browserTzAbbr = getTimezoneAbbr(browserTz)
  const bizTzAbbr = getTimezoneAbbr(bizTz)
  const tzMismatch = browserTz !== bizTz

  const TimezoneIndicator = () => (
    <div className="mt-1.5 space-y-1">
      <p className="flex items-center gap-1.5 text-xs text-[#0f1f1a]/60">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 shrink-0 text-[#0f1f1a]/40" aria-hidden="true">
          <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 3a5 5 0 0 0-4.546 2.914A5.007 5.007 0 0 0 3 8a5 5 0 0 0 10 0 5.007 5.007 0 0 0-.454-2.086A5 5 0 0 0 8 3Zm-.75 2.75a.75.75 0 0 1 1.5 0v1.69l.97.97a.75.75 0 0 1-1.06 1.06l-1.28-1.28a.75.75 0 0 1-.22-.53V5.75Z" clipRule="evenodd" />
        </svg>
        Times are in {bizTz} ({bizTzAbbr})
      </p>
      {tzMismatch && (
        <p className="flex items-center gap-1.5 rounded-lg border border-[#f97316]/20 bg-[#f97316]/5 px-2 py-1 text-[11px] text-[#b45309]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
            <path fillRule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          </svg>
          Your browser is in {browserTz} ({browserTzAbbr}). Times entered will be treated as {bizTz}.
        </p>
      )}
    </div>
  )

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
            onClick={() => { setLoading(true); fetchData() }}
            className="mt-5 inline-flex items-center justify-center rounded-full bg-[#0f1f1a] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white"
          >
            Try again
          </button>
        </div>
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

    if (dateStart || dateEnd) {
      const apptDate = parseUTCDate(appointment.scheduled_at)
      if (dateStart) {
        const start = new Date(`${dateStart}T00:00:00`)
        if (apptDate < start) return false
      }
      if (dateEnd) {
        const end = new Date(`${dateEnd}T23:59:59.999`)
        if (apptDate > end) return false
      }
    }

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
        <div className="flex flex-wrap items-center gap-2 rounded-full border border-[#0f1f1a]/10 bg-white px-4 py-2 text-sm shadow-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Date</span>
          <input
            type="date"
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
            className="bg-transparent text-xs text-[#0f1f1a] focus:outline-none"
            aria-label="Start date"
          />
          <span className="text-xs text-[#0f1f1a]/40">to</span>
          <input
            type="date"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
            className="bg-transparent text-xs text-[#0f1f1a] focus:outline-none"
            aria-label="End date"
          />
          {(dateStart || dateEnd) && (
            <button
              type="button"
              onClick={() => {
                setDateStart('')
                setDateEnd('')
              }}
              className="rounded-full border border-[#0f1f1a]/15 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#0f1f1a]/60"
            >
              Clear
            </button>
          )}
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
                  <label htmlFor="new-appointment-customer" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Customer *</label>
                  <div className="relative mt-2">
                    <input
                      ref={newInputRef}
                      id="new-appointment-customer"
                      type="text"
                      role="combobox"
                      aria-expanded={customerMenuOpen}
                      aria-haspopup="listbox"
                      aria-controls="new-customer-search-results"
                      aria-autocomplete="list"
                      aria-activedescendant={newActiveOptionId}
                      autoComplete="off"
                      value={customerQuery}
                      onFocus={() => setCustomerMenuOpen(true)}
                      onBlur={() => setTimeout(() => setCustomerMenuOpen(false), 120)}
                      onKeyDown={handleNewCustomerKeyDown}
                      onChange={(e) => {
                        const value = e.target.value
                        setCustomerQuery(value)
                        if (selectedCustomer && value !== getCustomerLabel(selectedCustomer)) {
                          setFormData({ ...formData, customer_id: '' })
                        }
                        if (!value) {
                          setFormData({ ...formData, customer_id: '' })
                        }
                      }}
                      placeholder="Start typing a customer name..."
                      className="w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                    />
                    {formData.customer_id && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, customer_id: '' })
                          setCustomerQuery('')
                          setCustomerMenuOpen(false)
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50"
                      >
                        Clear
                      </button>
                    )}
                    {customerMenuOpen && (
                      <ul
                        ref={newListboxRef}
                        id="new-customer-search-results"
                        role="listbox"
                        aria-label="Customer search results"
                        className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-2xl border border-[#0f1f1a]/10 bg-white py-2 text-sm shadow-lg"
                      >
                        {filteredCustomers.length === 0 ? (
                          <li className="px-4 py-2 text-xs text-[#0f1f1a]/50" role="option" aria-selected={false}>No matching customers</li>
                        ) : (
                          filteredCustomers.map((customer, index) => (
                            <li
                              key={customer.id}
                              id={`new-customer-option-${customer.id}`}
                              role="option"
                              aria-selected={formData.customer_id === customer.id}
                              onMouseDown={(event) => {
                                event.preventDefault()
                                setFormData({ ...formData, customer_id: customer.id })
                                setCustomerQuery(getCustomerLabel(customer))
                                setCustomerMenuOpen(false)
                              }}
                              className={`flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm text-[#0f1f1a] hover:bg-[#f8f5ef] ${
                                index === newActiveIndex ? 'bg-[#f8f5ef]' : ''
                              }`}
                            >
                              <span className="font-semibold">{customer.name}</span>
                              <span className="text-xs text-[#0f1f1a]/60">{customer.phone}</span>
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="new-appointment-title" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Title *</label>
                  <input
                    id="new-appointment-title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                    placeholder="Dental Checkup"
                  />
                </div>
                <div>
                  <label htmlFor="new-appointment-date" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Date & time *</label>
                  <input
                    id="new-appointment-date"
                    type="datetime-local"
                    required
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                  />
                  <TimezoneIndicator />
                </div>
                <div>
                  <label htmlFor="new-appointment-reminder" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Remind before</label>
                  <select
                    id="new-appointment-reminder"
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
                  <label htmlFor="new-appointment-description" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Description</label>
                  <textarea
                    id="new-appointment-description"
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

      <AccessibleModal
        isOpen={!!editingAppointment}
        onClose={() => setEditingAppointment(null)}
        ariaLabel={`Edit appointment: ${editingAppointment?.title || ''}`}
        panelClassName="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#0f1f1a]/10 bg-[#f6f1ea] shadow-2xl shadow-black/10"
      >
        {editingAppointment && (
          <>
            <div className="flex items-center justify-between border-b border-[#0f1f1a]/10 bg-white/80 px-8 py-5 backdrop-blur">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Edit appointment</p>
                <h3 className="font-display text-2xl text-[#0f1f1a]">{editingAppointment.title}</h3>
              </div>
              <button
                onClick={() => setEditingAppointment(null)}
                aria-label="Close"
                className="rounded-full border border-[#0f1f1a]/15 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60 hover:border-[#0f1f1a]/30"
              >
                Close
              </button>
            </div>

            <div className="border-b border-[#0f1f1a]/10 bg-white/70 px-8 py-4">
              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#0f1f1a]/50">
                <span className="rounded-full border border-[#0f1f1a]/10 bg-white px-3 py-1">
                  {customers.find((customer) => customer.id === editFormData.customer_id)?.name || 'Unassigned'}
                </span>
                <span className="rounded-full border border-[#0f1f1a]/10 bg-white px-3 py-1">
                  {formatLocalDateTime(editFormData.scheduled_at) || 'Pick a time'}
                </span>
                <span className={`rounded-full px-3 py-1 ${getStatusBadge(editFormData.status)}`}>
                  {formatStatus(editFormData.status)}
                </span>
              </div>
              <div className="mt-4 grid gap-3 text-sm text-[#0f1f1a]/70 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#0f1f1a]/10 bg-white px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#0f1f1a]/50">Customer</p>
                  <p className="mt-1 font-semibold text-[#0f1f1a]">
                    {customers.find((customer) => customer.id === editFormData.customer_id)?.name || 'Unassigned'}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#0f1f1a]/10 bg-white px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#0f1f1a]/50">Scheduled for</p>
                  <p className="mt-1 font-semibold text-[#0f1f1a]">
                    {formatLocalDateTime(editFormData.scheduled_at) || 'Pick a time'}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#0f1f1a]/10 bg-white px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#0f1f1a]/50">Status</p>
                  <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(editFormData.status)}`}>
                    {formatStatus(editFormData.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="max-h-[calc(92vh-210px)] overflow-y-auto px-8 py-6">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm">
                  <h4 className="font-display text-xl text-[#0f1f1a]">Appointment details</h4>
                  {customers.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-[#0f1f1a]/20 bg-[#f8f5ef] px-6 py-8 text-center">
                      <p className="text-sm text-[#0f1f1a]/60">Add customers first before editing appointments.</p>
                      <Link href="/dashboard/customers" className="mt-3 inline-flex text-sm font-semibold text-[#0f1f1a]">
                        Go to Customers →
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleEditSave} className="mt-6 space-y-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="edit-appointment-customer" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Customer *</label>
                          <div className="relative mt-2">
                            <input
                              ref={editInputRef}
                              id="edit-appointment-customer"
                              type="text"
                              role="combobox"
                              aria-expanded={editCustomerMenuOpen}
                              aria-haspopup="listbox"
                              aria-controls="edit-customer-search-results"
                              aria-autocomplete="list"
                              aria-activedescendant={editActiveOptionId}
                              autoComplete="off"
                              value={editCustomerQuery}
                              onFocus={() => setEditCustomerMenuOpen(true)}
                              onBlur={() => setTimeout(() => setEditCustomerMenuOpen(false), 120)}
                              onKeyDown={handleEditCustomerKeyDown}
                              onChange={(e) => {
                                const value = e.target.value
                                setEditCustomerQuery(value)
                                if (selectedEditCustomer && value !== getCustomerLabel(selectedEditCustomer)) {
                                  setEditFormData({ ...editFormData, customer_id: '' })
                                }
                                if (!value) {
                                  setEditFormData({ ...editFormData, customer_id: '' })
                                }
                              }}
                              placeholder="Start typing a customer name..."
                              className="w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                            />
                            {editFormData.customer_id && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditFormData({ ...editFormData, customer_id: '' })
                                  setEditCustomerQuery('')
                                  setEditCustomerMenuOpen(false)
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50"
                              >
                                Clear
                              </button>
                            )}
                            {editCustomerMenuOpen && (
                              <ul
                                ref={editListboxRef}
                                id="edit-customer-search-results"
                                role="listbox"
                                aria-label="Customer search results"
                                className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-2xl border border-[#0f1f1a]/10 bg-white py-2 text-sm shadow-lg"
                              >
                                {filteredEditCustomers.length === 0 ? (
                                  <li className="px-4 py-2 text-xs text-[#0f1f1a]/50" role="option" aria-selected={false}>No matching customers</li>
                                ) : (
                                  filteredEditCustomers.map((customer, index) => (
                                    <li
                                      key={customer.id}
                                      id={`edit-customer-option-${customer.id}`}
                                      role="option"
                                      aria-selected={editFormData.customer_id === customer.id}
                                      onMouseDown={(event) => {
                                        event.preventDefault()
                                        setEditFormData({ ...editFormData, customer_id: customer.id })
                                        setEditCustomerQuery(getCustomerLabel(customer))
                                        setEditCustomerMenuOpen(false)
                                      }}
                                      className={`flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm text-[#0f1f1a] hover:bg-[#f8f5ef] ${
                                        index === editActiveIndex ? 'bg-[#f8f5ef]' : ''
                                      }`}
                                    >
                                      <span className="font-semibold">{customer.name}</span>
                                      <span className="text-xs text-[#0f1f1a]/60">{customer.phone}</span>
                                    </li>
                                  ))
                                )}
                              </ul>
                            )}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="edit-appointment-title" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Title *</label>
                          <input
                            id="edit-appointment-title"
                            type="text"
                            required
                            value={editFormData.title}
                            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                            className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                            placeholder="Dental Checkup"
                          />
                        </div>
                        <div>
                          <label htmlFor="edit-appointment-date" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Date & time *</label>
                          <input
                            id="edit-appointment-date"
                            type="datetime-local"
                            required
                            value={editFormData.scheduled_at}
                            onChange={(e) => setEditFormData({ ...editFormData, scheduled_at: e.target.value })}
                            className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                          />
                          <TimezoneIndicator />
                        </div>
                        <div>
                          <label htmlFor="edit-appointment-reminder" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Remind before</label>
                          <select
                            id="edit-appointment-reminder"
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
                          <label htmlFor="edit-appointment-status" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Status</label>
                          <select
                            id="edit-appointment-status"
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
                          <label htmlFor="edit-appointment-description" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Description</label>
                          <textarea
                            id="edit-appointment-description"
                            value={editFormData.description}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            rows={3}
                            className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                            placeholder="Additional details for the reminder call..."
                          />
                        </div>
                      </div>
                      <div className="sticky bottom-0 mt-6 flex flex-wrap items-center gap-3 border-t border-[#0f1f1a]/10 bg-white/90 pb-4 pt-4 backdrop-blur">
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

                <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/85 p-5 shadow-sm lg:sticky lg:top-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-xl text-[#0f1f1a]">Call log</h4>
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
                    <div className="mt-5 space-y-4">
                      {editCalls.map((call) => (
                        <div key={call.id} className="relative border-l border-[#0f1f1a]/10 pl-6">
                          <span className="absolute left-[-7px] top-5 h-3 w-3 rounded-full border border-white bg-[#f97316]" />
                          <div className="rounded-2xl border border-[#0f1f1a]/10 bg-white px-4 py-3 shadow-sm">
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
                                            {msg.role === 'agent' ? 'OneSpec' : 'Customer'}
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
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </AccessibleModal>
    </div>
  )
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#0f1f1a]/20 border-t-[#f97316]" />
      </div>
    }>
      <AppointmentsPageInner />
    </Suspense>
  )
}
