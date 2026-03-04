'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from '@/lib/hooks/useForm'
import {
  industries,
  generateTemplate,
  type Channel,
  type Tone,
  type IndustryKey,
} from './template-data'

const channels: { value: Channel; label: string }[] = [
  { value: 'sms', label: 'SMS' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone Script' },
]

const tones: { value: Tone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'casual', label: 'Casual' },
]

export default function TemplateGenerator() {
  const { values, handleChange } = useForm({
    businessName: '',
    industry: '' as IndustryKey | '',
    customerName: '',
    serviceName: '',
    date: '',
    time: '',
  })

  const [channel, setChannel] = useState<Channel>('sms')
  const [tone, setTone] = useState<Tone>('professional')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    const result = generateTemplate({
      businessName: values.businessName,
      industry: (values.industry || 'other') as IndustryKey,
      customerName: values.customerName,
      serviceName: values.serviceName,
      date: values.date,
      time: values.time,
      channel,
      tone,
    })
    setOutput(result)
    setCopied(false)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Left — Form */}
      <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-5">
          {/* Business Name */}
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-[#0f1f1a] mb-1.5">
              Business Name
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              value={values.businessName}
              onChange={handleChange}
              placeholder="e.g. Bloom Dental"
              className="block w-full rounded-xl border border-[#0f1f1a]/20 bg-white px-4 py-3 shadow-sm placeholder-[#0f1f1a]/40 focus:border-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-colors"
            />
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-[#0f1f1a] mb-1.5">
              Industry
            </label>
            <select
              id="industry"
              name="industry"
              value={values.industry}
              onChange={handleChange}
              className="block w-full rounded-xl border border-[#0f1f1a]/20 bg-white px-4 py-3 shadow-sm text-[#0f1f1a] focus:border-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-colors"
            >
              <option value="">Select your industry...</option>
              {industries.map((ind) => (
                <option key={ind.value} value={ind.value}>
                  {ind.label}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Name */}
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-[#0f1f1a] mb-1.5">
              Customer Name
            </label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              value={values.customerName}
              onChange={handleChange}
              placeholder="[Customer Name]"
              className="block w-full rounded-xl border border-[#0f1f1a]/20 bg-white px-4 py-3 shadow-sm placeholder-[#0f1f1a]/40 focus:border-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-colors"
            />
          </div>

          {/* Service Name */}
          <div>
            <label htmlFor="serviceName" className="block text-sm font-medium text-[#0f1f1a] mb-1.5">
              Service Name
            </label>
            <input
              id="serviceName"
              name="serviceName"
              type="text"
              value={values.serviceName}
              onChange={handleChange}
              placeholder="e.g. Dental Checkup"
              className="block w-full rounded-xl border border-[#0f1f1a]/20 bg-white px-4 py-3 shadow-sm placeholder-[#0f1f1a]/40 focus:border-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-colors"
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-[#0f1f1a] mb-1.5">
                Date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={values.date}
                onChange={handleChange}
                className="block w-full rounded-xl border border-[#0f1f1a]/20 bg-white px-4 py-3 shadow-sm focus:border-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-colors"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-[#0f1f1a] mb-1.5">
                Time
              </label>
              <input
                id="time"
                name="time"
                type="time"
                value={values.time}
                onChange={handleChange}
                className="block w-full rounded-xl border border-[#0f1f1a]/20 bg-white px-4 py-3 shadow-sm focus:border-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-colors"
              />
            </div>
          </div>

          {/* Channel pills */}
          <div>
            <label className="block text-sm font-medium text-[#0f1f1a] mb-2">Channel</label>
            <div className="flex gap-2">
              {channels.map((ch) => (
                <button
                  key={ch.value}
                  type="button"
                  onClick={() => { setChannel(ch.value); setOutput(''); setCopied(false) }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    channel === ch.value
                      ? 'bg-[#0f1f1a] text-white'
                      : 'border border-[#0f1f1a]/20 text-[#0f1f1a]/70 hover:border-[#0f1f1a]/40'
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone pills */}
          <div>
            <label className="block text-sm font-medium text-[#0f1f1a] mb-2">Tone</label>
            <div className="flex gap-2">
              {tones.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => { setTone(t.value); setOutput(''); setCopied(false) }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    tone === t.value
                      ? 'bg-[#0f1f1a] text-white'
                      : 'border border-[#0f1f1a]/20 text-[#0f1f1a]/70 hover:border-[#0f1f1a]/40'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            type="button"
            onClick={handleGenerate}
            className="w-full rounded-full bg-[#f97316] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Generate Template
          </button>
        </div>
      </div>

      {/* Right — Output */}
      <div className="space-y-6">
        {output ? (
          <>
            <div className="rounded-3xl bg-[#0f1f1a] p-6 text-white shadow-lg sm:p-8">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                  {channel === 'sms' ? 'SMS' : channel === 'email' ? 'Email' : 'Phone Script'} &middot;{' '}
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
                >
                  {copied ? (
                    <>
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/90">
                {output}
              </pre>
            </div>

            {/* CTA below output */}
            <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm">
              <p className="text-base font-semibold text-[#0f1f1a]">
                Tired of sending reminders manually?
              </p>
              <p className="mt-2 text-sm text-[#0f1f1a]/60">
                OneSpec sends AI-powered reminder calls that sound like your front desk. Customers confirm, cancel, or reschedule — automatically.
              </p>
              <Link
                href="/signup"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-[#f97316] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5"
              >
                Start free — no card required
              </Link>
            </div>
          </>
        ) : (
          <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-dashed border-[#0f1f1a]/20 bg-white/50 p-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f1f1a]/5">
                <svg className="h-8 w-8 text-[#0f1f1a]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#0f1f1a]/50">
                Fill in the form and click &ldquo;Generate Template&rdquo; to create your reminder
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
