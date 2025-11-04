'use client'

import * as React from 'react'

interface Toast {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

interface ToastState {
  toasts: (Toast & { id: string })[]
}

const ToastContext = React.createContext<{
  toast: (props: Toast) => void
  toasts: (Toast & { id: string })[]
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ToastState>({ toasts: [] })

  const toast = React.useCallback((props: Toast) => {
    const id = Math.random().toString(36).substring(7)
    setState((prev) => ({
      toasts: [...prev.toasts, { ...props, id }],
    }))

    // Auto remove after 5 seconds
    setTimeout(() => {
      setState((prev) => ({
        toasts: prev.toasts.filter((t) => t.id !== id),
      }))
    }, 5000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast, toasts: state.toasts }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {state.toasts.map((t) => (
          <div
            key={t.id}
            className={`
              rounded-lg border p-4 shadow-lg animate-in slide-in-from-bottom-5
              ${
                t.variant === 'destructive'
                  ? 'bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
                  : 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700'
              }
            `}
          >
            <div className="font-semibold">{t.title}</div>
            {t.description && (
              <div className="text-sm opacity-90 mt-1">{t.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
