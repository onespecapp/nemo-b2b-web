'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

interface CallLog {
  id: string
  call_type: string
  call_outcome: string | null
  duration_sec: number | null
  transcript: any[] | null
  summary: string | null
  room_name: string | null
  created_at: string
  customer: {
    name: string
    phone: string
  } | null
  appointment: {
    title: string
    scheduled_at: string
    status: string
  } | null
}

const outcomeColors: Record<string, string> = {
  CONFIRMED: 'bg-[#0f766e]/15 text-[#0f766e]',
  RESCHEDULED: 'bg-[#f97316]/20 text-[#b45309]',
  CANCELED: 'bg-[#ef4444]/15 text-[#991b1b]',
  ANSWERED: 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70',
  NO_ANSWER: 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70',
  VOICEMAIL: 'bg-[#6366f1]/15 text-[#4338ca]',
  BUSY: 'bg-[#fb7185]/15 text-[#be123c]',
  FAILED: 'bg-[#ef4444]/15 text-[#991b1b]',
}

const outcomeLabels: Record<string, string> = {
  CONFIRMED: 'Confirmed',
  RESCHEDULED: 'Rescheduled',
  CANCELED: 'Canceled',
  ANSWERED: 'Answered',
  NO_ANSWER: 'No Answer',
  VOICEMAIL: 'Voicemail',
  BUSY: 'Busy',
  FAILED: 'Failed',
}

export default function CallHistoryPage() {
  const [calls, setCalls] = useState<CallLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    async function fetchCalls() {
      setLoading(true)

      let query = supabase
        .from('b2b_call_logs')
        .select(`
          *,
          customer:b2b_customers(name, phone),
          appointment:b2b_appointments(title, scheduled_at, status)
        `)
        .order('created_at', { ascending: false })
        .limit(100)

      if (filter !== 'all') {
        query = query.eq('call_outcome', filter)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching calls:', error)
      } else {
        setCalls(data || [])
      }
      setLoading(false)
    }

    fetchCalls()
  }, [supabase, filter])

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '-'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Call history</p>
          <h1 className="font-display text-3xl sm:text-4xl">Every reminder, captured</h1>
          <p className="mt-1 text-sm text-[#0f1f1a]/60">Review call outcomes, transcripts, and summaries.</p>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-[#0f1f1a]/10 bg-white px-4 py-2 text-sm">
          <label htmlFor="filter" className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Filter</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent text-sm font-semibold text-[#0f1f1a] focus:outline-none"
          >
            <option value="all">All Calls</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="RESCHEDULED">Rescheduled</option>
            <option value="CANCELED">Canceled</option>
            <option value="ANSWERED">Answered</option>
            <option value="NO_ANSWER">No Answer</option>
            <option value="VOICEMAIL">Voicemail</option>
          </select>
        </div>
      </div>

      <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#0f1f1a]/20 border-t-[#f97316]" />
            <p className="mt-4 text-sm text-[#0f1f1a]/60">Loading calls...</p>
          </div>
        ) : calls.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-display text-2xl">No calls yet</p>
            <p className="mt-2 text-sm text-[#0f1f1a]/60">Call history will appear here once reminders run.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[#0f1f1a]/10">
            {calls.map((call) => (
              <li
                key={call.id}
                className="cursor-pointer px-6 py-4 transition hover:bg-[#f8f5ef]"
                onClick={() => setSelectedCall(call)}
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f1f1a] text-sm font-semibold text-white">
                    {call.customer?.name?.charAt(0) || '?'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0f1f1a]">
                      {call.customer?.name || 'Unknown Customer'}
                    </p>
                    <p className="text-xs text-[#0f1f1a]/60">
                      {call.appointment?.title || 'No appointment'} • {call.customer?.phone}
                    </p>
                  </div>

                  <div className="text-right text-xs text-[#0f1f1a]/60">
                    <div>{formatDate(call.created_at)}</div>
                    <div>Duration: {formatDuration(call.duration_sec)}</div>
                  </div>

                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    outcomeColors[call.call_outcome || ''] || 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70'
                  }`}>
                    {outcomeLabels[call.call_outcome || ''] || call.call_outcome || 'Pending'}
                  </span>

                  {call.transcript && call.transcript.length > 0 && (
                    <span className="rounded-full border border-[#0f1f1a]/10 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-[#0f1f1a]/50">
                      Transcript
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-[#0f1f1a]/10 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#0f1f1a]/10 px-6 py-4">
              <div>
                <h3 className="font-display text-2xl">Call details</h3>
                <p className="text-xs text-[#0f1f1a]/60">
                  {selectedCall.customer?.name} • {formatDate(selectedCall.created_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedCall(null)}
                className="rounded-full border border-[#0f1f1a]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60"
              >
                Close
              </button>
            </div>

            <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Outcome</p>
                  <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    outcomeColors[selectedCall.call_outcome || ''] || 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70'
                  }`}>
                    {outcomeLabels[selectedCall.call_outcome || ''] || selectedCall.call_outcome || 'Pending'}
                  </span>
                </div>
                <div className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Duration</p>
                  <p className="mt-2 text-sm font-semibold text-[#0f1f1a]">
                    {formatDuration(selectedCall.duration_sec)}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Customer</p>
                  <p className="mt-2 text-sm font-semibold text-[#0f1f1a]">
                    {selectedCall.customer?.name || 'Unknown'}
                  </p>
                  <p className="text-xs text-[#0f1f1a]/60">{selectedCall.customer?.phone}</p>
                </div>
                <div className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Appointment</p>
                  <p className="mt-2 text-sm font-semibold text-[#0f1f1a]">
                    {selectedCall.appointment?.title || 'N/A'}
                  </p>
                </div>
              </div>

              {selectedCall.summary && (
                <div className="mt-6 rounded-2xl border border-[#0f1f1a]/10 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Summary</p>
                  <p className="mt-2 text-sm text-[#0f1f1a]/70">{selectedCall.summary}</p>
                </div>
              )}

              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Transcript</p>
                {selectedCall.transcript && selectedCall.transcript.length > 0 ? (
                  <div className="mt-3 space-y-3">
                    {selectedCall.transcript.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === 'agent' ? 'justify-start' : msg.role === 'user' ? 'justify-end' : 'justify-center'}`}
                      >
                        {msg.role === 'system' ? (
                          <div className="rounded-full border border-[#0f1f1a]/10 px-3 py-1 text-[11px] text-[#0f1f1a]/50">
                            {msg.content}
                          </div>
                        ) : (
                          <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                            msg.role === 'agent'
                              ? 'bg-[#0f1f1a] text-white'
                              : 'bg-[#f8f5ef] text-[#0f1f1a]'
                          }`}>
                            <p className="text-[11px] uppercase tracking-[0.2em] opacity-70">
                              {msg.role === 'agent' ? 'OneSpec' : 'Customer'}
                            </p>
                            <p>{msg.content}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-dashed border-[#0f1f1a]/20 bg-[#f8f5ef] px-6 py-8 text-center text-sm text-[#0f1f1a]/60">
                    No transcript available for this call.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
