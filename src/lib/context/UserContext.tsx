'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Business {
  id: string
  name: string
  email: string | null
  phone: string | null
  voice_preference: string
  timezone: string | null
  subscription_tier: string
  subscription_status: string
}

interface UserContextValue {
  user: { id: string; email?: string } | null
  business: Business | null
  loading: boolean
  /** Re-fetch business data (e.g. after settings update) */
  refreshBusiness: () => Promise<void>
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchBusiness = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('b2b_businesses')
      .select('*')
      .eq('owner_id', userId)
      .single()

    setBusiness(data ?? null)
  }, [supabase])

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser({ id: user.id, email: user.email })
        await fetchBusiness(user.id)
      }
      setLoading(false)
    }
    init()
  }, [supabase.auth, fetchBusiness])

  const refreshBusiness = useCallback(async () => {
    if (user) {
      await fetchBusiness(user.id)
    }
  }, [user, fetchBusiness])

  return (
    <UserContext.Provider value={{ user, business, loading, refreshBusiness }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
