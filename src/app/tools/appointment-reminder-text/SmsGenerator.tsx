'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from '@/lib/hooks/useForm'
import {
  industries,
  messageTypes,
  generateSmsTemplates,
  type IndustryKey,
  type MessageType,
} from './sms-data'

export default function SmsGenerator() {
  const { values, handleChange } = useForm({
    businessName: '',
    industry: '' as IndustryKey | '',
    customerName: '',
    serviceName: '',
    date: '',
    time: '',
  })

  const [messageType, setMessageType] = useState<MessageType>('day_before')
  const [templates, setTemplates] = useState<string[]>([])
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const handleGenerate = () => {
    const result = generateSmsTemplates({
      businessName: values.businessName,
      industry: (values.industry || 'other') as IndustryKey,
      customerName: values.customerName,
      serviceName: values.serviceName,
      date: values.date,
      time: values.time,
      messageType,
    })
    setTemplates(result)
    setCopiedIdx(null)
  }

  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Form */}
      <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="space-y-5">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-[#0f1f1a] mb-1.5">Business Name</label>
            <input id="businessName" name="businessName" type="text" value={values.businessName} onChange={handleChange} placeholder="e.g. Bloom Dental" className="block w-full rounded-xl border border-[#0f1f1a]/20 bg-white px-4 py-3 shadow-sm placeholder-[#0f1f1a]/40 focus:border-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-colors" />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-[#0f1f1a] mb-1.5">Industry</label>
            <select id="industry" name="industry" value={values.industry} onChange={handleChange} className="block w-full rounded-xl border border-[#0f1f1a]/20 bg-white px-4 py-3 shadow-sm text-[#0f1f1a] focus:border-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-colors">
              <option value="">Select your industry...</option>
              {industries.map((ind) => (<option key={ind.value} value={ind.value}>{ind.label}</option>))}
            </select>
          </div>

          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-[#0f1f1a] mb-1.5">Customer Name</label>
            <input id="customerName" name="customerName" type="text" value={values.customerName} onChange={handleChange} placeholder="[Customer Name]" className="block w-full rounded-xl border border-[#0f1f1a]/20 bg-white px-4 py-3 shadow-sm placeholder-[#0f1f1a]/40 focus:border-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-colors" />
          </div>

          <div>
            <label htmlFor="serviceName" className="block text-sm font-medium text-[#0f1f1a] mb-1.5">Service</label>
            <input id="serviceName" name="serviceName" type="text" value={values.serviceName} onChange={handleChange} placeholder="e.g. Teeth Cleaning" className="block w-full rounded-xl border border-[#0f1f1a]/20 bg-white px-4 py-3 shadow-sm placeholder-[#0f1f1a]/40 focus:border-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-[#0f1f1a] mb-1.5">Date</label>
              <input id="date" name="date" type="date" value={values.date} onChange={handleChange} className="block w-full rounded-xl border border-[#0f1f1a]/20 bg-white px-4 py-3 shadow-sm focus:border-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-colors" />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-[#0f1f1a] mb-1.5">Time</label>
              <input id="time" name="time" type="time" value={values.time} onChange={handleChange} className="block w-full rounded-xl border border-[#0f1f1a]/20 bg-white px-4 py-3 shadow-sm focus:border-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-colors" />
            </div>
          </div>

          {/* Message Type pills */}
          <div>
            <label className="block text-sm font-medium text-[#0f1f1a] mb-2">Message Type</label>
            <div className="flex flex-wrap gap-2">
              {messageTypes.map((mt) => (
                <button key={mt.value} type="button" onClick={() => { setMessageType(mt.value); setTemplates([]); setCopiedIdx(null) }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${messageType === mt.value ? 'bg-[#0f1f1a] text-white' : 'border border-[#0f1f1a]/20 text-[#0f1f1a]/70 hover:border-[#0f1f1a]/40'}`}>
                  {mt.label}
                </button>
              ))}
            </div>
          </div>

          <button type="button" onClick={handleGenerate} className="w-full rounded-full bg-[#f97316] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:shadow-xl">
            Generate SMS Templates
          </button>
        </div>
      </div>

      {/* Output */}
      <div className="space-y-6">
        {templates.length > 0 ? (
          <>
            {templates.map((tpl, idx) => (
              <div key={idx} className="rounded-3xl bg-[#0f1f1a] p-6 text-white shadow-lg">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                    Option {idx + 1} &middot; {tpl.length} characters
                  </span>
                  <button type="button" onClick={() => handleCopy(tpl, idx)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20">
                    {copiedIdx === idx ? (
                      <><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Copied!</>
                    ) : (
                      <><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>Copy</>
                    )}
                  </button>
                </div>
                <p className="text-sm leading-relaxed text-white/90">{tpl}</p>
                {tpl.length > 160 && (
                  <p className="mt-2 text-xs text-orange-300">⚠ Over 160 characters — may be sent as 2 SMS segments</p>
                )}
              </div>
            ))}

            {/* CTA */}
            <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm">
              <p className="text-base font-semibold text-[#0f1f1a]">Texts get ignored. AI phone calls don&apos;t.</p>
              <p className="mt-2 text-sm text-[#0f1f1a]/60">SMS open rates are declining. OneSpec makes AI-powered reminder calls that sound human, capture confirmations, and handle reschedules — automatically.</p>
              <Link href="/signup" className="mt-4 inline-flex items-center justify-center rounded-full bg-[#f97316] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5">
                Try OneSpec free
              </Link>
            </div>
          </>
        ) : (
          <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-dashed border-[#0f1f1a]/20 bg-white/50 p-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f1f1a]/5">
                <svg className="h-8 w-8 text-[#0f1f1a]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#0f1f1a]/50">Fill in the form and click &ldquo;Generate SMS Templates&rdquo; to create your reminder messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
