'use client'

import * as React from 'react'
import { FileText } from 'lucide-react'

interface SaveIndicatorProps {
  isSaving: boolean
  lastSaved?: Date
}

export function SaveIndicator({ isSaving, lastSaved }: SaveIndicatorProps) {
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    if (seconds < 5) return 'just now'
    if (seconds < 60) return `${seconds}s ago`

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {isSaving ? (
        <>
          <FileText className="h-3.5 w-3.5 animate-pulse" />
          <span className="animate-pulse">Saving...</span>
        </>
      ) : lastSaved ? (
        <>
          <FileText className="h-3.5 w-3.5" />
          <span>Saved {getTimeAgo(lastSaved)}</span>
        </>
      ) : (
        <>
          <FileText className="h-3.5 w-3.5 opacity-60" />
          <span>Not saved</span>
        </>
      )}
    </div>
  )
}
