'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react'

export type AlertVariant = 'error' | 'warning' | 'info' | 'success'

export interface AlertAction {
  label: string
  onClick: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

export interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  variant: AlertVariant
  title: string
  description: string | string[]
  actions?: AlertAction[]
}

const variantConfig = {
  error: {
    icon: AlertCircle,
    iconBgClass: 'bg-destructive/10',
    iconClass: 'text-destructive',
    titleClass: 'text-destructive',
  },
  warning: {
    icon: AlertTriangle,
    iconBgClass: 'bg-amber-500/10',
    iconClass: 'text-amber-500',
    titleClass: 'text-amber-600 dark:text-amber-500',
  },
  info: {
    icon: Info,
    iconBgClass: 'bg-primary/10',
    iconClass: 'text-primary',
    titleClass: 'text-primary',
  },
  success: {
    icon: CheckCircle2,
    iconBgClass: 'bg-accent/10',
    iconClass: 'text-accent',
    titleClass: 'text-accent',
  },
}

export function AlertModal({
  isOpen,
  onClose,
  variant,
  title,
  description,
  actions,
}: AlertModalProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  if (!isOpen) return null

  const descriptionArray = Array.isArray(description) ? description : [description]
  const isList = Array.isArray(description) && description.length > 1

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="glass rounded-2xl p-6 m-4">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${config.iconBgClass} flex-shrink-0`}>
              <Icon className={`h-5 w-5 ${config.iconClass}`} />
            </div>
            <div className="flex-1">
              <h2 className={`text-xl font-bold mb-2 ${config.titleClass}`}>
                {title}
              </h2>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {isList ? (
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {descriptionArray.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{descriptionArray[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end mt-6">
            {actions && actions.length > 0 ? (
              actions.map((action, index) => (
                <Button
                  key={index}
                  type="button"
                  variant={action.variant || 'default'}
                  onClick={() => {
                    action.onClick()
                    onClose()
                  }}
                >
                  {action.label}
                </Button>
              ))
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                OK
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
