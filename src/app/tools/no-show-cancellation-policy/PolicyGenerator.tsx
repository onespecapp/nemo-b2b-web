'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from '@/lib/hooks/useForm'
import {
  industries,
  generatePolicy,
  type IndustryKey,
  type NoticePeriod,
  type FeeOption,
  type PolicyStyle,
} from './policy-data'

const noticePeriods: { value: NoticePeriod; label: string }[] = [
  { value: '24h', label: '24 hours' },
  { value: '48h', label: '48 hours' },
  { value: '72h', label: '72 hours' },
]

const feeOptions: { value: FeeOption; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: '25', label: '$25' },
  { value: '50', label: '$50' },
  { value: 'full', label: 'Full charge' },
  { value: 'custom', label: 'Custom' },
]

const policyStyles: { value: PolicyStyle; label: string }[] = [
  { value: 'lenient', label: 'Lenient' },
  { value: 'standard', label: 'Standard' },
  { value: 'strict', label: 'Strict' },
]

export default function PolicyGenerator() {
  const { values, handleChange } = useForm({
    businessName: '',
    industry: '' as IndustryKey | '',
    cancellationFeeCustom: '',
    noShowFeeCustom: '',
  })

  const [noticePeriod, setNoticePeriod] = useState<NoticePeriod>('24h')
  const [cancellationFee, setCancellationFee] = useState<FeeOption>('none')
  const [noShowFee, setNoShowFee] = useState<FeeOption>('50')
  const [policyStyle, setPolicyStyle] = useState<PolicyStyle>('standard')
  const [includeLateArrival, setIncludeLateArrival] = useState(true)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    const result = generatePolicy({
      businessName: values.businessName,
      industry: (values.industry || 'other') as IndustryKey,
      noticePeriod,
      cancellationFee,
      cancellationFeeCustom: values.cancellationFeeCustom,
      noShowFee,
      noShowFeeCustom: values.noShowFeeCustom,
      policyStyle,
      includeLateArrival,
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

          {/* Notice Period */}
          <div>
            <label className="block text-sm font-medium text-[#0f1f1a] mb-2">Notice Period</label>
            <div className="flex gap-2">
              {noticePeriods.map((np) => (
                <button key={np.value} type="button" onClick={() => setNoticePeriod(np.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${noticePeriod === np.value ? 'bg-[#0f1f1a] text-white' : 'border border-[#0f1f1a]/20 text-[#0f1f1a]/70 hover:border-[#0f1f1a]/40'}`}>
                  {np.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cancellation Fee */}
          <div>
            <label className="block text-sm font-medium text-[#0f1f1a] mb-2">Late Cancellation Fee</label>
            <div className="flex flex-wrap gap-2">
              {feeOptions.filter(f => f.value !== 'full').map((fo) => (
                <button key={fo.value} type="button" onClick={() => setCancellationFee(fo.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${cancellationFee === fo.value ? 'bg-[#0f1f1a] text-white' : 'border border-[#0f1f1a]/20 text-[#0f1f1a]/70 hover:border-[#0f1f1a]/40'}`}>
                  {fo.label}
                </button>
              ))}
            </div>
            {cancellationFee === 'custom' && (
              <input name="cancellationFeeCustom" type="text" value={values.cancellationFeeCustom} onChange={handleChange} placeholder="Enter amount (e.g. 35)" className="mt-2 block w-full rounded-xl border border-[#0f1f1a]/20 bg-white px-4 py-3 shadow-sm placeholder-[#0f1f1a]/40 focus:border-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-colors" />
            )}
          </div>

          {/* No-Show Fee */}
          <div>
            <label className="block text-sm font-medium text-[#0f1f1a] mb-2">No-Show Fee</label>
            <div className="flex flex-wrap gap-2">
              {feeOptions.map((fo) => (
                <button key={fo.value} type="button" onClick={() => setNoShowFee(fo.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${noShowFee === fo.value ? 'bg-[#0f1f1a] text-white' : 'border border-[#0f1f1a]/20 text-[#0f1f1a]/70 hover:border-[#0f1f1a]/40'}`}>
                  {fo.label}
                </button>
              ))}
            </div>
            {noShowFee === 'custom' && (
              <input name="noShowFeeCustom" type="text" value={values.noShowFeeCustom} onChange={handleChange} placeholder="Enter amount (e.g. 75)" className="mt-2 block w-full rounded-xl border border-[#0f1f1a]/20 bg-white px-4 py-3 shadow-sm placeholder-[#0f1f1a]/40 focus:border-[#0f766e] focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-colors" />
            )}
          </div>

          {/* Policy Style */}
          <div>
            <label className="block text-sm font-medium text-[#0f1f1a] mb-2">Policy Style</label>
            <div className="flex gap-2">
              {policyStyles.map((ps) => (
                <button key={ps.value} type="button" onClick={() => setPolicyStyle(ps.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${policyStyle === ps.value ? 'bg-[#0f1f1a] text-white' : 'border border-[#0f1f1a]/20 text-[#0f1f1a]/70 hover:border-[#0f1f1a]/40'}`}>
                  {ps.label}
                </button>
              ))}
            </div>
          </div>

          {/* Late Arrival Toggle */}
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setIncludeLateArrival(!includeLateArrival)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${includeLateArrival ? 'bg-[#0f766e]' : 'bg-[#0f1f1a]/20'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${includeLateArrival ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <label className="text-sm font-medium text-[#0f1f1a]">Include Late Arrival Policy</label>
          </div>

          <button type="button" onClick={handleGenerate} className="w-full rounded-full bg-[#f97316] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:shadow-xl">
            Generate Policy
          </button>
        </div>
      </div>

      {/* Output */}
      <div className="space-y-6">
        {output ? (
          <>
            <div className="rounded-3xl bg-[#0f1f1a] p-6 text-white shadow-lg sm:p-8">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                  {policyStyle.charAt(0).toUpperCase() + policyStyle.slice(1)} Policy
                </span>
                <button type="button" onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/20">
                  {copied ? (
                    <><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Copied!</>
                  ) : (
                    <><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>Copy</>
                  )}
                </button>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/90">{output}</pre>
            </div>

            <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white p-6 shadow-sm">
              <p className="text-base font-semibold text-[#0f1f1a]">A policy handles no-shows after they happen. OneSpec prevents them.</p>
              <p className="mt-2 text-sm text-[#0f1f1a]/60">OneSpec calls every customer before their appointment with AI-powered reminders. Reduce no-shows before they happen instead of charging fees after.</p>
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#0f1f1a]/50">Configure your policy options and click &ldquo;Generate Policy&rdquo; to create your cancellation &amp; no-show policy</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
