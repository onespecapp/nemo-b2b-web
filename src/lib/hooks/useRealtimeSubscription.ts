import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

type PostgresEvent = 'INSERT' | 'UPDATE' | 'DELETE'

interface UseRealtimeSubscriptionOptions {
  table: string
  businessId: string | undefined
  events?: PostgresEvent[]
  onChange: () => void
}

export function useRealtimeSubscription({
  table,
  businessId,
  events = ['INSERT', 'UPDATE'],
  onChange,
}: UseRealtimeSubscriptionOptions) {
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    if (!businessId) return

    const supabase = createClient()
    const channelName = `realtime-${table}-${businessId}-${Date.now()}`

    const channel = supabase.channel(channelName)

    for (const event of events) {
      channel.on(
        'postgres_changes' as any,
        {
          event,
          schema: 'public',
          table,
          filter: `business_id=eq.${businessId}`,
        },
        () => {
          onChangeRef.current()
        }
      )
    }

    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, businessId, events.join(',')])
}
