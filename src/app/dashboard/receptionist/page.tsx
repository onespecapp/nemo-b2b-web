'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/lib/context/UserContext'

const CATEGORY_PLACEHOLDERS: Record<string, { greeting: string; servicesOffered: string; customInstructions: string }> = {
  '': {
    greeting: 'Hi, thanks for calling! How can I help you today?',
    servicesOffered: 'e.g. List your main services here',
    customInstructions: 'e.g. Add any special instructions for your receptionist here.',
  },
  AUTO_DEALERSHIP: {
    greeting: 'Hi, thanks for calling Sunset Motors! How can I help you today?',
    servicesOffered: 'e.g. Oil Change, Car Sales, Test Drives, Brake Service',
    customInstructions: 'e.g. Always mention our current promotion: 20% off oil changes this month.',
  },
  AUTO_REPAIR: {
    greeting: 'Hi, thanks for calling! How can I help with your vehicle today?',
    servicesOffered: 'e.g. Oil Change, Brake Repair, Engine Diagnostics, Tire Rotation',
    customInstructions: 'e.g. Always ask what vehicle make, model, and year they have.',
  },
  AUTO_BODY: {
    greeting: 'Hi, thanks for calling! How can we help with your vehicle today?',
    servicesOffered: 'e.g. Collision Repair, Dent Removal, Paint Jobs, Frame Straightening',
    customInstructions: 'e.g. Ask if they have an insurance claim number.',
  },
  PLUMBING: {
    greeting: 'Hi, thanks for calling! How can we help you today?',
    servicesOffered: 'e.g. Drain Cleaning, Water Heater Repair, Pipe Repair, Leak Detection',
    customInstructions: 'e.g. Always ask if the issue is urgent or an emergency.',
  },
  HVAC: {
    greeting: 'Hi, thanks for calling! How can we help with your heating or cooling today?',
    servicesOffered: 'e.g. AC Repair, Furnace Installation, Duct Cleaning, Thermostat Setup',
    customInstructions: 'e.g. Ask what type of system they have (central air, mini-split, etc.).',
  },
  ELECTRICAL: {
    greeting: 'Hi, thanks for calling! How can we help you today?',
    servicesOffered: 'e.g. Panel Upgrades, Outlet Installation, Lighting, Wiring Repair',
    customInstructions: 'e.g. Always ask if they are experiencing any safety concerns like sparking or burning smells.',
  },
  GENERAL_CONTRACTOR: {
    greeting: 'Hi, thanks for calling! How can we help with your project?',
    servicesOffered: 'e.g. Kitchen Remodel, Bathroom Renovation, Room Addition, Deck Building',
    customInstructions: 'e.g. Ask about their project timeline and budget range.',
  },
  ROOFING: {
    greeting: 'Hi, thanks for calling! How can we help with your roof today?',
    servicesOffered: 'e.g. Roof Repair, New Roof Installation, Gutter Cleaning, Leak Repair',
    customInstructions: 'e.g. Ask if the issue is storm-related (may be covered by insurance).',
  },
  OTHER: {
    greeting: 'Hi, thanks for calling! How can I help you today?',
    servicesOffered: 'e.g. List your main services here',
    customInstructions: 'e.g. Add any special instructions for your receptionist here.',
  },
}

interface AgentConfig {
  greeting?: string
  customInstructions?: string
  businessHours?: string
  servicesOffered?: string
  smsNotifyOwner?: boolean
  smsNotifyCustomer?: boolean
}

export default function ReceptionistPage() {
  const { business, loading: userLoading, refreshBusiness } = useUser()
  const supabase = createClient()

  const [enabled, setEnabled] = useState(false)
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({})
  const [transferPhone, setTransferPhone] = useState('')
  const [businessCategory, setBusinessCategory] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [copied, setCopied] = useState(false)

  const telnyxPhone = (business as unknown as { telnyx_phone_number?: string | null } | null)?.telnyx_phone_number ?? null

  // Refs to always read latest values in debounced save (avoids stale closures)
  const enabledRef = useRef(enabled)
  const agentConfigRef = useRef(agentConfig)
  const transferPhoneRef = useRef(transferPhone)
  const businessRef = useRef(business)
  enabledRef.current = enabled
  agentConfigRef.current = agentConfig
  transferPhoneRef.current = transferPhone
  businessRef.current = business

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isLoadedRef = useRef(false)
  const savedTimerRef = useRef<NodeJS.Timeout | null>(null)

  const loadConfig = useCallback(async () => {
    if (!business) return
    try {
      const { data, error } = await supabase
        .from('b2b_businesses')
        .select('receptionist_enabled, agent_config, transfer_phone, category')
        .eq('id', business.id)
        .single()

      if (error) {
        console.error('Failed to load receptionist config:', error)
        setIsLoading(false)
        return
      }

      if (data) {
        setEnabled(data.receptionist_enabled ?? false)
        setAgentConfig(data.agent_config || {})
        setTransferPhone(((data.transfer_phone || '') as string).replace(/^\+?1/, ''))
        setBusinessCategory(data.category || '')
      }
    } catch (err) {
      console.error('Failed to load receptionist config:', err)
    } finally {
      setIsLoading(false)
      // Mark loaded AFTER state is set, so auto-save ignores the initial state hydration
      setTimeout(() => { isLoadedRef.current = true }, 0)
    }
  }, [business, supabase])

  useEffect(() => {
    if (userLoading || !business) {
      setIsLoading(false)
      return
    }
    loadConfig()
  }, [business, userLoading, loadConfig])

  // Debounced save that reads latest values from refs
  const scheduleSave = useCallback(() => {
    if (!isLoadedRef.current) return

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(async () => {
      const biz = businessRef.current
      if (!biz) return
      setSaveStatus('saving')

      try {
        const config = agentConfigRef.current
        const cleanAgentConfig: Record<string, unknown> = {}
        for (const [key, val] of Object.entries(config)) {
          if (val !== undefined && val !== '') cleanAgentConfig[key] = val
        }

        const tp = transferPhoneRef.current
        const { error } = await supabase
          .from('b2b_businesses')
          .update({
            receptionist_enabled: enabledRef.current,
            agent_config: cleanAgentConfig,
            transfer_phone: tp.trim() ? `+1${tp.replace(/\D/g, '')}` : null,
          })
          .eq('id', biz.id)

        if (error) throw error

        await refreshBusiness()
        setSaveStatus('saved')
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
        savedTimerRef.current = setTimeout(() => setSaveStatus('idle'), 2000)
      } catch (err) {
        console.error('Failed to save:', err)
        setSaveStatus('error')
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
        savedTimerRef.current = setTimeout(() => setSaveStatus('idle'), 3000)
      }
    }, 800)
  }, [supabase, refreshBusiness])

  // Auto-save when any field changes
  useEffect(() => {
    scheduleSave()
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [enabled, agentConfig, transferPhone, scheduleSave])

  function handleCopyPhone() {
    if (!telnyxPhone) return
    navigator.clipboard.writeText(telnyxPhone)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const placeholders = CATEGORY_PLACEHOLDERS[businessCategory] || CATEGORY_PLACEHOLDERS['']

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
        <p className={`mt-2 text-sm transition-colors ${
          saveStatus === 'saved' ? 'text-[#0f766e]' :
          saveStatus === 'error' ? 'text-[#ef4444]' :
          'text-[#0f1f1a]/60'
        }`}>
          {saveStatus === 'saving' ? 'Saving...' :
           saveStatus === 'saved' ? 'All changes saved' :
           saveStatus === 'error' ? 'Failed to save' :
           'Configure how your AI receptionist handles inbound calls.'}
        </p>
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
            <p className="text-xs uppercase tracking-[0.2em] text-[#0f766e]/70">Your business phone number</p>
            <p className="mt-0.5 text-lg font-semibold text-[#0f766e]">{telnyxPhone}</p>
            <p className="text-xs text-[#0f766e]/60">Inbound calls to this line are handled by your AI receptionist</p>
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

      {/* Greeting & Persona */}
      <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
        <h3 className="font-display text-2xl">Greeting &amp; persona</h3>
        <p className="mt-2 text-sm text-[#0f1f1a]/60">Customize how your receptionist greets callers and handles conversations.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="greeting" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
              Greeting message
            </label>
            <input
              type="text"
              id="greeting"
              value={agentConfig.greeting || ''}
              onChange={(e) => setAgentConfig({ ...agentConfig, greeting: e.target.value })}
              placeholder={placeholders.greeting}
              className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
            />
            <p className="mt-1 text-xs text-[#0f1f1a]/40">Leave blank for a default greeting using your business name.</p>
          </div>

          <div>
            <label htmlFor="services-offered" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
              Services offered
            </label>
            <input
              type="text"
              id="services-offered"
              value={agentConfig.servicesOffered || ''}
              onChange={(e) => setAgentConfig({ ...agentConfig, servicesOffered: e.target.value })}
              placeholder={placeholders.servicesOffered}
              className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
            />
            <p className="mt-1 text-xs text-[#0f1f1a]/40">Comma-separated. Your receptionist will only book appointments for these services.</p>
          </div>

          <div>
            <label htmlFor="custom-instructions" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
              Custom instructions
            </label>
            <textarea
              id="custom-instructions"
              rows={4}
              value={agentConfig.customInstructions || ''}
              onChange={(e) => setAgentConfig({ ...agentConfig, customInstructions: e.target.value })}
              placeholder={placeholders.customInstructions}
              className="mt-2 w-full resize-none rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
            />
            <p className="mt-1 text-xs text-[#0f1f1a]/40">Extra instructions your receptionist will follow on every call.</p>
          </div>

          <div>
            <label htmlFor="business-hours" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
              Business hours
            </label>
            <input
              type="text"
              id="business-hours"
              value={agentConfig.businessHours || ''}
              onChange={(e) => setAgentConfig({ ...agentConfig, businessHours: e.target.value })}
              placeholder="Monday-Friday 9AM-6PM, Saturday 10AM-4PM"
              className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
            />
            <p className="mt-1 text-xs text-[#0f1f1a]/40">Your receptionist will reference these hours when callers ask.</p>
          </div>

          <div>
            <label htmlFor="transfer-phone" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
              Transfer phone number
            </label>
            <div className={`mt-2 flex items-center rounded-2xl border bg-white overflow-hidden ${
              transferPhone && transferPhone.replace(/\D/g, '').length === 10
                ? 'border-[#0f766e]'
                : transferPhone && transferPhone.replace(/\D/g, '').length > 0
                  ? 'border-[#ef4444]'
                  : 'border-[#0f1f1a]/20'
            }`}>
              <span className="select-none bg-[#f8f5ef] px-3 py-3 text-sm text-[#0f1f1a]/50 border-r border-[#0f1f1a]/10">+1</span>
              <input
                type="tel"
                id="transfer-phone"
                value={transferPhone}
                onChange={(e) => setTransferPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="2506828899"
                className="w-full px-3 py-3 text-sm focus:outline-none bg-transparent"
              />
            </div>
            {transferPhone && transferPhone.replace(/\D/g, '').length > 0 && transferPhone.replace(/\D/g, '').length !== 10 ? (
              <p className="mt-1 text-xs text-[#ef4444]">Enter a 10-digit phone number</p>
            ) : (
              <p className="mt-1 text-xs text-[#0f1f1a]/40">When a caller asks for a human, the AI will transfer to this number.</p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] px-4 py-3">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/60">Notify me after calls</span>
              <span className="block text-xs text-[#0f1f1a]/40 mt-0.5">Get a text summary of each call to your transfer number</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={!!agentConfig.smsNotifyOwner}
              onClick={() => setAgentConfig({ ...agentConfig, smsNotifyOwner: !agentConfig.smsNotifyOwner })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                agentConfig.smsNotifyOwner ? 'bg-[#f97316]' : 'bg-[#0f1f1a]/20'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  agentConfig.smsNotifyOwner ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] px-4 py-3">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/60">Text caller after calls</span>
              <span className="block text-xs text-[#0f1f1a]/40 mt-0.5">Send the caller a thank-you text after their call</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={!!agentConfig.smsNotifyCustomer}
              onClick={() => setAgentConfig({ ...agentConfig, smsNotifyCustomer: !agentConfig.smsNotifyCustomer })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                agentConfig.smsNotifyCustomer ? 'bg-[#f97316]' : 'bg-[#0f1f1a]/20'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  agentConfig.smsNotifyCustomer ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
