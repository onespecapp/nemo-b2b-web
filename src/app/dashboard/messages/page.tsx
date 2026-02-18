'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/lib/context/UserContext'
import AccessibleModal from '@/components/AccessibleModal'
import { messageUrgencyStyles, messageUrgencyLabels } from '@/lib/constants'

interface Message {
  id: string
  caller_name: string | null
  caller_phone: string | null
  message: string | null
  reason: string | null
  urgency: string
  read: boolean
  created_at: string
}

export default function MessagesPage() {
  const { business, loading: userLoading } = useUser()
  const supabase = createClient()

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (userLoading) return
    if (!business) {
      setMessages([])
      setLoading(false)
      return
    }
    fetchMessages()
  }, [business, userLoading, filter])

  async function fetchMessages() {
    setLoading(true)
    try {
      let query = supabase
        .from('b2b_messages')
        .select('*')
        .eq('business_id', business!.id)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('urgency', filter)
      }

      const { data, error } = await query

      if (error) {
        // Table may not exist yet
        console.error('Failed to load messages:', error)
        setMessages([])
      } else {
        setMessages(data || [])
      }
    } catch (err) {
      console.error('Failed to load messages:', err)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  async function toggleRead(msg: Message) {
    const newRead = !msg.read
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, read: newRead } : m)))
    if (selectedMessage?.id === msg.id) {
      setSelectedMessage({ ...msg, read: newRead })
    }

    try {
      await supabase.from('b2b_messages').update({ read: newRead }).eq('id', msg.id)
    } catch (err) {
      console.error('Failed to update read status:', err)
    }
  }

  function formatDate(dateString: string) {
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
          <p className="text-xs uppercase tracking-[0.3em] text-[#0f1f1a]/50">Messages</p>
          <h1 className="font-display text-3xl sm:text-4xl">Message Inbox</h1>
          <p className="mt-1 text-sm text-[#0f1f1a]/60">Messages taken by your AI receptionist.</p>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-[#0f1f1a]/10 bg-white px-4 py-2 text-sm">
          <label htmlFor="urgency-filter" className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Filter</label>
          <select
            id="urgency-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent text-sm font-semibold text-[#0f1f1a] focus:outline-none"
          >
            <option value="all">All Messages</option>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#0f1f1a]/20 border-t-[#f97316]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0f1f1a]/5">
              <svg className="h-6 w-6 text-[#0f1f1a]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <p className="font-display text-lg font-semibold text-[#0f1f1a]/70">No messages yet</p>
            <p className="mt-1 text-sm text-[#0f1f1a]/40">
              Messages from your AI receptionist will appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#0f1f1a]/10">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className={`cursor-pointer px-6 py-4 transition hover:bg-[#f8f5ef] ${!msg.read ? 'bg-[#f97316]/5' : ''}`}
                onClick={() => setSelectedMessage(msg)}
              >
                <div className="flex items-center gap-4">
                  {!msg.read && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#f97316]" />}
                  {msg.read && <span className="h-2.5 w-2.5 shrink-0" />}

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0f1f1a] text-sm font-semibold text-white">
                    {msg.caller_name?.charAt(0) || '?'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`truncate text-sm ${!msg.read ? 'font-bold' : 'font-semibold'} text-[#0f1f1a]`}>
                        {msg.caller_name || 'Unknown Caller'}
                      </p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${messageUrgencyStyles[msg.urgency] || messageUrgencyStyles.normal}`}>
                        {messageUrgencyLabels[msg.urgency] || 'Normal'}
                      </span>
                    </div>
                    <p className="truncate text-xs text-[#0f1f1a]/60">
                      {msg.message || 'No message'} • {msg.caller_phone}
                    </p>
                  </div>

                  <div className="hidden shrink-0 text-right text-xs text-[#0f1f1a]/60 sm:block">
                    {formatDate(msg.created_at)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AccessibleModal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        ariaLabel={`Message from ${selectedMessage?.caller_name || 'Unknown'}`}
        panelClassName="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-[#0f1f1a]/10 bg-white shadow-xl"
      >
        {selectedMessage && (
          <>
            <div className="flex items-center justify-between border-b border-[#0f1f1a]/10 px-6 py-4">
              <div>
                <h3 className="font-display text-2xl">Message Details</h3>
                <p className="text-xs text-[#0f1f1a]/60">
                  {selectedMessage.caller_name || 'Unknown Caller'} • {formatDate(selectedMessage.created_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                aria-label="Close"
                className="rounded-full border border-[#0f1f1a]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/60"
              >
                Close
              </button>
            </div>

            <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Caller</p>
                  <p className="mt-2 text-sm font-semibold text-[#0f1f1a]">{selectedMessage.caller_name || 'Unknown'}</p>
                  <p className="text-xs text-[#0f1f1a]/60">{selectedMessage.caller_phone}</p>
                </div>
                <div className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Urgency</p>
                  <div className="mt-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${messageUrgencyStyles[selectedMessage.urgency] || messageUrgencyStyles.normal}`}>
                      {messageUrgencyLabels[selectedMessage.urgency] || 'Normal'}
                    </span>
                  </div>
                </div>
              </div>

              {selectedMessage.reason && (
                <div className="rounded-2xl border border-[#0f1f1a]/10 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Reason</p>
                  <p className="mt-2 text-sm text-[#0f1f1a]/70">{selectedMessage.reason}</p>
                </div>
              )}

              <div className="rounded-2xl border border-[#0f1f1a]/10 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#0f1f1a]/50">Message</p>
                <p className="mt-2 text-sm text-[#0f1f1a]/70">{selectedMessage.message || 'No message content.'}</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => toggleRead(selectedMessage)}
                  className="rounded-full border border-[#0f1f1a]/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1f1a]/70 transition hover:border-[#0f1f1a]/30"
                >
                  Mark as {selectedMessage.read ? 'unread' : 'read'}
                </button>
              </div>
            </div>
          </>
        )}
      </AccessibleModal>
    </div>
  )
}
