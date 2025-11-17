import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const isInvalid = props['aria-invalid'] === true || props['aria-invalid'] === 'true'
    return (
      <textarea
        className={cn(
          'flex min-h-[100px] w-full rounded-xl border bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-4 py-3 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none',
          isInvalid
            ? 'border-destructive focus-visible:ring-destructive focus-visible:border-destructive'
            : 'border-input focus-visible:ring-primary focus-visible:border-primary',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
