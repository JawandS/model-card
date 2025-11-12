'use client'

import * as React from 'react'
import { AlertModal, AlertVariant, AlertAction } from '@/components/alert-modal'

export interface ShowAlertOptions {
  variant: AlertVariant
  title: string
  description: string | string[]
  actions?: AlertAction[]
}

interface AlertModalContextType {
  showAlert: (options: ShowAlertOptions) => void
  hideAlert: () => void
}

const AlertModalContext = React.createContext<AlertModalContextType | undefined>(undefined)

export function AlertModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [alertOptions, setAlertOptions] = React.useState<ShowAlertOptions>({
    variant: 'info',
    title: '',
    description: '',
  })

  const showAlert = React.useCallback((options: ShowAlertOptions) => {
    setAlertOptions(options)
    setIsOpen(true)
  }, [])

  const hideAlert = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <AlertModalContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <AlertModal
        isOpen={isOpen}
        onClose={hideAlert}
        variant={alertOptions.variant}
        title={alertOptions.title}
        description={alertOptions.description}
        actions={alertOptions.actions}
      />
    </AlertModalContext.Provider>
  )
}

export function useAlertModal() {
  const context = React.useContext(AlertModalContext)
  if (!context) {
    throw new Error('useAlertModal must be used within AlertModalProvider')
  }
  return context
}
