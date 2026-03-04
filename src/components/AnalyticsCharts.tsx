'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface DailyVolume {
  date: string
  label: string
  count: number
}

interface OutcomeBreakdown {
  name: string
  value: number
}

const OUTCOME_COLORS: Record<string, string> = {
  BOOKED: '#0f766e',
  MESSAGE_TAKEN: '#f97316',
  TRANSFERRED: '#6366f1',
  ANSWERED: '#64748b',
  CONFIRMED: '#059669',
  RESCHEDULED: '#d97706',
  CANCELED: '#ef4444',
  NO_ANSWER: '#94a3b8',
  VOICEMAIL: '#8b5cf6',
  DECLINED: '#f43f5e',
  FAILED: '#dc2626',
}

const FALLBACK_COLORS = ['#0f766e', '#f97316', '#6366f1', '#64748b', '#059669', '#d97706']

export function CallVolumeChart({ data }: { data: DailyVolume[] }) {
  if (!data || data.length === 0) return null

  return (
    <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.25em] text-[#0f1f1a]/50">Call volume</p>
      <h3 className="mt-1 font-display text-xl">Last 7 days</h3>
      <div className="mt-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#0f1f1a80' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#0f1f1a80' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#0f1f1a',
                border: 'none',
                borderRadius: 12,
                color: '#fff',
                fontSize: 12,
              }}
              labelStyle={{ color: '#ffffff99' }}
              cursor={{ fill: '#0f1f1a08' }}
            />
            <Bar dataKey="count" fill="#0f766e" radius={[6, 6, 0, 0]} name="Calls" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function OutcomeBreakdownChart({ data }: { data: OutcomeBreakdown[] }) {
  if (!data || data.length === 0) return null

  const total = data.reduce((sum, d) => sum + d.value, 0)
  if (total === 0) return null

  return (
    <div className="rounded-3xl border border-[#0f1f1a]/10 bg-white/90 p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.25em] text-[#0f1f1a]/50">Outcomes</p>
      <h3 className="mt-1 font-display text-xl">Call breakdown</h3>
      <div className="mt-4 flex items-center gap-6">
        <div className="h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={64}
                strokeWidth={2}
                stroke="#fff"
              >
                {data.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={OUTCOME_COLORS[entry.name] || FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#0f1f1a',
                  border: 'none',
                  borderRadius: 12,
                  color: '#fff',
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
          {data.map((entry, i) => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor:
                    OUTCOME_COLORS[entry.name] || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
                }}
              />
              <span className="text-[#0f1f1a]/70">
                {entry.name.replace('_', ' ')} ({entry.value})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
