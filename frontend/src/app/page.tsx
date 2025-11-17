'use client'

import * as React from 'react'
import Joyride from 'react-joyride'
import { ModelCardForm, type ModelCardFormHandle } from '@/components/forms/model-card-form'
import { ThemeToggle } from '@/components/theme-toggle'
import { InstructionsModal } from '@/components/instructions-modal'
import { ExportModal } from '@/components/export-modal'
import { AutofillConfirmationModal } from '@/components/autofill-confirmation-modal'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Wand2, Sparkles, Slash } from 'lucide-react'
import { useAIAssist } from '@/contexts/ai-assist-context'
import { walkthroughSteps } from '@/lib/walkthrough-steps'

export default function Home() {
  const [showPreview, setShowPreview] = React.useState(true)
  const [isAutofillModalOpen, setIsAutofillModalOpen] = React.useState(false)
  const [runTour, setRunTour] = React.useState(false)
  const fillExampleRef = React.useRef<(() => void) | null>(null)
  const formRef = React.useRef<ModelCardFormHandle>(null)
  const { isEnabled: aiAssistEnabled, toggleEnabled: toggleAIAssist } = useAIAssist()

  const handleFillExample = () => {
    if (fillExampleRef.current) {
      fillExampleRef.current()
    }
  }

  const handleOpenAutofillModal = () => {
    setIsAutofillModalOpen(true)
  }

  const handleCloseAutofillModal = () => {
    setIsAutofillModalOpen(false)
  }

  return (
    <main className="h-screen gradient-bg relative overflow-hidden flex flex-col">
      {/* Subtle professional background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center gap-4 py-6 px-8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold accent-gradient">
              Model Card Generator
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <InstructionsModal onStartWalkthrough={() => setRunTour(true)} />
            <Button
              data-tour="ai-assist"
              variant="outline"
              size="icon"
              onClick={toggleAIAssist}
              className="rounded-xl shadow-lg hover:shadow-xl h-12 w-12"
              title={aiAssistEnabled ? "Disable AI Assist" : "Enable AI Assist"}
            >
              {aiAssistEnabled ? (
                <div className="relative h-6 w-6">
                  <Sparkles className="h-6 w-6" />
                  <Slash className="h-6 w-6 absolute inset-0" />
                </div>
              ) : (
                <Sparkles className="h-6 w-6" />
              )}
              <span className="sr-only">{aiAssistEnabled ? "Disable AI Assist" : "Enable AI Assist"}</span>
            </Button>
            <Button
              data-tour="autofill"
              variant="outline"
              size="icon"
              onClick={handleOpenAutofillModal}
              className="rounded-xl shadow-lg hover:shadow-xl h-12 w-12"
              title="Fill empty fields with example data"
            >
              <Wand2 className="h-6 w-6" />
              <span className="sr-only">Fill example data</span>
            </Button>
            <div data-tour="export">
              <ExportModal formRef={formRef} />
            </div>
            <Button
              data-tour="preview-toggle"
              variant="outline"
              size="icon"
              onClick={() => setShowPreview(!showPreview)}
              className="rounded-xl shadow-lg hover:shadow-xl h-12 w-12"
              title={showPreview ? "Hide preview" : "Show preview"}
            >
              {showPreview ? (
                <EyeOff className="h-6 w-6" />
              ) : (
                <Eye className="h-6 w-6" />
              )}
              <span className="sr-only">{showPreview ? "Hide preview" : "Show preview"}</span>
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden pb-6">
          <ModelCardForm ref={formRef} showPreview={showPreview} onFillExampleRef={fillExampleRef} />
        </div>
      </div>

      {/* Autofill Confirmation Modal */}
      <AutofillConfirmationModal
        isOpen={isAutofillModalOpen}
        onClose={handleCloseAutofillModal}
        onConfirm={handleFillExample}
      />

      {/* Walkthrough Tour */}
      <Joyride
        steps={walkthroughSteps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        styles={{
          options: {
            primaryColor: 'hsl(var(--primary))',
            zIndex: 10000,
          },
        }}
        callback={(data) => {
          const { status } = data
          if (status === 'finished' || status === 'skipped') {
            setRunTour(false)
          }
        }}
      />
    </main>
  )
}
