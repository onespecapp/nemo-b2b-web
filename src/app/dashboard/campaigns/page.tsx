'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useCallback } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6001'

interface Campaign {
  id: string
  business_id: string
  campaign_type: string
  name: string
  enabled: boolean
  settings: Record<string, any>
  call_window_start: string
  call_window_end: string
  allowed_days: string
  max_concurrent_calls: number
  min_minutes_between_calls: number
  cycle_frequency_days: number
  last_run_at: string | null
  next_run_at: string | null
  created_at: string
  updated_at: string
}

interface CampaignStats {
  total_calls: number
  completed: number
  booked: number
  declined: number
  conversion_rate: number
  status_breakdown: Record<string, number>
}

interface CampaignCall {
  id: string
  status: string
  skip_reason: string | null
  result_data: any
  scheduled_for: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  customer: { name: string; phone: string; email: string | null } | null
  call_logs: Array<{
    id: string
    call_outcome: string | null
    duration_sec: number | null
    summary: string | null
    created_at: string
  }>
}

const campaignTypeConfig: Record<string, { label: string; description: string; defaultName: string; color: string }> = {
  RE_ENGAGEMENT: {
    label: 'Re-engagement',
    description: 'Win back lapsed customers who haven\'t visited in a while',
    defaultName: 'Customer Re-engagement',
    color: 'bg-[#0f766e]/15 text-[#0f766e]',
  },
  REVIEW_COLLECTION: {
    label: 'Review Collection',
    description: 'Request Google reviews from customers after appointments',
    defaultName: 'Review Collection',
    color: 'bg-[#f97316]/20 text-[#b45309]',
  },
  NO_SHOW_FOLLOWUP: {
    label: 'No-Show Follow-Up',
    description: 'Follow up with customers who missed their appointments',
    defaultName: 'No-Show Follow-Up',
    color: 'bg-[#6366f1]/15 text-[#4338ca]',
  },
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-[#0f1f1a]/10 text-[#0f1f1a]/70',
  QUEUED: 'bg-[#f97316]/20 text-[#b45309]',
  IN_PROGRESS: 'bg-[#6366f1]/15 text-[#4338ca]',
  COMPLETED: 'bg-[#0f766e]/15 text-[#0f766e]',
  SKIPPED: 'bg-[#0f1f1a]/10 text-[#0f1f1a]/50',
  FAILED: 'bg-[#ef4444]/15 text-[#991b1b]',
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [stats, setStats] = useState<Record<string, CampaignStats>>({})
  const [loading, setLoading] = useState(true)
  const [businessId, setBusinessId] = useState<string | null>(null)

  // Modal state
  const [showConfig, setShowConfig] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [editingType, setEditingType] = useState<string>('')

  // Call history modal
  const [showCalls, setShowCalls] = useState(false)
  const [callsCampaignId, setCallsCampaignId] = useState<string>('')
  const [campaignCalls, setCampaignCalls] = useState<CampaignCall[]>([])
  const [loadingCalls, setLoadingCalls] = useState(false)

  // Config form state
  const [formName, setFormName] = useState('')
  const [formDaysSince, setFormDaysSince] = useState(30)
  const [formWindowStart, setFormWindowStart] = useState('09:00')
  const [formWindowEnd, setFormWindowEnd] = useState('17:00')
  const [formAllowedDays, setFormAllowedDays] = useState<string[]>(['MON', 'TUE', 'WED', 'THU', 'FRI'])
  const [formMaxConcurrent, setFormMaxConcurrent] = useState(2)
  const [formMinBetween, setFormMinBetween] = useState(5)
  const [formCycleFrequency, setFormCycleFrequency] = useState(30)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  const fetchCampaigns = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    try {
      const res = await fetch(`${API_URL}/api/campaigns`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setCampaigns(data.campaigns || [])

        // Fetch stats for each campaign
        for (const campaign of data.campaigns || []) {
          const statsRes = await fetch(`${API_URL}/api/campaigns/${campaign.id}/stats`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          })
          if (statsRes.ok) {
            const statsData = await statsRes.json()
            setStats(prev => ({ ...prev, [campaign.id]: statsData.stats }))
          }
        }
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    }
  }, [supabase.auth])

  useEffect(() => {
    async function init() {
      setLoading(true)
      // Get business ID
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: business } = await supabase
          .from('b2b_businesses')
          .select('id')
          .eq('owner_id', user.id)
          .single()
        if (business) setBusinessId(business.id)
      }
      await fetchCampaigns()
      setLoading(false)
    }
    init()
  }, [fetchCampaigns, supabase.auth, supabase])

  const handleToggle = async (campaign: Campaign) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    try {
      const res = await fetch(`${API_URL}/api/campaigns/${campaign.id}/toggle`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (res.ok) {
        await fetchCampaigns()
      }
    } catch (error) {
      console.error('Error toggling campaign:', error)
    }
  }

  const openConfig = (campaign: Campaign | null, type: string) => {
    setEditingCampaign(campaign)
    setEditingType(type)
    if (campaign) {
      setFormName(campaign.name)
      setFormDaysSince((campaign.settings as any)?.days_since_last_appointment || 30)
      setFormWindowStart(campaign.call_window_start)
      setFormWindowEnd(campaign.call_window_end)
      setFormAllowedDays(campaign.allowed_days.split(',').map(d => d.trim()))
      setFormMaxConcurrent(campaign.max_concurrent_calls)
      setFormMinBetween(campaign.min_minutes_between_calls)
      setFormCycleFrequency(campaign.cycle_frequency_days)
    } else {
      const config = campaignTypeConfig[type]
      setFormName(config?.defaultName || 'New Campaign')
      setFormDaysSince(30)
      setFormWindowStart('09:00')
      setFormWindowEnd('17:00')
      setFormAllowedDays(['MON', 'TUE', 'WED', 'THU', 'FRI'])
      setFormMaxConcurrent(2)
      setFormMinBetween(5)
      setFormCycleFrequency(30)
    }
    setShowConfig(true)
  }

  const handleSave = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    setSaving(true)
    try {
      const body: any = {
        name: formName,
        settings: { days_since_last_appointment: formDaysSince },
        call_window_start: formWindowStart,
        call_window_end: formWindowEnd,
        allowed_days: formAllowedDays.join(','),
        max_concurrent_calls: 2, // Fixed at 2
        min_minutes_between_calls: formMinBetween,
        cycle_frequency_days: formCycleFrequency,
      }

      if (editingCampaign) {
        // Update existing
        await fetch(`${API_URL}/api/campaigns/${editingCampaign.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(body),
        })
      } else {
        // Create new
        body.campaign_type = editingType
        await fetch(`${API_URL}/api/campaigns`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(body),
        })
      }

      setShowConfig(false)
      await fetchCampaigns()
    } catch (error) {
      console.error('Error saving campaign:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign? This will also delete all associated call records.')) return

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    try {
      await fetch(`${API_URL}/api/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      setShowConfig(false)
      await fetchCampaigns()
    } catch (error) {
      console.error('Error deleting campaign:', error)
    }
  }

  const openCallHistory = async (campaignId: string) => {
    setCallsCampaignId(campaignId)
    setShowCalls(true)
    setLoadingCalls(true)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    try {
      const res = await fetch(`${API_URL}/api/campaigns/${campaignId}/calls`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setCampaignCalls(data.calls || [])
      }
    } catch (error) {
      console.error('Error fetching campaign calls:', error)
    } finally {
      setLoadingCalls(false)
    }
  }

  // Find which types already have campaigns
  const existingTypes = new Set(campaigns.map(c => c.campaign_type))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#0f1f1a]/20 border-t-[#f97316]" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Campaigns</h1>
        <p className="mt-2 text-sm text-[#0f1f1a]/60">
          Automated outbound call campaigns to grow your business
        </p>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(campaignTypeConfig).map(([type, config]) => {
          const campaign = campaigns.find(c => c.campaign_type === type)
          const campaignStats = campaign ? stats[campaign.id] : null

          return (
            <div
              key={type}
              className={`rounded-3xl border bg-white/90 p-6 shadow-sm transition ${
                campaign?.enabled
                  ? 'border-[#0f766e]/30'
                  : 'border-[#0f1f1a]/10'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${config.color}`}>
                    {config.label}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold">
                    {campaign?.name || config.defaultName}
                  </h3>
                </div>
                {campaign && (
                  <button
                    onClick={() => handleToggle(campaign)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      campaign.enabled ? 'bg-[#0f766e]' : 'bg-[#0f1f1a]/20'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${
                        campaign.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Description */}
              <p className="mt-2 text-xs text-[#0f1f1a]/50">
                {config.description}
              </p>

              {/* Stats */}
              {campaign && campaignStats && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-[#f8f5ef] p-3 text-center">
                    <div className="font-display text-xl font-bold">{campaignStats.total_calls}</div>
                    <div className="text-xs text-[#0f1f1a]/50">Total</div>
                  </div>
                  <div className="rounded-2xl bg-[#f8f5ef] p-3 text-center">
                    <div className="font-display text-xl font-bold">{campaignStats.completed}</div>
                    <div className="text-xs text-[#0f1f1a]/50">Completed</div>
                  </div>
                  <div className="rounded-2xl bg-[#f8f5ef] p-3 text-center">
                    <div className="font-display text-xl font-bold text-[#0f766e]">{campaignStats.conversion_rate}%</div>
                    <div className="text-xs text-[#0f1f1a]/50">Booked</div>
                  </div>
                </div>
              )}

              {/* Settings summary */}
              {campaign && (
                <div className="mt-4 space-y-1 text-xs text-[#0f1f1a]/50">
                  <div>Window: {campaign.call_window_start} - {campaign.call_window_end}</div>
                  <div>Days: {campaign.allowed_days.replace(/,/g, ', ')}</div>
                  <div>Cycle: Every {campaign.cycle_frequency_days} days</div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-5 flex gap-2">
                {campaign ? (
                  <>
                    <button
                      onClick={() => openConfig(campaign, type)}
                      className="flex-1 rounded-full border border-[#0f1f1a]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#0f1f1a]/70 transition hover:border-[#0f1f1a]/30"
                    >
                      Configure
                    </button>
                    <button
                      onClick={() => openCallHistory(campaign.id)}
                      className="flex-1 rounded-full border border-[#0f1f1a]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#0f1f1a]/70 transition hover:border-[#0f1f1a]/30"
                    >
                      History
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => openConfig(null, type)}
                    className="w-full rounded-full bg-[#f97316] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-orange-200 transition hover:bg-[#ea580c]"
                  >
                    Set Up Campaign
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Configuration Modal */}
      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold">
                {editingCampaign ? 'Configure Campaign' : 'Create Campaign'}
              </h2>
              <button
                onClick={() => setShowConfig(false)}
                className="rounded-full p-2 text-[#0f1f1a]/40 hover:bg-[#0f1f1a]/5"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              {/* Campaign Name */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0f1f1a]/60">Campaign Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                />
              </div>

              {/* Days Since Last Appointment */}
              {(editingType === 'RE_ENGAGEMENT' || editingCampaign?.campaign_type === 'RE_ENGAGEMENT') && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0f1f1a]/60">
                    Days Since Last Appointment
                  </label>
                  <p className="mt-1 text-xs text-[#0f1f1a]/40">
                    Customers who haven&apos;t had an appointment in this many days will be contacted
                  </p>
                  <input
                    type="number"
                    value={formDaysSince}
                    onChange={(e) => setFormDaysSince(parseInt(e.target.value) || 30)}
                    min={7}
                    max={365}
                    className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                  />
                </div>
              )}

              {/* Call Window */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0f1f1a]/60">Window Start</label>
                  <input
                    type="time"
                    value={formWindowStart}
                    onChange={(e) => setFormWindowStart(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0f1f1a]/60">Window End</label>
                  <input
                    type="time"
                    value={formWindowEnd}
                    onChange={(e) => setFormWindowEnd(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                  />
                </div>
              </div>

              {/* Allowed Days */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0f1f1a]/60">Allowed Days</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      onClick={() => {
                        setFormAllowedDays(prev =>
                          prev.includes(day)
                            ? prev.filter(d => d !== day)
                            : [...prev, day]
                        )
                      }}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        formAllowedDays.includes(day)
                          ? 'bg-[#0f1f1a] text-white'
                          : 'bg-[#0f1f1a]/5 text-[#0f1f1a]/50'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Throttling */}
              <div className="grid grid-cols-2 gap-4">
                <div className="opacity-50">
                  <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0f1f1a]/60">Max Concurrent</label>
                  <input
                    type="number"
                    value={2}
                    disabled
                    className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef] px-4 py-3 text-sm text-[#0f1f1a]/50 cursor-not-allowed"
                  />
                  <p className="mt-1 text-[10px] text-[#0f1f1a]/40">Fixed at 2</p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0f1f1a]/60">Min. Between (min)</label>
                  <input
                    type="number"
                    value={formMinBetween}
                    onChange={(e) => setFormMinBetween(parseInt(e.target.value) || 5)}
                    min={1}
                    max={60}
                    className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                  />
                </div>
              </div>

              {/* Cycle Frequency */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#0f1f1a]/60">Cycle Frequency (days)</label>
                <p className="mt-1 text-xs text-[#0f1f1a]/40">
                  How often a customer can be re-targeted by this campaign
                </p>
                <input
                  type="number"
                  value={formCycleFrequency}
                  onChange={(e) => setFormCycleFrequency(parseInt(e.target.value) || 30)}
                  min={7}
                  max={365}
                  className="mt-2 w-full rounded-2xl border border-[#0f1f1a]/20 bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !formName.trim()}
                className="flex-1 rounded-full bg-[#f97316] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-[#ea580c] disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingCampaign ? 'Save Changes' : 'Create Campaign'}
              </button>
              {editingCampaign && (
                <button
                  onClick={() => handleDelete(editingCampaign.id)}
                  className="rounded-full border border-[#ef4444]/30 px-4 py-3 text-sm font-semibold text-[#ef4444] transition hover:bg-[#ef4444]/5"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Call History Modal */}
      {showCalls && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold">Campaign Call History</h2>
              <button
                onClick={() => setShowCalls(false)}
                className="rounded-full p-2 text-[#0f1f1a]/40 hover:bg-[#0f1f1a]/5"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loadingCalls ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0f1f1a]/20 border-t-[#f97316]" />
              </div>
            ) : campaignCalls.length === 0 ? (
              <div className="py-12 text-center text-sm text-[#0f1f1a]/40">
                No calls yet. Campaign calls will appear here once the scheduler runs.
              </div>
            ) : (
              <div className="space-y-3">
                {campaignCalls.map(call => (
                  <div
                    key={call.id}
                    className="rounded-2xl border border-[#0f1f1a]/10 bg-[#f8f5ef]/50 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-sm">
                          {call.customer?.name || 'Unknown Customer'}
                        </div>
                        <div className="text-xs text-[#0f1f1a]/50">
                          {call.customer?.phone}
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[call.status] || statusColors.PENDING}`}>
                        {call.status}
                      </span>
                    </div>

                    {call.scheduled_for && (
                      <div className="mt-2 text-xs text-[#0f1f1a]/40">
                        Scheduled: {new Date(call.scheduled_for).toLocaleString()}
                      </div>
                    )}

                    {call.skip_reason && (
                      <div className="mt-1 text-xs text-[#ef4444]/70">
                        Skipped: {call.skip_reason}
                      </div>
                    )}

                    {call.call_logs && call.call_logs.length > 0 && (
                      <div className="mt-2 rounded-xl bg-white p-3 text-xs">
                        <div className="font-semibold text-[#0f1f1a]/70">
                          Outcome: {call.call_logs[0].call_outcome || 'N/A'}
                          {call.call_logs[0].duration_sec && (
                            <span className="ml-2 font-normal text-[#0f1f1a]/40">
                              ({Math.floor(call.call_logs[0].duration_sec / 60)}m {call.call_logs[0].duration_sec % 60}s)
                            </span>
                          )}
                        </div>
                        {call.call_logs[0].summary && (
                          <div className="mt-1 text-[#0f1f1a]/50">{call.call_logs[0].summary}</div>
                        )}
                      </div>
                    )}

                    {call.result_data && (call.result_data as any)?.booked_appointment && (
                      <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#0f766e]">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Appointment Booked
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
