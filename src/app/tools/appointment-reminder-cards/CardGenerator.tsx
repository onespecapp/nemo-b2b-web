'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useForm } from '@/lib/hooks/useForm'
import {
  industries,
  industryIcons,
  generateCardText,
  formatDate,
  formatTime,
  type IndustryKey,
} from './card-data'

export default function CardGenerator() {
  const { values, handleChange } = useForm({
    businessName: '',
    industry: '' as IndustryKey | '',
    customerName: '',
    serviceName: '',
    date: '',
    time: '',
    phone: '',
    address: '',
  })

  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleGenerate = () => {
    setGenerated(true)
    setCopied(false)
  }

  const handleCopy = async () => {
    const text = generateCardText({
      businessName: values.businessName,
      industry: (values.industry || 'other') as IndustryKey,
      customerName: values.customerName,
      serviceName: values.serviceName,
      date: values.date,
      time: values.time,
      phone: values.phone,
      address: values.address,
    })
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow || !cardRef.current) return
    printWindow.document.write(`
      <html><head><title>Appointment Reminder Card</title>
      <style>
        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fff; }
        .card { width: 3.5in; height: 2in; border: 2px solid #0f1f1a; border-radius: 12px; padding: 16px; box-sizing: border-box; }
        .biz-name { font-size: 14px; font-weight: 700; color: #0f766e; margin-bottom: 8px; }
        .label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-top: 6px; }
        .value { font-size: 11px; font-weight: 600; color: #0f1f1a; }
        .row { display: flex; gap: 12px; }
        .row > div { flex: 1; }
        .footer { margin-top: 8px; font-size: 8px; color: #888; border-top: 1px solid #ddd; padding-top: 4px; }
        @media print { body { margin: 0; } }
      </style></head><body>
      <div class="card">
        <div class="biz-name">${industryIcons[(values.industry || 'other') as IndustryKey]} ${values.businessName || '[Business Name]'}</div>
        <div class="label">Appointment for</div>
        <div class="value">${values.customerName || '[Customer Name]'}</div>
        <div class="row">
          <div><div class="label">Service</div><div class="value">${values.serviceName || '[Service]'}</div></div>
        </div>
        <div class="row">
          <div><div class="label">Date</div><div class="value">${formatDate(values.date)}</div></div>
          <div><div class="label">Time</div><div class="value">${formatTime(values.time)}</div></div>
        </div>
        <div class="footer">📞 ${values.phone || '[Phone]'} · 📍 ${values.address || '[Address]'}</div>
      </div>
      <script>window.onload=function(){window.print();}</script>
      </body></html>
    `)
    printWindow.document.close()
  }

  const industry = (values.industry || 'other') as IndustryKey
  const icon = industryIcons[industry]

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
              {industries.map((ind) => (
                <option key={ind.value} value={ind.value}>{ind.label}</option>
              ))}
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

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[#0f1f1a] mb-1.5">Business Phone</label>
            <input id="phone" name="phone" type="tel" value={values.phone} onChange={handleChange} placeholder="(604) 555-0123" className="block w-full rounded-xl border border-[#0f1f1a]/20 bg-white px-4 py-3 shadow-sm placeholder-[#0f1f1a]/40 focus:border-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-colors" />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-[#0f1f1a] mb-1.5">Business Address</label>
            <input id="address" name="address" type="text" value={values.address} onChange={handleChange} placeholder="123 Main St, Vancouver, BC" className="block w-full rounded-xl border border-[#0f1f1a]/20 bg-white px-4 py-3 shadow-sm placeholder-[#0f1f1a]/40 focus:border-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-colors" />
          </div>

          <button type="button" onClick={handleGenerate} className="w-full rounded-full bg-[#f97316] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:shadow-xl">
            Generate Card
          </button>
        </div>
      </div>

      {/* Output */}
      <div className="space-y-6">
        {generated ? (
          <>
            {/* Visual Card Preview */}
            <div ref={cardRef} className="rounded-3xl border-2 border-[#0f1f1a] bg-white p-8 shadow-lg">
              <div className="mb-1 text-2xl font-bold text-[#0f766e]">
                {icon} {values.businessName || '[Business Name]'}
              </div>
              <div className="mb-4 h-px bg-[#0f1f1a]/10" />
              <p className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Appointment for</p>
              <p className="text-lg font-semibold text-[#0f1f1a]">{values.customerName || '[Customer Name]'}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Service</p>
                  <p className="text-sm font-semibold text-[#0f1f1a]">{values.serviceName || '[Service]'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Time</p>
                  <p className="text-sm font-semibold text-[#0f1f1a]">{formatTime(values.time)}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Date</p>
                <p className="text-sm font-semibold text-[#0f1f1a]">{formatDate(values.date)}</p>
              </div>
              <div className="mt-4 border-t border-[#0f1f1a]/10 pt-3 text-xs text-[#0f1f1a]/60">
                📞 {values.phone || '[Phone]'} &nbsp;·&nbsp; 📍 {values.address || '[Address]'}
              </div>
              <p className="mt-2 text-[10px] text-[#0f1f1a]/40">
                Please call at least 24 hours in advance to reschedule or cancel.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button type="button" onClick={handleCopy} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#0f1f1a] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
                {copied ? (
                  <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Copied!</>
                ) : (
                  <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>Copy as Text</>
                )}
              </button>
              <button type="button" onClick={handlePrint} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#0f1f1a]/20 px-5 py-3 text-sm font-semibold text-[#0f1f1a] transition hover:border-[#0f1f1a]/40">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Print Card
              </button>
            </div>

            {/* CTA */}
            <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm">
              <p className="text-base font-semibold text-[#0f1f1a]">Automate your reminders with AI phone calls</p>
              <p className="mt-2 text-sm text-[#0f1f1a]/60">Cards can get lost. OneSpec calls every customer before their appointment automatically — confirmations, reschedules, and cancellations handled by AI.</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#0f1f1a]/50">Fill in the form and click &ldquo;Generate Card&rdquo; to preview your appointment reminder card</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
