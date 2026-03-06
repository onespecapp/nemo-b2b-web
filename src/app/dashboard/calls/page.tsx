'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useCallback, useRef } from 'react'
import AccessibleModal from '@/components/AccessibleModal'
import { SkeletonCallList } from '@/components/Skeleton'
import CallOutcomeBadge from '@/components/CallOutcomeBadge'
import { callOutcomeLabels, callTypeLabels, callTypeStyles } from '@/lib/constants'
import { formatDuration, parseUTCDate, formatRelativeTime } from '@/lib/utils'
import { useUser } from '@/lib/context/UserContext'
import { useRealtimeSubscription } from '@/lib/hooks/useRealtimeSubscription'
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue'

interface CallLog {
  id: string
  call_type: string
  call_outcome: string | null
  duration_sec: number | null
  transcript: TranscriptMessage[] | null
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

interface TranscriptMessage {
  role: string
  content: string
}

const PAGE_SIZE = 50

export default function CallHistoryPage() {
  const { business, loading: userLoading } = useUser()
  const [calls, setCalls] = useState<CallLog[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc')
  const [callingBack, setCallingBack] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)
  const debouncedSearch = useDebouncedValue(searchTerm.trim(), 300)
  const [viewedIds, setViewedIds] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const stored = localStorage.getItem('viewed_call_ids')
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch { return new Set() }
  })
  const supabase = createClient()
  const currentOffsetRef = useRef(0)

  const fetchCalls = useCallback(async (append: boolean = false) => {
    if (!business) {
      setCalls([])
      setTotalCount(0)
      setLoading(false)
      return
    }

    if (!append) {
      setLoading(true)
      setTotalCount(null)
      currentOffsetRef.current = 0
    }

    const offset = append ? currentOffsetRef.current : 0

    // If searching, first find matching customer IDs
    let matchedCustomerIds: string[] | null = null
    if (debouncedSearch) {
      const { data: customers } = await supabase
        .from('b2b_customers')
        .select('id')
        .eq('business_id', business.id)
        .or(`name.ilike.%${debouncedSearch}%,phone.ilike.%${debouncedSearch}%`)
      matchedCustomerIds = customers?.map((c) => c.id) ?? []
    }

    // Build search filter string for .or()
    let searchFilter = ''
    if (debouncedSearch) {
      const idList = matchedCustomerIds!.length > 0
        ? `(${matchedCustomerIds!.join(',')})`
        : '()'
      searchFilter = `summary.ilike.%${debouncedSearch}%,customer_id.in.${idList}`
    }

    // Build count query (only on initial load / filter change)
    let countQuery = supabase
      .from('b2b_call_logs')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', business.id)

    if (filter !== 'all') {
      countQuery = filter === 'INBOUND'
        ? countQuery.eq('call_type', 'INBOUND')
        : countQuery.eq('call_outcome', filter)
    }
    if (searchFilter) {
      countQuery = countQuery.or(searchFilter)
    }

    // Build data query
    let dataQuery = supabase
      .from('b2b_call_logs')
      .select(`
        *,
        customer:b2b_customers(name, phone),
        appointment:b2b_appointments(title, scheduled_at, status)
      `)
      .eq('business_id', business.id)
      .order('created_at', { ascending: sortDirection === 'asc' })
      .range(offset, offset + PAGE_SIZE - 1)

    if (filter !== 'all') {
      dataQuery = filter === 'INBOUND'
        ? dataQuery.eq('call_type', 'INBOUND')
        : dataQuery.eq('call_outcome', filter)
    }
    if (searchFilter) {
      dataQuery = dataQuery.or(searchFilter)
    }

    const [countResult, dataResult] = await Promise.all([
      append ? Promise.resolve(null) : countQuery,
      dataQuery,
    ])

    if (dataResult.error) {
      console.error('Error fetching calls:', dataResult.error)
    } else {
      const newData = dataResult.data || []
      if (append) {
        setCalls((prev) => [...prev, ...newData])
      } else {
        setCalls(newData)
      }
      currentOffsetRef.current = offset + newData.length
    }

    if (countResult && !countResult.error && countResult.count !== null && countResult.count !== undefined) {
      setTotalCount(countResult.count)
    }

    if (!append) {
      setLoading(false)
    }
  }, [supabase, filter, sortDirection, business, debouncedSearch])

  // Reset and refetch when filter or sort changes
  useEffect(() => {
    if (userLoading) return

    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) {
        void fetchCalls(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [fetchCalls, userLoading])

  useRealtimeSubscription({
    table: 'b2b_call_logs',
    businessId: business?.id,
    events: ['INSERT', 'UPDATE'],
    onChange: () => fetchCalls(false),
  })

  async function handleFollowUp(call: CallLog) {
    if (!business || !call.customer?.phone || callingBack) return
    setCallingBack(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:6001'}/api/outbound-call`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            phone: call.customer.phone,
            business_id: business.id,
            call_purpose: 'follow_up',
            customer_name: call.customer.name || '',
            context: call.summary || '',
          }),
        }
      )
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to initiate call')
      }
    } catch (err) {
      console.error('Follow-up call failed:', err)
    } finally {
      setCallingBack(false)
    }
  }

  function markViewed(id: string) {
    setViewedIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      // Keep only latest 500 IDs to avoid unbounded localStorage growth
      const arr = [...next].slice(-500)
      try { localStorage.setItem('viewed_call_ids', JSON.stringify(arr)) } catch {}
      return new Set(arr)
    })
  }

  const formatDate = (dateString: string) => {
    const date = parseUTCDate(dateString)
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
          <h1 className="font-display text-3xl sm:text-4xl">Call History</h1>
          <p className="mt-1 text-sm text-[#0f1f1a]/60">Review lead calls, outcomes, transcripts, and summaries.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-full border border-[#0f1f1a]/10 bg-white px-4 py-2 text-sm">
            <label htmlFor="sort" className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Sort</label>
            <select
              id="sort"
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value as 'desc' | 'asc')}
              className="bg-transparent text-sm font-semibold text-[#0f1f1a] focus:outline-none"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
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
              <optgroup label="Call Type">
                <option value="INBOUND">Inbound</option>
              </optgroup>
              <optgroup label="Outcomes">
                <option value="BOOKED">Booked</option>
                <option value="MESSAGE_TAKEN">Message Taken</option>
                <option value="TRANSFERRED">Transferred</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="RESCHEDULED">Rescheduled</option>
                <option value="CANCELED">Canceled</option>
                <option value="ANSWERED">Answered</option>
                <option value="NO_ANSWER">No Answer</option>
                <option value="VOICEMAIL">Voicemail</option>
                <option value="DECLINED">Declined</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-2 rounded-full border border-[#0f1f1a]/10 bg-white px-4 py-2 focus-within:border-[#f97316] focus-within:ring-1 focus-within:ring-[#f97316]">
        <svg className="h-4 w-4 shrink-0 text-[#0f1f1a]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by summary, customer name, or phone..."
          className="min-w-0 flex-1 bg-transparent text-sm text-[#0f1f1a] placeholder:text-[#0f1f1a]/40 focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="shrink-0 rounded-full p-0.5 text-[#0f1f1a]/40 hover:text-[#0f1f1a]/70"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Showing count */}
      {!loading && totalCount !== null && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#0f1f1a]/60">
          <span>
            Showing <span className="font-semibold text-[#0f1f1a]">{calls.length}</span> of{' '}
            <span className="font-semibold text-[#0f1f1a]">{totalCount}</span> calls
          </span>
          {filter !== 'all' && (
            <span className="rounded-full bg-[#f97316]/10 px-2 py-0.5 text-xs font-semibold text-[#b45309]">
              {callOutcomeLabels[filter] || filter}
            </span>
          )}
          {debouncedSearch && (
            <span className="rounded-full bg-[#0f1f1a]/10 px-2 py-0.5 text-xs font-semibold text-[#0f1f1a]/70">
              Search: &ldquo;{debouncedSearch}&rdquo;
            </span>
          )}
        </div>
      )}

      <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 shadow-sm">
        {loading ? (
          <SkeletonCallList count={5} />
        ) : calls.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0f1f1a]/5">
              <svg className="h-6 w-6 text-[#0f1f1a]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            {debouncedSearch ? (
              <>
                <p className="font-display text-lg font-semibold text-[#0f1f1a]/70">No matching calls</p>
                <p className="mt-1 text-sm text-[#0f1f1a]/40">
                  No calls match &ldquo;{debouncedSearch}&rdquo;
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-3 rounded-full border border-[#0f1f1a]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/60 hover:bg-[#f8f5ef]"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <p className="font-display text-lg font-semibold text-[#0f1f1a]/70">No calls yet</p>
                <p className="mt-1 text-sm text-[#0f1f1a]/40">
                  Calls will appear here when your AI assistant answers your dealership line
                </p>
              </>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-[#0f1f1a]/10">
            {calls.map((call) => (
              <li
                key={call.id}
                className={`cursor-pointer px-6 py-4 transition hover:bg-[#f8f5ef] ${!viewedIds.has(call.id) ? 'bg-[#f97316]/[0.03]' : ''}`}
                onClick={() => { markViewed(call.id); setSelectedCall(call) }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0f1f1a] text-sm font-semibold text-white">
                    {call.customer?.name?.charAt(0) || '?'}
                    {!viewedIds.has(call.id) && (
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#f97316]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-[#0f1f1a]" title={call.customer?.name || 'Unknown Customer'}>
                        {call.customer?.name || 'Unknown Customer'}
                      </p>
                      {callTypeLabels[call.call_type] && callTypeStyles[call.call_type] && (
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${callTypeStyles[call.call_type]}`}>
                          {callTypeLabels[call.call_type]}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-[#0f1f1a]/60">
                      {call.appointment?.title || 'No appointment'} • {call.customer?.phone}
                    </p>
                    {call.summary && (
                      <p className="mt-0.5 truncate text-xs text-[#0f1f1a]/40" title={call.summary}>
                        {call.summary}
                      </p>
                    )}
                  </div>

                  <div className="hidden shrink-0 text-right text-xs text-[#0f1f1a]/60 sm:block">
                    <div>{formatDate(call.created_at)}</div>
                    <div>Duration: {formatDuration(call.duration_sec)}</div>
                  </div>
                  <div className="shrink-0 text-right text-xs text-[#0f1f1a]/40 sm:hidden">
                    <div>{formatRelativeTime(call.created_at)}</div>
                    <div>{formatDuration(call.duration_sec)}</div>
                  </div>

                  <CallOutcomeBadge outcome={call.call_outcome} />

                  {call.transcript && call.transcript.length > 0 && (
                    <span className="hidden rounded-full border border-[#0f1f1a]/10 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-[#0f1f1a]/50 sm:inline-flex">
                      Transcript
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalCount !== null && calls.length < totalCount && (
        <div className="flex justify-center">
          <button
            onClick={async () => {
              setLoadingMore(true)
              await fetchCalls(true)
              setLoadingMore(false)
            }}
            disabled={loadingMore}
            className="rounded-full border border-[#0f1f1a]/15 bg-white px-6 py-2.5 text-sm font-semibold text-[#0f1f1a]/70 shadow-sm transition hover:border-[#0f1f1a]/30 disabled:opacity-60"
          >
            {loadingMore ? 'Loading...' : `Load more (${totalCount - calls.length} remaining)`}
          </button>
        </div>
      )}

      <AccessibleModal
        isOpen={!!selectedCall}
        onClose={() => setSelectedCall(null)}
        ariaLabel={`Call details: ${selectedCall?.customer?.name || 'Unknown'}`}
        panelClassName="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border border-[#0f1f1a]/10 bg-white shadow-xl"
      >
        {selectedCall && (
          <>
            <div className="flex items-center justify-between border-b border-[#0f1f1a]/10 px-6 py-4">
              <div>
                <h3 className="font-display text-2xl">Call details</h3>
                <p className="text-xs text-[#0f1f1a]/60">
                  {selectedCall.customer?.name} • {formatDate(selectedCall.created_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedCall(null)}
                aria-label="Close"
                className="rounded-full border border-[#0f1f1a]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60"
              >
                Close
              </button>
            </div>

            <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Outcome</p>
                  <div className="mt-2">
                    <CallOutcomeBadge outcome={selectedCall.call_outcome} />
                  </div>
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

              {selectedCall.customer?.phone && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleFollowUp(selectedCall)}
                    disabled={callingBack}
                    className="rounded-full bg-[#0f766e] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#0f766e]/90 disabled:opacity-50"
                  >
                    {callingBack ? 'Calling...' : 'Follow Up'}
                  </button>
                </div>
              )}

              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Transcript</p>
                {selectedCall.transcript && selectedCall.transcript.length > 0 ? (
                  <div className="mt-3 space-y-3">
                    {selectedCall.transcript.map((msg, i) => {
                      const isAgent = msg.role === 'assistant' || msg.role === 'agent'
                      const isUser = msg.role === 'user'
                      return (
                        <div
                          key={i}
                          className={`flex ${isAgent ? 'justify-start' : isUser ? 'justify-end' : 'justify-center'}`}
                        >
                          {!isAgent && !isUser ? (
                            <div className="rounded-full border border-[#0f1f1a]/10 px-3 py-1 text-[11px] text-[#0f1f1a]/50">
                              {msg.content}
                            </div>
                          ) : (
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                              isAgent
                                ? 'bg-[#0f1f1a] text-white'
                                : 'bg-[#f8f5ef] text-[#0f1f1a]'
                            }`}>
                              <p className="text-[11px] uppercase tracking-[0.2em] opacity-70">
                                {isAgent ? 'AI Assistant' : 'Caller'}
                              </p>
                              <p>{msg.content}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-dashed border-[#0f1f1a]/20 bg-[#f8f5ef] px-6 py-8 text-center text-sm text-[#0f1f1a]/60">
                    No transcript available for this call.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </AccessibleModal>
    </div>
  )
}
