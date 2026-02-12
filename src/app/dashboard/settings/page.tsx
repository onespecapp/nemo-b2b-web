'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { isValidE164Phone, formatPhoneForApi } from '@/lib/validation'
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

const VOICES = [
  { id: 'Puck', name: 'Puck', description: 'Friendly and warm - great for welcoming calls', tone: 'Upbeat', gender: 'Male' },
  { id: 'Charon', name: 'Charon', description: 'Calm and professional - ideal for business reminders', tone: 'Composed', gender: 'Male' },
  { id: 'Kore', name: 'Kore', description: 'Gentle and caring - perfect for healthcare', tone: 'Nurturing', gender: 'Female' },
  { id: 'Fenrir', name: 'Fenrir', description: 'Confident and clear - suited for important notices', tone: 'Assertive', gender: 'Male' },
  { id: 'Aoede', name: 'Aoede', description: 'Soft and soothing - best for relaxed conversations', tone: 'Mellow', gender: 'Female' },
]

const VOICE_STYLES = [
  { id: 'professional', label: 'Professional', description: 'Clear and business-like' },
  { id: 'friendly', label: 'Friendly', description: 'Approachable and personable' },
  { id: 'warm', label: 'Warm', description: 'Empathetic and reassuring' },
  { id: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
]

const SPEAKING_RATE_LABELS: Record<string, string> = {
  '0.8': 'Slow',
  '0.9': 'Relaxed',
  '1': 'Normal',
  '1.1': 'Slightly fast',
  '1.2': 'Fast',
  '1.3': 'Very fast',
}

const LANGUAGES = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-CA', label: 'English (Canada)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'en-AU', label: 'English (Australia)' },
  { value: 'fr-CA', label: 'French (Canada)' },
  { value: 'es-US', label: 'Spanish (US)' },
]

interface Business {
  id: string
  name: string
  email: string | null
  phone: string | null
  voice_preference: string
  speaking_rate: number
  voice_style: string
  custom_greeting: string | null
  end_of_call_message: string | null
  language: string
  timezone: string | null
  subscription_tier: string
  subscription_status: string
}

interface OriginalValues {
  name: string
  email: string
  phone: string
  voice: string
  timezone: string
  speakingRate: number
  voiceStyle: string
  customGreeting: string
  endOfCallMessage: string
  language: string
}

function VoiceWaveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[3px]" aria-hidden="true">
      {[0.6, 1, 0.7, 0.9, 0.5].map((h, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full transition-all duration-300 ${
            active ? 'bg-[#f97316]' : 'bg-[#0f1f1a]/20'
          }`}
          style={{
            height: active ? `${h * 20}px` : '4px',
            animation: active ? `voicePulse 1.2s ease-in-out ${i * 0.15}s infinite alternate` : 'none',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes voicePulse {
          0% { transform: scaleY(0.6); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  )
}

export default function SettingsPage() {
  const { user: contextUser, refreshBusiness } = useUser()
  const [business, setBusiness] = useState<Business | null>(null)
  const [businessName, setBusinessName] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [businessPhone, setBusinessPhone] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('Aoede')
  const [selectedTimezone, setSelectedTimezone] = useState('America/Los_Angeles')
  const [speakingRate, setSpeakingRate] = useState(1.0)
  const [voiceStyle, setVoiceStyle] = useState('professional')
  const [customGreeting, setCustomGreeting] = useState('')
  const [endOfCallMessage, setEndOfCallMessage] = useState('')
  const [language, setLanguage] = useState('en-US')
  const [originalValues, setOriginalValues] = useState<OriginalValues>({
    name: '', email: '', phone: '', voice: 'Aoede', timezone: 'America/Los_Angeles',
    speakingRate: 1.0, voiceStyle: 'professional', customGreeting: '', endOfCallMessage: '', language: 'en-US',
  })
  const [testPhoneNumber, setTestPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isCalling, setIsCalling] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001'
  const supabase = createClient()

  useEffect(() => {
    loadBusiness()
  }, [])

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
        setSelectedVoice(businessData.voice_preference || 'Aoede')
        setSelectedTimezone(businessData.timezone || 'America/Los_Angeles')
        setSpeakingRate(businessData.speaking_rate ?? 1.0)
        setVoiceStyle(businessData.voice_style || 'professional')
        setCustomGreeting(businessData.custom_greeting || '')
        setEndOfCallMessage(businessData.end_of_call_message || '')
        setLanguage(businessData.language || 'en-US')
        setOriginalValues({
          name: businessData.name || '',
          email: businessData.email || '',
          phone: businessData.phone || '',
          voice: businessData.voice_preference || 'Aoede',
          timezone: businessData.timezone || 'America/Los_Angeles',
          speakingRate: businessData.speaking_rate ?? 1.0,
          voiceStyle: businessData.voice_style || 'professional',
          customGreeting: businessData.custom_greeting || '',
          endOfCallMessage: businessData.end_of_call_message || '',
          language: businessData.language || 'en-US',
        })
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
          speaking_rate: speakingRate,
          voice_style: voiceStyle,
          custom_greeting: customGreeting.trim() || null,
          end_of_call_message: endOfCallMessage.trim() || null,
          language,
          timezone: selectedTimezone
        })
        .select()
        .single()

      if (error) throw error

      setBusiness(data)
      setOriginalValues({
        name: data.name,
        email: data.email || '',
        phone: data.phone || '',
        voice: data.voice_preference,
        timezone: data.timezone || 'America/Los_Angeles',
        speakingRate: data.speaking_rate ?? 1.0,
        voiceStyle: data.voice_style || 'professional',
        customGreeting: data.custom_greeting || '',
        endOfCallMessage: data.end_of_call_message || '',
        language: data.language || 'en-US',
      })
      await refreshBusiness()
      setMessage({ type: 'success', text: 'Business created successfully!' })
    } catch (error: any) {
      console.error('Failed to create business:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to create business' })
    } finally {
      setIsCreating(false)
    }
  }

  const handleSave = async () => {
    if (!business) return

    setIsSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('b2b_businesses')
        .update({
          name: businessName.trim(),
          email: businessEmail.trim() || null,
          phone: businessPhone.trim() || null,
          voice_preference: selectedVoice,
          speaking_rate: speakingRate,
          voice_style: voiceStyle,
          custom_greeting: customGreeting.trim() || null,
          end_of_call_message: endOfCallMessage.trim() || null,
          language,
          timezone: selectedTimezone
        })
        .eq('id', business.id)

      if (error) throw error

      setOriginalValues({
        name: businessName,
        email: businessEmail,
        phone: businessPhone,
        voice: selectedVoice,
        timezone: selectedTimezone,
        speakingRate,
        voiceStyle,
        customGreeting,
        endOfCallMessage,
        language,
      })
      await refreshBusiness()
      setMessage({ type: 'success', text: 'Settings saved successfully!' })
    } catch (error: any) {
      console.error('Failed to save settings:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to save settings' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestCall = async () => {
    if (!business || !testPhoneNumber.trim()) {
      setMessage({ type: 'error', text: 'Please enter a phone number' })
      return
    }

    if (!isValidE164Phone(testPhoneNumber)) {
      setMessage({ type: 'error', text: 'Please enter a valid phone number (e.g., +1234567890)' })
      return
    }

    setIsCalling(true)
    setMessage(null)

    try {
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
          phone: formatPhoneForApi(testPhoneNumber),
          voice_preference: selectedVoice,
          speaking_rate: speakingRate,
          voice_style: voiceStyle,
          custom_greeting: customGreeting.trim() || null,
          end_of_call_message: endOfCallMessage.trim() || null,
          language,
          business_id: business.id,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: `Test call initiated! Your phone should ring shortly. Voice: ${selectedVoice}, Style: ${voiceStyle}, Rate: ${speakingRate}x` })
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

  const hasChanges = business && (
    businessName !== originalValues.name ||
    businessEmail !== originalValues.email ||
    businessPhone !== originalValues.phone ||
    selectedVoice !== originalValues.voice ||
    selectedTimezone !== originalValues.timezone ||
    speakingRate !== originalValues.speakingRate ||
    voiceStyle !== originalValues.voiceStyle ||
    customGreeting !== originalValues.customGreeting ||
    endOfCallMessage !== originalValues.endOfCallMessage ||
    language !== originalValues.language
  )

  const speakingRateLabel = SPEAKING_RATE_LABELS[String(speakingRate)] || `${speakingRate}x`

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
          <p className="mt-2 text-sm text-[#0f1f1a]/60">We&apos;ll use this to personalize reminder calls.</p>
        </div>

        {message && (
          <div className={`rounded-2xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-[#0f766e]/30 bg-[#0f766e]/10 text-[#0f766e]' : 'border-[#ef4444]/30 bg-[#ef4444]/10 text-[#991b1b]'}`}>
            {message.text}
          </div>
        )}

        <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
          <h3 className="font-display text-2xl">Business information</h3>
          <p className="mt-2 text-sm text-[#0f1f1a]/60">Tell us where your reminders should sound like they came from.</p>

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
                placeholder="Acme Healthcare"
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
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{voice.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        selectedVoice === voice.id ? 'bg-white/20 text-white/80' : 'bg-[#0f1f1a]/5 text-[#0f1f1a]/50'
                      }`}>
                        {voice.gender}
                      </span>
                    </div>
                    <span className={`block text-xs ${selectedVoice === voice.id ? 'text-white/70' : 'text-[#0f1f1a]/60'}`}>
                      {voice.description}
                    </span>
                  </div>
                  <VoiceWaveform active={selectedVoice === voice.id} />
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
        <p className="mt-2 text-sm text-[#0f1f1a]/60">Update your profile, voice, and call settings.</p>
      </div>

      {message && (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-[#0f766e]/30 bg-[#0f766e]/10 text-[#0f766e]' : 'border-[#ef4444]/30 bg-[#ef4444]/10 text-[#991b1b]'}`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Business profile */}
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
                <label htmlFor="business-phone" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                  Business phone
                </label>
                <input
                  type="tel"
                  id="business-phone"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                />
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
              </div>
            </div>
          </div>

          {/* AI Voice selection */}
          <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl">AI voice</h3>
                <p className="mt-2 text-sm text-[#0f1f1a]/60">Choose the tone customers will hear.</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#0f766e]/20 bg-[#0f766e]/10 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-[#0f766e] animate-pulse" />
                <span className="text-[11px] font-semibold text-[#0f766e]">HD Voice</span>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {VOICES.map((voice) => (
                <label
                  key={voice.id}
                  className={`group flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition cursor-pointer ${
                    selectedVoice === voice.id
                      ? 'border-[#0f1f1a] bg-[#0f1f1a] text-white'
                      : 'border-[#0f1f1a]/10 bg-white hover:border-[#0f1f1a]/30'
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
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{voice.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        selectedVoice === voice.id ? 'bg-white/20 text-white/80' : 'bg-[#0f1f1a]/5 text-[#0f1f1a]/50'
                      }`}>
                        {voice.gender}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        selectedVoice === voice.id ? 'bg-[#f97316]/30 text-[#f97316]' : 'bg-[#f97316]/10 text-[#b45309]'
                      }`}>
                        {voice.tone}
                      </span>
                    </div>
                    <span className={`block text-xs mt-0.5 ${selectedVoice === voice.id ? 'text-white/70' : 'text-[#0f1f1a]/60'}`}>
                      {voice.description}
                    </span>
                  </div>
                  <VoiceWaveform active={selectedVoice === voice.id} />
                </label>
              ))}
            </div>
          </div>

          {/* Voice quality tuning */}
          <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
            <h3 className="font-display text-2xl">Voice quality</h3>
            <p className="mt-2 text-sm text-[#0f1f1a]/60">Fine-tune how your AI assistant sounds on calls.</p>

            <div className="mt-6 space-y-6">
              {/* Speaking rate */}
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="speaking-rate" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                    Speaking pace
                  </label>
                  <span className="rounded-full bg-[#0f1f1a]/5 px-2.5 py-1 text-xs font-semibold text-[#0f1f1a]">
                    {speakingRate}x - {speakingRateLabel}
                  </span>
                </div>
                <input
                  type="range"
                  id="speaking-rate"
                  min="0.8"
                  max="1.3"
                  step="0.1"
                  value={speakingRate}
                  onChange={(e) => setSpeakingRate(parseFloat(e.target.value))}
                  className="mt-3 w-full accent-[#f97316]"
                />
                <div className="mt-1 flex justify-between text-[10px] text-[#0f1f1a]/40">
                  <span>Slower</span>
                  <span>Normal</span>
                  <span>Faster</span>
                </div>
              </div>

              {/* Conversation style */}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">Conversation style</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {VOICE_STYLES.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setVoiceStyle(style.id)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        voiceStyle === style.id
                          ? 'border-[#0f1f1a] bg-[#0f1f1a] text-white'
                          : 'border-[#0f1f1a]/10 bg-white hover:border-[#0f1f1a]/30'
                      }`}
                    >
                      <span className="block font-semibold">{style.label}</span>
                      <span className={`block text-[11px] mt-0.5 ${
                        voiceStyle === style.id ? 'text-white/60' : 'text-[#0f1f1a]/50'
                      }`}>
                        {style.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label htmlFor="language" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Custom greeting + sign-off */}
          <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
            <h3 className="font-display text-2xl">Call script</h3>
            <p className="mt-2 text-sm text-[#0f1f1a]/60">Customize what customers hear at the start and end of each call.</p>

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="custom-greeting" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                  Opening greeting
                </label>
                <textarea
                  id="custom-greeting"
                  value={customGreeting}
                  onChange={(e) => setCustomGreeting(e.target.value)}
                  placeholder="Hi {customer_name}, this is {business_name} calling about your upcoming appointment..."
                  rows={3}
                  maxLength={500}
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none resize-none"
                />
                <div className="mt-1 flex items-center justify-between text-[11px] text-[#0f1f1a]/40">
                  <span>Use {'{customer_name}'}, {'{business_name}'}, {'{appointment_time}'} as placeholders</span>
                  <span>{customGreeting.length}/500</span>
                </div>
              </div>

              <div>
                <label htmlFor="end-of-call" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                  Sign-off message
                </label>
                <textarea
                  id="end-of-call"
                  value={endOfCallMessage}
                  onChange={(e) => setEndOfCallMessage(e.target.value)}
                  placeholder="Thank you! We look forward to seeing you. Have a great day!"
                  rows={2}
                  maxLength={300}
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none resize-none"
                />
                <div className="mt-1 text-right text-[11px] text-[#0f1f1a]/40">
                  {endOfCallMessage.length}/300
                </div>
              </div>

              {(customGreeting || endOfCallMessage) && (
                <div className="rounded-2xl border border-[#0f1f1a]/10 bg-[#0f1f1a] p-4 text-white">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Call preview</p>
                  <div className="mt-3 space-y-2 text-sm">
                    {customGreeting && (
                      <div className="rounded-xl bg-white/10 px-3 py-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Opening</span>
                        <p className="mt-1 text-white/80">{customGreeting}</p>
                      </div>
                    )}
                    <div className="text-center text-[10px] text-white/30">... conversation ...</div>
                    {endOfCallMessage && (
                      <div className="rounded-xl bg-white/10 px-3 py-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Sign-off</span>
                        <p className="mt-1 text-white/80">{endOfCallMessage}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="rounded-full bg-[#0f1f1a] px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Test call */}
          <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
            <h3 className="font-display text-2xl">Test call</h3>
            <p className="mt-2 text-sm text-[#0f1f1a]/60">Hear all your settings in action before going live.</p>

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="testPhone" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                  Phone number
                </label>
                <input
                  type="tel"
                  id="testPhone"
                  value={testPhoneNumber}
                  onChange={(e) => setTestPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                />
              </div>

              <button
                onClick={handleTestCall}
                disabled={isCalling || !testPhoneNumber.trim()}
                className="w-full rounded-full bg-[#f97316] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition disabled:opacity-60"
              >
                {isCalling ? 'Calling...' : 'Make test call'}
              </button>

              <p className="text-xs text-[#0f1f1a]/60">
                The test call will use your current settings.
                {hasChanges && ' Save your changes first to test the latest configuration.'}
              </p>
            </div>

            {/* Current config summary */}
            <div className="mt-6 rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#0f1f1a]/50">Current configuration</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#0f1f1a]/60">Voice</span>
                  <span className="font-semibold text-[#0f1f1a]">{selectedVoice}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#0f1f1a]/60">Speaking pace</span>
                  <span className="font-semibold text-[#0f1f1a]">{speakingRate}x ({speakingRateLabel})</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#0f1f1a]/60">Style</span>
                  <span className="font-semibold text-[#0f1f1a] capitalize">{voiceStyle}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#0f1f1a]/60">Language</span>
                  <span className="font-semibold text-[#0f1f1a]">{LANGUAGES.find(l => l.value === language)?.label || language}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#0f1f1a]/60">Custom greeting</span>
                  <span className="font-semibold text-[#0f1f1a]">{customGreeting ? 'Yes' : 'Default'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#0f1f1a]/60">Sign-off</span>
                  <span className="font-semibold text-[#0f1f1a]">{endOfCallMessage ? 'Custom' : 'Default'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Voice quality tips */}
          <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
            <h3 className="font-display text-2xl">Quality tips</h3>
            <p className="mt-2 text-sm text-[#0f1f1a]/60">Get the best call quality for your customers.</p>

            <div className="mt-4 space-y-3">
              <div className="flex gap-3 rounded-2xl border border-[#0f1f1a]/5 bg-[#f8f5ef] p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f766e]/15 text-xs font-semibold text-[#0f766e]">1</div>
                <div>
                  <p className="text-sm font-semibold text-[#0f1f1a]">Match voice to your brand</p>
                  <p className="text-xs text-[#0f1f1a]/50">Healthcare? Try Kore. Barbershop? Puck fits perfectly.</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-[#0f1f1a]/5 bg-[#f8f5ef] p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f766e]/15 text-xs font-semibold text-[#0f766e]">2</div>
                <div>
                  <p className="text-sm font-semibold text-[#0f1f1a]">Tune the speaking pace</p>
                  <p className="text-xs text-[#0f1f1a]/50">Slow (0.9x) for older customers, normal (1.0x) for most businesses.</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-[#0f1f1a]/5 bg-[#f8f5ef] p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f766e]/15 text-xs font-semibold text-[#0f766e]">3</div>
                <div>
                  <p className="text-sm font-semibold text-[#0f1f1a]">Personalize the greeting</p>
                  <p className="text-xs text-[#0f1f1a]/50">Custom greetings with your business name build instant trust.</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-[#0f1f1a]/5 bg-[#f8f5ef] p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f766e]/15 text-xs font-semibold text-[#0f766e]">4</div>
                <div>
                  <p className="text-sm font-semibold text-[#0f1f1a]">Always test first</p>
                  <p className="text-xs text-[#0f1f1a]/50">Make a test call after any change to hear the full experience.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
