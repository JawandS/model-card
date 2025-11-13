'use client'

import * as React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { LLMAssistButton } from '@/components/llm-assist-button'
import { useAIAssist } from '@/contexts/ai-assist-context'

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
  const { isEnabled: userEnabled } = useAIAssist()
  const [apiEnabled, setApiEnabled] = React.useState(false)
  const [configLoaded, setConfigLoaded] = React.useState(false)

  React.useEffect(() => {
    // Check if AI assist API is configured
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        setApiEnabled(data.aiAssistEnabled)
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

  // AI assist is enabled if both user preference and API are enabled
  const aiAssistEnabled = configLoaded && apiEnabled && userEnabled

  // Add right padding to textarea when AI button is present to prevent text overlap
  const textareaClassName = React.useMemo(() => {
    const baseClassName = props.className || ''
    if (aiAssistEnabled) {
      // Add padding-right if not already present
      return baseClassName.includes('pr-') ? baseClassName : `${baseClassName} pr-24`
    }
    return baseClassName
  }, [aiAssistEnabled, props.className])

  return (
    <div className="relative">
      <Textarea ref={ref} {...props} className={textareaClassName} />
      {aiAssistEnabled && (
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
