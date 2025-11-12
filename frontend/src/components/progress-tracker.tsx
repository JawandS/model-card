'use client'

import * as React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { type PartialModelCard } from '@modelcard/schema'
import { calculateOverallCompletion } from '@/lib/section-config'

interface ProgressTrackerProps {
  formData: PartialModelCard
  showOptionalFields?: boolean
}

export function ProgressTracker({ formData, showOptionalFields = true }: ProgressTrackerProps) {
  const { completed, total, percentage } = React.useMemo(
    () => calculateOverallCompletion(formData, showOptionalFields),
    [formData, showOptionalFields]
  )

  const isComplete = completed === total && total > 0
  const hasProgress = completed > 0

  return (
    <div className="flex items-center gap-3">
      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        {isComplete ? (
          <CheckCircle2 className="h-5 w-5 text-accent animate-in zoom-in duration-300" />
        ) : (
          <div className="relative h-5 w-5">
            <svg className="transform -rotate-90 h-5 w-5">
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-border"
              />
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className={`transition-all duration-500 ${
                  hasProgress ? 'text-primary' : 'text-muted'
                }`}
                strokeDasharray={`${2 * Math.PI * 8}`}
                strokeDashoffset={`${2 * Math.PI * 8 * (1 - percentage / 100)}`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
        <div className="text-sm font-medium">
          {isComplete ? (
            <span className="text-accent animate-in fade-in duration-300">
              All sections complete
            </span>
          ) : (
            <span className="text-muted-foreground">
              {completed}/{total} sections
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="hidden sm:flex items-center gap-2 min-w-[120px]">
        <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${
              isComplete ? 'bg-accent' : hasProgress ? 'bg-primary' : 'bg-muted-foreground'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  )
}
