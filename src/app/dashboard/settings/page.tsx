'use client'

import { useState, useEffect } from 'react'

const VOICES = [
  { id: 'Puck', name: 'Puck', description: 'Friendly and warm - great for welcoming calls' },
  { id: 'Charon', name: 'Charon', description: 'Calm and professional - ideal for business reminders' },
  { id: 'Kore', name: 'Kore', description: 'Gentle and caring - perfect for healthcare' },
  { id: 'Fenrir', name: 'Fenrir', description: 'Confident and clear - suited for important notices' },
  { id: 'Aoede', name: 'Aoede', description: 'Soft and soothing - best for relaxed conversations' },
]

// Hardcoded business_id for demo - in production, get from auth context
const DEMO_BUSINESS_ID = 'demo-business-001'

export default function SettingsPage() {
  const [selectedVoice, setSelectedVoice] = useState('Puck')
  const [originalVoice, setOriginalVoice] = useState('Puck')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isCalling, setIsCalling] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001'

  useEffect(() => {
    // Load current settings
    async function loadSettings() {
      try {
        const res = await fetch(`${API_URL}/businesses/${DEMO_BUSINESS_ID}/settings`)
        if (res.ok) {
          const data = await res.json()
          setSelectedVoice(data.voice_preference || 'Puck')
          setOriginalVoice(data.voice_preference || 'Puck')
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [API_URL])

  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)
    
    try {
      const res = await fetch(`${API_URL}/businesses/${DEMO_BUSINESS_ID}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voice_preference: selectedVoice }),
      })

      if (res.ok) {
        setOriginalVoice(selectedVoice)
        setMessage({ type: 'success', text: 'Settings saved successfully!' })
      } else {
        const error = await res.json()
        setMessage({ type: 'error', text: error.error || 'Failed to save settings' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Is the backend running?' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestCall = async () => {
    if (!phoneNumber.trim()) {
      setMessage({ type: 'error', text: 'Please enter a phone number' })
      return
    }

    setIsCalling(true)
    setMessage(null)

    try {
      const res = await fetch(`${API_URL}/businesses/${DEMO_BUSINESS_ID}/test-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: `Test call initiated! Your phone should ring shortly. Using voice: ${selectedVoice}` })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to initiate test call' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to initiate test call. Is the backend running?' })
    } finally {
      setIsCalling(false)
    }
  }

  const hasChanges = selectedVoice !== originalVoice

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <div className="animate-pulse bg-white shadow rounded-lg p-6">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Voice Selection */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">AI Voice</h3>
          <p className="mt-1 text-sm text-gray-500">
            Choose the voice for your AI appointment reminder calls
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {VOICES.map((voice) => (
              <label
                key={voice.id}
                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedVoice === voice.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="voice"
                  value={voice.id}
                  checked={selectedVoice === voice.id}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">
                    {voice.name}
                  </span>
                  <span className="block text-sm text-gray-500">
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
              className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                hasChanges && !isSaving
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Test Call */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Test Call</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try out the AI voice by making a test call to your phone
          </p>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleTestCall}
                disabled={isCalling || !phoneNumber.trim()}
                className={`px-6 py-2 rounded-md text-sm font-medium text-white ${
                  !isCalling && phoneNumber.trim()
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {isCalling ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calling...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Make Test Call
                  </span>
                )}
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            The test call will use the currently selected voice ({selectedVoice}). 
            {hasChanges && ' Save your changes first to test the new voice.'}
          </p>
        </div>
      </div>
    </div>
  )
}
