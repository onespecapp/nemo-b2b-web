'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/lib/context/UserContext'

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

const VOICES: { id: string; name: string; description: string; tag?: string }[] = [
  { id: '5ee9feff-1265-424a-9d7f-8e4d431a12c7', name: 'Ronald', description: 'Calm and thoughtful — ideal for professional conversations', tag: 'Recommended' },
  { id: 'f786b574-daa5-4673-aa0c-cbe3e8534c02', name: 'Katie', description: 'Friendly and helpful — great for front desk calls' },
  { id: 'e07c00bc-4134-4eae-9ea4-1a55fb45746b', name: 'Brooke', description: 'Warm and approachable — great for customer service' },
  { id: '248be419-c632-4f23-adf1-5324ed7dbf1d', name: 'Professional Woman', description: 'Polished and confident — suited for business inquiries' },
  { id: '829ccd10-f8b3-43cd-b8a0-4aeaa81f3b30', name: 'Customer Support Lady', description: 'Clear and patient — perfect for service calls' },
]

const DEFAULT_VOICE_ID = '5ee9feff-1265-424a-9d7f-8e4d431a12c7' // Ronald
const STRIPE_STARTER_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || ''
const STRIPE_PRO_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || ''

function normalizeVoicePreference(rawVoice: string | null | undefined): string {
  const normalized = (rawVoice || '').trim()
  if (!normalized) return DEFAULT_VOICE_ID
  if (VOICES.some((voice) => voice.id === normalized)) return normalized
  return DEFAULT_VOICE_ID
}

const BUSINESS_CATEGORIES = [
  { value: '', label: 'Select a category...' },
  { value: 'AUTO_DEALERSHIP', label: 'New & Used Car Dealership' },
  { value: 'AUTO_REPAIR', label: 'Auto Repair / Service Center' },
  { value: 'AUTO_BODY', label: 'Auto Body / Collision' },
  { value: 'PLUMBING', label: 'Plumbing' },
  { value: 'HVAC', label: 'HVAC / Heating & Cooling' },
  { value: 'ELECTRICAL', label: 'Electrical' },
  { value: 'GENERAL_CONTRACTOR', label: 'General Contractor' },
  { value: 'ROOFING', label: 'Roofing' },
  { value: 'OTHER', label: 'Other' },
]

interface Business {
  id: string
  name: string
  email: string | null
  phone: string | null
  telnyx_phone_number: string | null
  category: string | null
  voice_preference: string
  timezone: string | null
  subscription_tier: string
  subscription_status: string
}

export default function SettingsPage() {
  const { user: contextUser, refreshBusiness } = useUser()
  const [business, setBusiness] = useState<Business | null>(null)
  const [businessName, setBusinessName] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [businessPhone, setBusinessPhone] = useState('')
  const [businessCategory, setBusinessCategory] = useState('')
  const [selectedVoice, setSelectedVoice] = useState(DEFAULT_VOICE_ID)
  const [selectedTimezone, setSelectedTimezone] = useState('America/Los_Angeles')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [testPhoneNumber, setTestPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCalling, setIsCalling] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const searchParams = useSearchParams()

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasMountedRef = useRef(false)
  const savedTimerRef = useRef<NodeJS.Timeout | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001'
  const supabase = createClient()

  useEffect(() => {
    loadBusiness()
  }, [])

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    if (!business) return

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

    saveTimeoutRef.current = setTimeout(() => {
      performSave()
    }, 800)

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [businessName, businessEmail, businessCategory, selectedVoice, selectedTimezone])

  useEffect(() => {
    const billing = searchParams.get('billing')
    if (billing === 'success') {
      setMessage({ type: 'success', text: 'Subscription activated! Your plan has been updated.' })
      // Reload business data to reflect new tier
      loadBusiness()
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard/settings')
    } else if (billing === 'canceled') {
      setMessage({ type: 'error', text: 'Checkout was canceled. No changes were made.' })
      window.history.replaceState({}, '', '/dashboard/settings')
    }
  }, [searchParams])

  async function handleUpgrade(priceId: string) {
    setIsUpgrading(true)
    setMessage(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setMessage({ type: 'error', text: 'Please sign in to upgrade' })
        return
      }

      const res = await fetch(`${API_URL}/api/billing/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ price_id: priceId }),
      })

      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to start checkout' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to start checkout. Is the backend running?' })
    } finally {
      setIsUpgrading(false)
    }
  }

  async function handleManageBilling() {
    setIsUpgrading(true)
    setMessage(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setMessage({ type: 'error', text: 'Please sign in to manage billing' })
        return
      }

      const res = await fetch(`${API_URL}/api/billing/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to open billing portal' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to open billing portal. Is the backend running?' })
    } finally {
      setIsUpgrading(false)
    }
  }

  async function loadBusiness() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsLoading(false)
        return
      }

      const { data: businessData, error } = await supabase
        .from('b2b_businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Failed to load business:', error)
      }

      if (businessData) {
        setBusiness(businessData)
        setBusinessName(businessData.name || '')
        setBusinessEmail(businessData.email || user.email || '')
        setBusinessPhone(businessData.phone || '')
        setBusinessCategory(businessData.category || '')
        const normalizedVoice = normalizeVoicePreference(businessData.voice_preference)
        setSelectedVoice(normalizedVoice)
        setSelectedTimezone(businessData.timezone || 'America/Los_Angeles')
      } else {
        setBusinessEmail(user.email || '')
        const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone
        if (TIMEZONES.some(tz => tz.value === browserTz)) {
          setSelectedTimezone(browserTz)
        }
      }
    } catch (error) {
      console.error('Failed to load business:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateBusiness() {
    if (!businessName.trim()) {
      setMessage({ type: 'error', text: 'Please enter a business name' })
      return
    }

    setIsCreating(true)
    setMessage(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setMessage({ type: 'error', text: 'Not authenticated' })
        return
      }

      const { data, error } = await supabase
        .from('b2b_businesses')
        .insert({
          name: businessName.trim(),
          email: businessEmail.trim() || null,
          phone: businessPhone.trim() || null,
          owner_id: user.id,
          voice_preference: selectedVoice,
          timezone: selectedTimezone
        })
        .select()
        .single()

      if (error) throw error

      setBusiness(data)
      await refreshBusiness()
      setMessage({ type: 'success', text: 'Business created successfully!' })
    } catch (error: any) {
      console.error('Failed to create business:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to create business' })
    } finally {
      setIsCreating(false)
    }
  }

  const performSave = async () => {
    if (!business) return

    setSaveStatus('saving')

    try {
      const { error } = await supabase
        .from('b2b_businesses')
        .update({
          name: businessName.trim(),
          email: businessEmail.trim() || null,
          category: businessCategory || null,
          voice_preference: selectedVoice,
          timezone: selectedTimezone,
        })
        .eq('id', business.id)

      if (error) throw error

      await refreshBusiness()
      setSaveStatus('saved')
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
      savedTimerRef.current = setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error: any) {
      console.error('Failed to save settings:', error)
      setSaveStatus('error')
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
      savedTimerRef.current = setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const handleTestCall = async () => {
    const rawDigits = testPhoneNumber.replace(/\D/g, '')
    if (!business || !rawDigits) {
      setMessage({ type: 'error', text: 'Please enter a phone number' })
      return
    }

    if (rawDigits.length !== 10) {
      setMessage({ type: 'error', text: 'Please enter a valid 10-digit phone number' })
      return
    }

    setIsCalling(true)
    setMessage(null)

    try {
      // Get current session for auth token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setMessage({ type: 'error', text: 'Please sign in to make test calls' })
        setIsCalling(false)
        return
      }

      const res = await fetch(`${API_URL}/api/test-call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          phone: `+1${rawDigits}`,
          voice_preference: selectedVoice,
          business_id: business.id,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        const voiceName = VOICES.find(v => v.id === selectedVoice)?.name || selectedVoice
        setMessage({ type: 'success', text: `Test call initiated! Your phone should ring shortly. Using voice: ${voiceName}` })
      } else if (res.status === 401) {
        setMessage({ type: 'error', text: 'Session expired. Please refresh the page and try again.' })
      } else if (res.status === 429) {
        setMessage({ type: 'error', text: 'Too many requests. Please wait a minute before trying again.' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to initiate test call' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to initiate test call. Is the backend running?' })
    } finally {
      setIsCalling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Settings</p>
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#0f1f1a]/20 border-t-[#f97316]" />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Welcome</p>
          <h1 className="font-display text-3xl sm:text-4xl">Let&apos;s set up your business</h1>
          <p className="mt-2 text-sm text-[#0f1f1a]/60">We&apos;ll use this to personalize your dealership assistant.</p>
        </div>

        {message && (
          <div className={`rounded-2xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-[#0f766e]/30 bg-[#0f766e]/10 text-[#0f766e]' : 'border-[#ef4444]/30 bg-[#ef4444]/10 text-[#991b1b]'}`}>
            {message.text}
          </div>
        )}

        <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
          <h3 className="font-display text-2xl">Business information</h3>
          <p className="mt-2 text-sm text-[#0f1f1a]/60">Tell us how your AI receptionist should represent your dealership.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="setup-business-name" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                Business name *
              </label>
              <input
                type="text"
                id="setup-business-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Sunset Motors"
                className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="setup-business-email" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                Business email
              </label>
              <input
                type="email"
                id="setup-business-email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="contact@acme.com"
                className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="setup-business-phone" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                Business phone
              </label>
              <input
                type="tel"
                id="setup-business-phone"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="setup-timezone" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                Timezone
              </label>
              <select
                id="setup-timezone"
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Choose AI voice</p>
            <div className="mt-4 grid gap-3">
              {VOICES.map((voice) => (
                <label
                  key={voice.id}
                  className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                    selectedVoice === voice.id
                      ? 'border-[#0f1f1a] bg-[#0f1f1a] text-white'
                      : 'border-[#0f1f1a]/10 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="voice"
                    value={voice.id}
                    checked={selectedVoice === voice.id}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="mt-1 h-4 w-4"
                  />
                  <div className="flex-1">
                    <span className="font-semibold">{voice.name}</span>
                    {voice.tag && (
                      <span className={`ml-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        selectedVoice === voice.id ? 'bg-[#f97316] text-white' : 'bg-[#f97316]/10 text-[#f97316]'
                      }`}>{voice.tag}</span>
                    )}
                    <span className={`block text-xs ${selectedVoice === voice.id ? 'text-white/70' : 'text-[#0f1f1a]/60'}`}>
                      {voice.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleCreateBusiness}
            disabled={isCreating || !businessName.trim()}
            className="mt-8 w-full rounded-full bg-[#f97316] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition disabled:opacity-60"
          >
            {isCreating ? 'Creating...' : 'Create business'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Settings</p>
        <h1 className="font-display text-3xl sm:text-4xl">Business controls</h1>
        <p className={`mt-2 text-sm transition-colors ${
          saveStatus === 'saved' ? 'text-[#0f766e]' :
          saveStatus === 'error' ? 'text-[#ef4444]' :
          'text-[#0f1f1a]/60'
        }`}>
          {saveStatus === 'saving' ? 'Saving...' :
           saveStatus === 'saved' ? 'All changes saved' :
           saveStatus === 'error' ? 'Failed to save' :
           'Update your profile, voice, and call settings.'}
        </p>
      </div>

      {message && (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-[#0f766e]/30 bg-[#0f766e]/10 text-[#0f766e]' : 'border-[#ef4444]/30 bg-[#ef4444]/10 text-[#991b1b]'}`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
            <h3 className="font-display text-2xl">Business profile</h3>
            <p className="mt-2 text-sm text-[#0f1f1a]/60">Keep your information current.</p>

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="business-name" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                  Business name
                </label>
                <input
                  type="text"
                  id="business-name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="business-email" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                  Business email
                </label>
                <input
                  type="email"
                  id="business-email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                  Business phone
                </label>
                <div className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] px-4 py-3 text-sm text-[#0f1f1a]/60">
                  {businessPhone || 'Not set'}
                </div>
                <p className="mt-1 text-xs text-[#0f1f1a]/40">Assigned by admin</p>
              </div>
              {business.telnyx_phone_number && (
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                    Receptionist number
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] px-4 py-3 text-sm font-semibold text-[#0f1f1a]">
                      {business.telnyx_phone_number}
                    </div>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(business.telnyx_phone_number!)}
                      className="rounded-2xl border border-[#0f1f1a]/10 bg-white px-3 py-3 text-xs text-[#0f1f1a]/60 transition hover:border-[#0f1f1a]/30"
                      title="Copy number"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-[#0f1f1a]/40">Inbound calls to this number go to your AI receptionist</p>
                </div>
              )}
              <div>
                <label htmlFor="business-category" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                  Business category
                </label>
                <select
                  id="business-category"
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="business-timezone" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                  Timezone
                </label>
                <select
                  id="business-timezone"
                  value={selectedTimezone}
                  onChange={(e) => setSelectedTimezone(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Subscription</div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-white px-3 py-1 text-[#0f1f1a]">{business.subscription_tier}</span>
                  <span className="rounded-full bg-[#0f1f1a]/10 px-3 py-1 text-[#0f1f1a]/70">{business.subscription_status}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {business.subscription_tier === 'FREE' && STRIPE_STARTER_PRICE_ID && (
                    <button
                      onClick={() => handleUpgrade(STRIPE_STARTER_PRICE_ID)}
                      disabled={isUpgrading}
                      className="rounded-full bg-[#f97316] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#ea580c] disabled:opacity-60"
                    >
                      {isUpgrading ? 'Redirecting...' : 'Upgrade to Starter — $200/mo'}
                    </button>
                  )}
                  {(business.subscription_tier === 'FREE' || business.subscription_tier === 'STARTER') && STRIPE_PRO_PRICE_ID && (
                    <button
                      onClick={() => handleUpgrade(STRIPE_PRO_PRICE_ID)}
                      disabled={isUpgrading}
                      className="rounded-full bg-[#0f1f1a] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0f1f1a]/80 disabled:opacity-60"
                    >
                      {isUpgrading ? 'Redirecting...' : 'Upgrade to Pro — $300/mo'}
                    </button>
                  )}
                  {business.subscription_tier !== 'FREE' && (
                    <button
                      onClick={handleManageBilling}
                      disabled={isUpgrading}
                      className="rounded-full border border-[#0f1f1a]/20 bg-white px-4 py-2 text-xs font-semibold text-[#0f1f1a]/70 transition hover:border-[#0f1f1a]/40 disabled:opacity-60"
                    >
                      {isUpgrading ? 'Redirecting...' : 'Manage billing & invoices'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
            <h3 className="font-display text-2xl">AI voice</h3>
            <p className="mt-2 text-sm text-[#0f1f1a]/60">Choose the voice callers will hear on inbound and follow-up calls.</p>

            <div className="mt-4 grid gap-3">
              {VOICES.map((voice) => (
                <label
                  key={voice.id}
                  className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                    selectedVoice === voice.id
                      ? 'border-[#0f1f1a] bg-[#0f1f1a] text-white'
                      : 'border-[#0f1f1a]/10 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="voice"
                    value={voice.id}
                    checked={selectedVoice === voice.id}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="mt-1 h-4 w-4"
                  />
                  <div className="flex-1">
                    <span className="font-semibold">{voice.name}</span>
                    {voice.tag && (
                      <span className={`ml-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        selectedVoice === voice.id ? 'bg-[#f97316] text-white' : 'bg-[#f97316]/10 text-[#f97316]'
                      }`}>{voice.tag}</span>
                    )}
                    <span className={`block text-xs ${selectedVoice === voice.id ? 'text-white/70' : 'text-[#0f1f1a]/60'}`}>
                      {voice.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>

          </div>

        </div>

        <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
          <h3 className="font-display text-2xl">Test call</h3>
          <p className="mt-2 text-sm text-[#0f1f1a]/60">Hear the selected voice before you go live.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="testPhone" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                Phone number
              </label>
              <div className={`mt-2 flex items-center rounded-2xl border bg-white overflow-hidden ${
                testPhoneNumber && testPhoneNumber.replace(/\D/g, '').length === 10
                  ? 'border-[#0f766e]'
                  : testPhoneNumber && testPhoneNumber.replace(/\D/g, '').length > 0
                    ? 'border-[#ef4444]'
                    : 'border-[#0f1f1a]/20'
              }`}>
                <span className="select-none bg-[#f8f5ef] px-3 py-3 text-sm text-[#0f1f1a]/50 border-r border-[#0f1f1a]/10">+1</span>
                <input
                  type="tel"
                  id="testPhone"
                  value={testPhoneNumber}
                  onChange={(e) => setTestPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="2506828899"
                  className="w-full px-3 py-3 text-sm focus:outline-none bg-transparent"
                />
              </div>
              {testPhoneNumber && testPhoneNumber.replace(/\D/g, '').length > 0 && testPhoneNumber.replace(/\D/g, '').length !== 10 && (
                <p className="mt-1 text-xs text-[#ef4444]">Enter a 10-digit phone number</p>
              )}
            </div>

            <button
              onClick={handleTestCall}
              disabled={isCalling || !testPhoneNumber.trim()}
              className="w-full rounded-full bg-[#f97316] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition disabled:opacity-60"
            >
              {isCalling ? 'Calling...' : 'Make test call'}
            </button>

            <p className="text-xs text-[#0f1f1a]/60">
              The test call will use the currently selected voice ({VOICES.find(v => v.id === selectedVoice)?.name || 'Unknown'}).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
