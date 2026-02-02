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
  CONFIRMED: 'bg-green-50 text-green-700 border-green-200',
  RESCHEDULED: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  CANCELED: 'bg-red-50 text-red-700 border-red-200',
  ANSWERED: 'bg-blue-50 text-blue-700 border-blue-200',
  NO_ANSWER: 'bg-gray-50 text-gray-700 border-gray-200',
  VOICEMAIL: 'bg-purple-50 text-purple-700 border-purple-200',
  BUSY: 'bg-orange-50 text-orange-700 border-orange-200',
  FAILED: 'bg-red-50 text-red-700 border-red-200',
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Call History</h1>
          <p className="mt-1 text-gray-500">View all reminder calls and their outcomes</p>
        </div>
        
        {/* Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="filter" className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Calls List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading calls...</p>
          </div>
        ) : calls.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h4 className="text-gray-900 font-medium mb-1">No calls yet</h4>
            <p className="text-gray-500 text-sm">Call history will appear here after reminder calls are made</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {calls.map((call) => (
              <li 
                key={call.id} 
                className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedCall(call)}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-medium">
                    {call.customer?.name?.charAt(0) || '?'}
                  </div>
                  
                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {call.customer?.name || 'Unknown Customer'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {call.appointment?.title || 'No appointment'} • {call.customer?.phone}
                    </p>
                  </div>
                  
                  {/* Date & Duration */}
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(call.created_at)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Duration: {formatDuration(call.duration_sec)}
                    </p>
                  </div>
                  
                  {/* Outcome badge */}
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      outcomeColors[call.call_outcome || ''] || 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {outcomeLabels[call.call_outcome || ''] || call.call_outcome || 'Pending'}
                    </span>
                  </div>
                  
                  {/* Transcript indicator */}
                  {call.transcript && call.transcript.length > 0 && (
                    <div className="flex-shrink-0">
                      <span className="text-blue-600" title="Has transcript">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Transcript Modal */}
      {selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Call Details</h3>
                <p className="text-sm text-gray-500">
                  {selectedCall.customer?.name} • {formatDate(selectedCall.created_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedCall(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Call Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Outcome</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border mt-1 ${
                    outcomeColors[selectedCall.call_outcome || ''] || 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}>
                    {outcomeLabels[selectedCall.call_outcome || ''] || selectedCall.call_outcome || 'Pending'}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {formatDuration(selectedCall.duration_sec)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Customer</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedCall.customer?.name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500">{selectedCall.customer?.phone}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Appointment</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedCall.appointment?.title || 'N/A'}
                  </p>
                </div>
              </div>
              
              {/* Summary */}
              {selectedCall.summary && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Summary</h4>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <p className="text-sm text-blue-800">{selectedCall.summary}</p>
                  </div>
                </div>
              )}
              
              {/* Transcript */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Transcript</h4>
                {selectedCall.transcript && selectedCall.transcript.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCall.transcript.map((msg, i) => (
                      <div 
                        key={i} 
                        className={`flex ${msg.role === 'agent' ? 'justify-start' : msg.role === 'user' ? 'justify-end' : 'justify-center'}`}
                      >
                        {msg.role === 'system' ? (
                          <div className="bg-gray-100 rounded-lg px-3 py-2 text-xs text-gray-500 italic">
                            {msg.content}
                          </div>
                        ) : (
                          <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.role === 'agent' 
                              ? 'bg-blue-100 text-blue-900' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-xs font-medium mb-1 opacity-70">
                              {msg.role === 'agent' ? 'Nemo' : 'Customer'}
                            </p>
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm">No transcript available for this call</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedCall(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
