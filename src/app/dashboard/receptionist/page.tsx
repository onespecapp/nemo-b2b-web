'use client'

import { useState, useEffect } from 'react'
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

export default function ReceptionistPage() {
  const { business, loading: userLoading } = useUser()
  const supabase = createClient()

  const [enabled, setEnabled] = useState(false)
  const [greeting, setGreeting] = useState('')
  const [businessHours, setBusinessHours] = useState<Record<string, { open: string; close: string; closed: boolean }>>(DEFAULT_HOURS)
  const [services, setServices] = useState<string[]>([])
  const [newService, setNewService] = useState('')
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [transferPhone, setTransferPhone] = useState('')
  const [instructions, setInstructions] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (userLoading || !business) {
      setIsLoading(false)
      return
    }
    loadConfig()
  }, [business, userLoading])

  async function loadConfig() {
    try {
      const { data, error } = await supabase
        .from('b2b_businesses')
        .select('receptionist_enabled, receptionist_greeting, business_hours, services, faqs, transfer_phone, receptionist_instructions')
        .eq('id', business!.id)
        .single()

      if (error) {
        // Columns may not exist yet — that's OK
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
          setServices(data.services)
        }
        if (Array.isArray(data.faqs)) {
          setFaqs(data.faqs)
        }
        setTransferPhone(data.transfer_phone ?? '')
        setInstructions(data.receptionist_instructions ?? '')
      }
    } catch (err) {
      console.error('Failed to load receptionist config:', err)
    } finally {
      setIsLoading(false)
    }
  }

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
        })
        .eq('id', business.id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Receptionist settings saved!' })
    } catch (err: any) {
      console.error('Failed to save:', err)
      setMessage({ type: 'error', text: err.message || 'Failed to save settings' })
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
    const trimmed = newService.trim()
    if (!trimmed) return
    setServices((prev) => [...prev, trimmed])
    setNewService('')
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
            placeholder="Hi, thank you for calling! How can I help you today?"
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
        <p className="mt-2 text-sm text-[#0f1f1a]/60">List of services your business offers. The AI will reference these.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {services.map((service, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full border border-[#0f1f1a]/10 bg-[#f8f5ef] px-3 py-1 text-sm">
              {service}
              <button onClick={() => removeService(i)} className="ml-1 text-[#0f1f1a]/40 hover:text-[#ef4444]" aria-label={`Remove ${service}`}>
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
            placeholder="Add a service..."
            className="flex-1 rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
          />
          <button onClick={addService} className="rounded-full bg-[#0f1f1a] px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            Add
          </button>
        </div>
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
          placeholder="e.g., Always ask for the caller's name before booking. We don't accept walk-ins on Saturdays."
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
