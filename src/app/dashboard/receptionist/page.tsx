'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/lib/context/UserContext'

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

const DEFAULT_HOURS: Record<string, { open: string; close: string; closed: boolean }> = {
  monday: { open: '09:00', close: '17:00', closed: false },
  tuesday: { open: '09:00', close: '17:00', closed: false },
  wednesday: { open: '09:00', close: '17:00', closed: false },
  thursday: { open: '09:00', close: '17:00', closed: false },
  friday: { open: '09:00', close: '17:00', closed: false },
  saturday: { open: '10:00', close: '16:00', closed: false },
  sunday: { open: '10:00', close: '16:00', closed: true },
}

interface FAQ {
  question: string
  answer: string
}

interface Service {
  name: string
  price_min: string
  price_max: string
  duration_min: string
  is_emergency: boolean
}

const CATEGORY_PLACEHOLDERS: Record<string, { greeting: string; instructions: string }> = {
  '': {
    greeting: 'Hi, thanks for calling! How can I help you today?',
    instructions: 'e.g. Add any special instructions for your receptionist here.',
  },
  DENTAL: {
    greeting: 'Hi, thanks for calling! How can we help with your dental care today?',
    instructions: 'e.g. Always ask if the patient is a new or existing patient. Mention we accept most insurance plans.',
  },
  MEDICAL: {
    greeting: 'Hi, thanks for calling! How can we help you today?',
    instructions: 'e.g. Always ask if the caller is a current patient. Mention we accept most major insurance plans.',
  },
  VETERINARY: {
    greeting: 'Hi, thanks for calling! How can we help with your pet today?',
    instructions: 'e.g. Always ask what type and breed of pet they have. Mention we offer new-patient wellness exams.',
  },
  LEGAL: {
    greeting: 'Hi, thanks for calling! How can we assist you today?',
    instructions: 'e.g. Ask what area of law they need help with. Mention we offer free initial consultations.',
  },
  FINANCIAL: {
    greeting: 'Hi, thanks for calling! How can we help with your financial needs today?',
    instructions: 'e.g. Ask if they are a current client. Mention we offer a complimentary financial review.',
  },
  REAL_ESTATE: {
    greeting: 'Hi, thanks for calling! How can we help with your real estate needs today?',
    instructions: 'e.g. Ask if they are looking to buy, sell, or rent. Mention we offer free market analysis.',
  },
  SALON: {
    greeting: 'Hi, thanks for calling! How can we help you today?',
    instructions: 'e.g. Ask if they have a preferred stylist. Mention our first-time client discount.',
  },
  SPA: {
    greeting: 'Hi, thanks for calling! How can we help you relax today?',
    instructions: 'e.g. Ask if they have any allergies or sensitivities. Mention our spa packages for couples.',
  },
  FITNESS: {
    greeting: 'Hi, thanks for calling! How can we help with your fitness goals today?',
    instructions: 'e.g. Ask if they are a current member. Mention we offer a free trial week for new members.',
  },
  PLUMBING: {
    greeting: 'Hi, thanks for calling! How can we help you today?',
    instructions: 'e.g. Always ask if the issue is urgent or an emergency. Mention we offer same-day service for emergencies.',
  },
  HVAC: {
    greeting: 'Hi, thanks for calling! How can we help with your heating or cooling today?',
    instructions: 'e.g. Ask what type of system they have (central air, mini-split, etc.). Mention our seasonal tune-up specials.',
  },
  ELECTRICAL: {
    greeting: 'Hi, thanks for calling! How can we help you today?',
    instructions: 'e.g. Always ask if they are experiencing any safety concerns like sparking or burning smells. Mention we are licensed and insured.',
  },
  GENERAL_CONTRACTOR: {
    greeting: 'Hi, thanks for calling! How can we help with your project?',
    instructions: 'e.g. Ask about their project timeline and budget range. Mention we offer free estimates.',
  },
  LANDSCAPING: {
    greeting: 'Hi, thanks for calling! How can we help with your yard today?',
    instructions: 'e.g. Ask about the size of their property. Mention we offer free on-site estimates.',
  },
  ROOFING: {
    greeting: 'Hi, thanks for calling! How can we help with your roof today?',
    instructions: 'e.g. Ask if the issue is storm-related (may be covered by insurance). Mention we offer free roof inspections.',
  },
  PAINTING: {
    greeting: 'Hi, thanks for calling! How can we help with your painting project?',
    instructions: 'e.g. Ask if the job is interior or exterior. Mention we offer free color consultations and estimates.',
  },
  OTHER: {
    greeting: 'Hi, thanks for calling! How can I help you today?',
    instructions: 'e.g. Add any special instructions for your receptionist here.',
  },
}

const EMPTY_SERVICE: Service = {
  name: '',
  price_min: '',
  price_max: '',
  duration_min: '',
  is_emergency: false,
}

export default function ReceptionistPage() {
  const { business, loading: userLoading } = useUser()
  const supabase = createClient()

  const [enabled, setEnabled] = useState(false)
  const [greeting, setGreeting] = useState('')
  const [businessHours, setBusinessHours] = useState<Record<string, { open: string; close: string; closed: boolean }>>(DEFAULT_HOURS)
  const [services, setServices] = useState<Service[]>([])
  const [addingService, setAddingService] = useState(false)
  const [newService, setNewService] = useState<Service>({ ...EMPTY_SERVICE })
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [transferPhone, setTransferPhone] = useState('')
  const [instructions, setInstructions] = useState('')
  const [bookingEnabled, setBookingEnabled] = useState(false)
  const [defaultDuration, setDefaultDuration] = useState('60')
  const [bookingAdvanceDays, setBookingAdvanceDays] = useState('30')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const telnyxPhone = (business as unknown as { telnyx_phone_number?: string | null } | null)?.telnyx_phone_number ?? null
  const categoryPlaceholders = CATEGORY_PLACEHOLDERS[business?.category ?? ''] || CATEGORY_PLACEHOLDERS['']

  const loadConfig = useCallback(async () => {
    if (!business) return
    try {
      const { data, error } = await supabase
        .from('b2b_businesses')
        .select('receptionist_enabled, receptionist_greeting, business_hours, services, faqs, transfer_phone, receptionist_instructions, booking_enabled, default_appointment_duration, booking_advance_days')
        .eq('id', business.id)
        .single()

      if (error) {
        console.error('Failed to load receptionist config:', error)
        setIsLoading(false)
        return
      }

      if (data) {
        setEnabled(data.receptionist_enabled ?? false)
        setGreeting(data.receptionist_greeting ?? '')
        if (data.business_hours && typeof data.business_hours === 'object') {
          setBusinessHours({ ...DEFAULT_HOURS, ...data.business_hours })
        }
        if (Array.isArray(data.services)) {
          // Support both legacy string[] and new Service[]
          const normalised = (data.services as unknown[]).map((s) => {
            if (typeof s === 'string') return { name: s, price_min: '', price_max: '', duration_min: '', is_emergency: false }
            return s as Service
          })
          setServices(normalised)
        }
        if (Array.isArray(data.faqs)) {
          setFaqs(data.faqs)
        }
        setTransferPhone(data.transfer_phone ?? '')
        setInstructions(data.receptionist_instructions ?? '')
        setBookingEnabled(data.booking_enabled ?? false)
        setDefaultDuration(String(data.default_appointment_duration ?? 60))
        setBookingAdvanceDays(String(data.booking_advance_days ?? 30))
      }
    } catch (err) {
      console.error('Failed to load receptionist config:', err)
    } finally {
      setIsLoading(false)
    }
  }, [business, supabase])

  useEffect(() => {
    if (userLoading || !business) {
      setIsLoading(false)
      return
    }
    loadConfig()
  }, [business, userLoading, loadConfig])

  async function handleSave() {
    if (!business) return
    setIsSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('b2b_businesses')
        .update({
          receptionist_enabled: enabled,
          receptionist_greeting: greeting || null,
          business_hours: businessHours,
          services,
          faqs,
          transfer_phone: transferPhone || null,
          receptionist_instructions: instructions || null,
          booking_enabled: bookingEnabled,
          default_appointment_duration: parseInt(defaultDuration) || 60,
          booking_advance_days: parseInt(bookingAdvanceDays) || 30,
        })
        .eq('id', business.id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Receptionist settings saved!' })
    } catch (err) {
      console.error('Failed to save:', err)
      const msg = err instanceof Error ? err.message : 'Failed to save settings'
      setMessage({ type: 'error', text: msg })
    } finally {
      setIsSaving(false)
    }
  }

  function updateHours(day: string, field: 'open' | 'close' | 'closed', value: string | boolean) {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }))
  }

  function addService() {
    if (!newService.name.trim()) return
    setServices((prev) => [...prev, { ...newService, name: newService.name.trim() }])
    setNewService({ ...EMPTY_SERVICE })
    setAddingService(false)
  }

  function removeService(index: number) {
    setServices((prev) => prev.filter((_, i) => i !== index))
  }

  function addFaq() {
    setFaqs((prev) => [...prev, { question: '', answer: '' }])
  }

  function updateFaq(index: number, field: 'question' | 'answer', value: string) {
    setFaqs((prev) => prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)))
  }

  function removeFaq(index: number) {
    setFaqs((prev) => prev.filter((_, i) => i !== index))
  }

  function handleCopyPhone() {
    if (!telnyxPhone) return
    navigator.clipboard.writeText(telnyxPhone)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading || userLoading) {
    return (
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Receptionist</p>
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#0f1f1a]/20 border-t-[#f97316]" />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Receptionist</p>
        <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm text-center py-12">
          <p className="font-display text-lg font-semibold text-[#0f1f1a]/70">Set up your business first</p>
          <p className="mt-1 text-sm text-[#0f1f1a]/40">Go to Settings to create your business profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Receptionist</p>
        <h1 className="font-display text-3xl sm:text-4xl">AI Receptionist</h1>
        <p className="mt-2 text-sm text-[#0f1f1a]/60">Configure how your AI answers inbound calls.</p>
      </div>

      {/* Assigned phone number */}
      {telnyxPhone ? (
        <div className="flex items-center gap-3 rounded-2xl border border-[#0f766e]/20 bg-[#0f766e]/5 px-5 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0f766e]/15">
            <svg className="h-5 w-5 text-[#0f766e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-[#0f766e]/70">Your AI receptionist number</p>
            <p className="mt-0.5 text-lg font-semibold text-[#0f766e]">{telnyxPhone}</p>
            <p className="text-xs text-[#0f766e]/60">Inbound calls to this number are answered by your AI</p>
          </div>
          <button
            type="button"
            onClick={handleCopyPhone}
            className="shrink-0 rounded-xl border border-[#0f766e]/20 bg-white px-3 py-2 text-xs font-semibold text-[#0f766e] transition hover:bg-[#0f766e]/10"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] px-5 py-4 text-sm text-[#0f1f1a]/60">
          No phone number assigned yet. Contact your administrator to get a number set up.
        </div>
      )}

      {message && (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-[#0f766e]/30 bg-[#0f766e]/10 text-[#0f766e]' : 'border-[#ef4444]/30 bg-[#ef4444]/10 text-[#991b1b]'}`}>
          {message.text}
        </div>
      )}

      {/* Enable/Disable Toggle */}
      <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl">Receptionist Status</h3>
            <p className="mt-1 text-sm text-[#0f1f1a]/60">
              {enabled ? 'Your AI receptionist is answering calls.' : 'Your AI receptionist is currently off.'}
            </p>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors ${enabled ? 'bg-[#0f766e]' : 'bg-[#0f1f1a]/20'}`}
            role="switch"
            aria-checked={enabled}
          >
            <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
        {enabled && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#0f766e]/10 px-3 py-1 text-xs font-semibold text-[#0f766e]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#0f766e]" />
            Active
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Greeting Message */}
        <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
          <h3 className="font-display text-2xl">Greeting Message</h3>
          <p className="mt-2 text-sm text-[#0f1f1a]/60">What callers hear first when the AI picks up.</p>
          <textarea
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            placeholder={categoryPlaceholders.greeting}
            rows={3}
            className="mt-4 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
          />
        </div>

        {/* Transfer Number */}
        <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
          <h3 className="font-display text-2xl">Transfer Number</h3>
          <p className="mt-2 text-sm text-[#0f1f1a]/60">Phone number to transfer calls when the AI can&apos;t handle them.</p>
          <input
            type="tel"
            value={transferPhone}
            onChange={(e) => setTransferPhone(e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="mt-4 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
          />
        </div>
      </div>

      {/* Appointment Booking */}
      <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl">Appointment Booking</h3>
            <p className="mt-1 text-sm text-[#0f1f1a]/60">Allow your AI to book appointments directly during calls.</p>
          </div>
          <button
            onClick={() => setBookingEnabled(!bookingEnabled)}
            className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors ${bookingEnabled ? 'bg-[#0f766e]' : 'bg-[#0f1f1a]/20'}`}
            role="switch"
            aria-checked={bookingEnabled}
          >
            <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${bookingEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>

        {bookingEnabled && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="default-duration" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                Default appointment duration (minutes)
              </label>
              <input
                type="number"
                id="default-duration"
                value={defaultDuration}
                onChange={(e) => setDefaultDuration(e.target.value)}
                min="15"
                step="15"
                placeholder="60"
                className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="advance-days" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                Booking advance window (days)
              </label>
              <input
                type="number"
                id="advance-days"
                value={bookingAdvanceDays}
                onChange={(e) => setBookingAdvanceDays(e.target.value)}
                min="1"
                placeholder="30"
                className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
              />
              <p className="mt-1 text-xs text-[#0f1f1a]/40">How far in advance callers can book</p>
            </div>
          </div>
        )}
      </div>

      {/* Business Hours */}
      <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
        <h3 className="font-display text-2xl">Business Hours</h3>
        <p className="mt-2 text-sm text-[#0f1f1a]/60">Set your open hours so the AI knows when you&apos;re available.</p>
        <div className="mt-4 space-y-3">
          {DAYS.map((day) => (
            <div key={day} className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] px-4 py-3">
              <span className="w-24 text-sm font-semibold capitalize">{day}</span>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={businessHours[day]?.closed ?? false}
                  onChange={(e) => updateHours(day, 'closed', e.target.checked)}
                  className="h-4 w-4 rounded"
                />
                Closed
              </label>
              {!businessHours[day]?.closed && (
                <>
                  <input
                    type="time"
                    value={businessHours[day]?.open ?? '09:00'}
                    onChange={(e) => updateHours(day, 'open', e.target.value)}
                    className="rounded-xl border border-[#0f1f1a]/20 bg-white px-3 py-2 text-sm focus:border-[#f97316] focus:outline-none"
                  />
                  <span className="text-sm text-[#0f1f1a]/50">to</span>
                  <input
                    type="time"
                    value={businessHours[day]?.close ?? '17:00'}
                    onChange={(e) => updateHours(day, 'close', e.target.value)}
                    className="rounded-xl border border-[#0f1f1a]/20 bg-white px-3 py-2 text-sm focus:border-[#f97316] focus:outline-none"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
        <h3 className="font-display text-2xl">Services</h3>
        <p className="mt-2 text-sm text-[#0f1f1a]/60">Services your business offers. The AI will reference these when answering questions.</p>

        {services.length > 0 && (
          <div className="mt-4 space-y-3">
            {services.map((service, i) => (
              <div key={i} className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-[#0f1f1a]">{service.name}</span>
                      {service.is_emergency && (
                        <span className="rounded-full bg-[#ef4444]/15 px-2 py-0.5 text-[10px] font-semibold text-[#991b1b]">
                          Emergency
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-[#0f1f1a]/60">
                      {(service.price_min || service.price_max) && (
                        <span>
                          {service.price_min && service.price_max
                            ? `$${service.price_min} – $${service.price_max}`
                            : service.price_min
                            ? `From $${service.price_min}`
                            : `Up to $${service.price_max}`}
                        </span>
                      )}
                      {service.duration_min && (
                        <span>{service.duration_min} min</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeService(i)}
                    className="shrink-0 rounded-full border border-[#0f1f1a]/10 px-3 py-1 text-xs text-[#0f1f1a]/50 hover:text-[#ef4444]"
                    aria-label={`Remove ${service.name}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {addingService ? (
          <div className="mt-4 rounded-2xl border border-[#0f1f1a]/15 bg-[#f8f5ef] p-4 space-y-3">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Service name *</label>
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService((s) => ({ ...s, name: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                placeholder="e.g. Water Heater Installation"
                className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                autoFocus
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Price min ($)</label>
                <input
                  type="number"
                  value={newService.price_min}
                  onChange={(e) => setNewService((s) => ({ ...s, price_min: e.target.value }))}
                  placeholder="150"
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Price max ($)</label>
                <input
                  type="number"
                  value={newService.price_max}
                  onChange={(e) => setNewService((s) => ({ ...s, price_max: e.target.value }))}
                  placeholder="500"
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Duration (min)</label>
                <input
                  type="number"
                  value={newService.duration_min}
                  onChange={(e) => setNewService((s) => ({ ...s, duration_min: e.target.value }))}
                  placeholder="90"
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={newService.is_emergency}
                onChange={(e) => setNewService((s) => ({ ...s, is_emergency: e.target.checked }))}
                className="h-4 w-4 rounded"
              />
              Available as emergency / after-hours service
            </label>
            <div className="flex gap-2">
              <button
                onClick={addService}
                disabled={!newService.name.trim()}
                className="rounded-full bg-[#0f1f1a] px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-60"
              >
                Add service
              </button>
              <button
                onClick={() => { setAddingService(false); setNewService({ ...EMPTY_SERVICE }) }}
                className="rounded-full border border-[#0f1f1a]/15 bg-white px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/70"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingService(true)}
            className="mt-4 rounded-full border border-[#0f1f1a]/15 bg-white px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/70 transition hover:border-[#0f1f1a]/30"
          >
            + Add service
          </button>
        )}
      </div>

      {/* FAQs */}
      <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
        <h3 className="font-display text-2xl">FAQs</h3>
        <p className="mt-2 text-sm text-[#0f1f1a]/60">Common questions and answers your AI can reference.</p>
        <div className="mt-4 space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFaq(i, 'question', e.target.value)}
                    placeholder="Question..."
                    className="w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                  />
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                    placeholder="Answer..."
                    rows={2}
                    className="w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                  />
                </div>
                <button onClick={() => removeFaq(i)} className="shrink-0 rounded-full border border-[#0f1f1a]/10 px-3 py-1 text-xs text-[#0f1f1a]/50 hover:text-[#ef4444]">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addFaq} className="mt-4 rounded-full border border-[#0f1f1a]/15 bg-white px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/70 transition hover:border-[#0f1f1a]/30">
          + Add FAQ
        </button>
      </div>

      {/* Custom Instructions */}
      <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
        <h3 className="font-display text-2xl">Custom Instructions</h3>
        <p className="mt-2 text-sm text-[#0f1f1a]/60">Special instructions for your AI receptionist.</p>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder={categoryPlaceholders.instructions}
          rows={4}
          className="mt-4 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-full bg-[#f97316] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition disabled:opacity-60"
        >
          {isSaving ? 'Saving...' : 'Save all settings'}
        </button>
      </div>
    </div>
  )
}
