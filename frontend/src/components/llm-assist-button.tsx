'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface LLMAssistButtonProps {
  fieldName: string
  fieldDescription: string
  contextData: Record<string, any>
  onSuggestion: (suggestion: string) => void
  className?: string
}

export function LLMAssistButton({
  fieldName,
  fieldDescription,
  contextData,
  onSuggestion,
  className,
}: LLMAssistButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const handleAssist = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/llm-assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fieldName,
          fieldDescription,
          contextData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get suggestion')
      }

      const data = await response.json()
      onSuggestion(data.suggestion)

      toast({
        title: 'Suggestion generated',
        description: 'AI suggestion has been added to the field. You can edit it as needed.',
      })
    } catch (error: any) {
      console.error('LLM assist error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate suggestion. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleAssist}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      ) : (
        <>
          <Sparkles className="mr-2 h-3 w-3" />
          Assist
        </>
      )}
    </Button>
  )
}
