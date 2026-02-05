'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const VOICES = [
  { id: 'Puck', name: 'Puck', description: 'Friendly and warm - great for welcoming calls' },
  { id: 'Charon', name: 'Charon', description: 'Calm and professional - ideal for business reminders' },
  { id: 'Kore', name: 'Kore', description: 'Gentle and caring - perfect for healthcare' },
  { id: 'Fenrir', name: 'Fenrir', description: 'Confident and clear - suited for important notices' },
  { id: 'Aoede', name: 'Aoede', description: 'Soft and soothing - best for relaxed conversations' },
]

// Phone number validation (E.164 format)
const E164_PHONE_REGEX = /^\+?[1-9]\d{1,14}$/

function isValidPhoneNumber(phone: string): boolean {
  // Remove common formatting characters before validation
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  return E164_PHONE_REGEX.test(cleaned)
}

function formatPhoneForApi(phone: string): string {
  // Remove formatting and ensure + prefix
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`
}

interface Business {
  id: string
  name: string
  email: string | null
  phone: string | null
  voice_preference: string
  subscription_tier: string
  subscription_status: string
}

export default function SettingsPage() {
  const [business, setBusiness] = useState<Business | null>(null)
  const [businessName, setBusinessName] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [businessPhone, setBusinessPhone] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('Puck')
  const [originalValues, setOriginalValues] = useState({ name: '', email: '', phone: '', voice: 'Puck' })
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
        setSelectedVoice(businessData.voice_preference || 'Puck')
        setOriginalValues({
          name: businessData.name || '',
          email: businessData.email || '',
          phone: businessData.phone || '',
          voice: businessData.voice_preference || 'Puck'
        })
      } else {
        setBusinessEmail(user.email || '')
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
          voice_preference: selectedVoice
        })
        .select()
        .single()

      if (error) throw error

      setBusiness(data)
      setOriginalValues({
        name: data.name,
        email: data.email || '',
        phone: data.phone || '',
        voice: data.voice_preference
      })
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
          voice_preference: selectedVoice
        })
        .eq('id', business.id)

      if (error) throw error

      setOriginalValues({
        name: businessName,
        email: businessEmail,
        phone: businessPhone,
        voice: selectedVoice
      })
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

    // Validate phone number format
    if (!isValidPhoneNumber(testPhoneNumber)) {
      setMessage({ type: 'error', text: 'Please enter a valid phone number (e.g., +1234567890)' })
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
          phone: formatPhoneForApi(testPhoneNumber),
          voice_preference: selectedVoice,
          business_id: business.id,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: `Test call initiated! Your phone should ring shortly. Using voice: ${selectedVoice}` })
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
    selectedVoice !== originalValues.voice
  )

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
              <label htmlFor="name" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                Business name *
              </label>
              <input
                type="text"
                id="name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Acme Healthcare"
                className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                Business email
              </label>
              <input
                type="email"
                id="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="contact@acme.com"
                className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                Business phone
              </label>
              <input
                type="tel"
                id="phone"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
              />
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
                  <div>
                    <span className="block font-semibold">{voice.name}</span>
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
        <p className="mt-2 text-sm text-[#0f1f1a]/60">Update your profile, voice, and call settings.</p>
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
                <label htmlFor="name" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                  Business name
                </label>
                <input
                  type="text"
                  id="name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                  Business email
                </label>
                <input
                  type="email"
                  id="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60">
                  Business phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                />
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

          <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
            <h3 className="font-display text-2xl">AI voice</h3>
            <p className="mt-2 text-sm text-[#0f1f1a]/60">Choose the tone customers will hear.</p>

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
                  <div>
                    <span className="block font-semibold">{voice.name}</span>
                    <span className={`block text-xs ${selectedVoice === voice.id ? 'text-white/70' : 'text-[#0f1f1a]/60'}`}>
                      {voice.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className="rounded-full bg-[#0f1f1a] px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
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
              The test call will use the currently selected voice ({selectedVoice}).
              {hasChanges && ' Save your changes first to test the new voice.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
