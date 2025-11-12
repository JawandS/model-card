'use client'

import * as React from 'react'
import { CheckCircle2, Circle } from 'lucide-react'
import { type PartialModelCard } from '@modelcard/schema'
import { calculateSectionCompletion, type SectionConfig } from '@/lib/section-config'

interface SectionProgressIndicatorProps {
  formData: PartialModelCard
  section: SectionConfig
}

export function SectionProgressIndicator({ formData, section }: SectionProgressIndicatorProps) {
  const { completed, total, percentage } = React.useMemo(
    () => calculateSectionCompletion(formData, section),
    [formData, section]
  )

  const isComplete = completed === total && total > 0
  const hasProgress = completed > 0

  return (
    <div className="flex items-center gap-2 ml-auto">
      {/* Completion indicator */}
      {isComplete ? (
        <CheckCircle2 className="h-4 w-4 text-accent animate-in zoom-in duration-200" />
      ) : hasProgress ? (
        <div className="relative h-4 w-4">
          <svg className="transform -rotate-90 h-4 w-4">
            <circle
              cx="8"
              cy="8"
              r="6"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              className="text-border"
            />
            <circle
              cx="8"
              cy="8"
              r="6"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              className="text-primary transition-all duration-300"
              strokeDasharray={`${2 * Math.PI * 6}`}
              strokeDashoffset={`${2 * Math.PI * 6 * (1 - percentage / 100)}`}
              strokeLinecap="round"
            />
          </svg>
        </div>
      ) : (
        <Circle className="h-4 w-4 text-muted-foreground" />
      )}

      {/* Field count */}
      <span className={`text-xs tabular-nums transition-colors ${
        isComplete
          ? 'text-accent font-medium'
          : hasProgress
            ? 'text-foreground'
            : 'text-muted-foreground'
      }`}>
        {completed}/{total}
      </span>
    </div>
  )
}
