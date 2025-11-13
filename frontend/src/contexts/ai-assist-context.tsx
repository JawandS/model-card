'use client'

import * as React from 'react'

interface AIAssistContextType {
  isEnabled: boolean
  toggleEnabled: () => void
}

const AIAssistContext = React.createContext<AIAssistContextType | undefined>(undefined)

export function AIAssistProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = React.useState(true)
  const [mounted, setMounted] = React.useState(false)

  // Load preference from localStorage on mount (client-side only)
  React.useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ai-assist-enabled')
      if (stored !== null) {
        setIsEnabled(stored === 'true')
      }
    }
  }, [])

  // Save preference to localStorage when it changes (client-side only)
  React.useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('ai-assist-enabled', String(isEnabled))
    }
  }, [isEnabled, mounted])

  const toggleEnabled = React.useCallback(() => {
    setIsEnabled((prev) => !prev)
  }, [])

  return (
    <AIAssistContext.Provider value={{ isEnabled, toggleEnabled }}>
      {children}
    </AIAssistContext.Provider>
  )
}

export function useAIAssist() {
  const context = React.useContext(AIAssistContext)
  if (context === undefined) {
    throw new Error('useAIAssist must be used within AIAssistProvider')
  }
  return context
}
