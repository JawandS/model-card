'use client'

import * as React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { LLMAssistButton } from '@/components/llm-assist-button'

interface TextareaWithAssistProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  fieldName: string
  fieldDescription: string
  contextData: Record<string, any>
  onValueChange?: (value: string) => void
}

const TextareaWithAssist = React.forwardRef<
  HTMLTextAreaElement,
  TextareaWithAssistProps
>(({ fieldName, fieldDescription, contextData, onValueChange, ...props }, ref) => {
  const [aiAssistEnabled, setAiAssistEnabled] = React.useState(false)
  const [configLoaded, setConfigLoaded] = React.useState(false)

  React.useEffect(() => {
    // Check if AI assist is enabled by fetching config
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        setAiAssistEnabled(data.aiAssistEnabled)
        setConfigLoaded(true)
      })
      .catch((error) => {
        console.error('Failed to fetch config:', error)
        setConfigLoaded(true)
      })
  }, [])

  const handleSuggestion = (suggestion: string) => {
    if (onValueChange) {
      onValueChange(suggestion)
    }
  }

  // Add right padding to textarea when AI button is present to prevent text overlap
  const textareaClassName = React.useMemo(() => {
    const baseClassName = props.className || ''
    if (configLoaded && aiAssistEnabled) {
      // Add padding-right if not already present
      return baseClassName.includes('pr-') ? baseClassName : `${baseClassName} pr-24`
    }
    return baseClassName
  }, [configLoaded, aiAssistEnabled, props.className])

  return (
    <div className="relative">
      <Textarea ref={ref} {...props} className={textareaClassName} />
      {configLoaded && aiAssistEnabled && (
        <div className="absolute top-2 right-2">
          <LLMAssistButton
            fieldName={fieldName}
            fieldDescription={fieldDescription}
            contextData={contextData}
            onSuggestion={handleSuggestion}
            className="bg-background/95 backdrop-blur-sm"
          />
        </div>
      )}
    </div>
  )
})

TextareaWithAssist.displayName = 'TextareaWithAssist'

export { TextareaWithAssist }
