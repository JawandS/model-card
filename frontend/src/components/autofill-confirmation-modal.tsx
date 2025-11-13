'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Wand2 } from 'lucide-react'

interface AutofillConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function AutofillConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: AutofillConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="glass rounded-2xl p-6 m-4">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
              <Wand2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Fill Empty Fields?
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This will fill all empty fields with example data. Your existing data will be preserved.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleConfirm}
            >
              Fill Example Data
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
