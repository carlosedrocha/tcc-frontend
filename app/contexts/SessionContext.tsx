'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type User = {
  userId: string
  name?: string
  email?: string
}

type SessionContextType = {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for existing session data on component mount
    const storedUser = localStorage.getItem('user')
    console.log(localStorage)
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    // Add any additional logout logic here (e.g., clearing other storage, redirecting)
  }

  return (
    <SessionContext.Provider value={{ user, setUser, logout }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}