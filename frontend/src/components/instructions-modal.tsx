'use client'

import * as React from 'react'
import { HelpCircle, X, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function InstructionsModal() {
  const [isOpen, setIsOpen] = React.useState(false)

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="rounded-xl shadow-lg hover:shadow-xl h-12 w-12"
        title="Help and instructions"
      >
        <HelpCircle className="h-6 w-6" />
        <span className="sr-only">Instructions</span>
      </Button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl">
        <div className="glass rounded-2xl p-8 m-4 max-h-[85vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary shadow-md">
              <Stethoscope className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary">
                Model Card Generator
              </h2>
              <p className="text-muted-foreground text-base mt-1">
                Create comprehensive, compliant documentation for your ML models
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-6 text-sm">
            <div>
              <h3 className="text-lg font-semibold mb-2">What is a Model Card?</h3>
              <p className="text-muted-foreground leading-relaxed">
                A model card is a documentation framework for machine learning models, providing transparency about their development, intended use, and performance characteristics. This tool follows the HuggingFace Model Card standard.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Priority Levels</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold">*</span>
                  <span><strong className="text-destructive">Red asterisk</strong> = Critical - Required to export</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground font-bold">*</span>
                  <span><strong>White asterisk</strong> = Required - Strongly recommended for complete model cards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground">—</span>
                  <span><strong>No asterisk</strong> = Optional - Nice to have</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How to Use</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Navigate through accordion sections to fill out the form</li>
                <li>Track your progress with completion indicators for each section</li>
                <li>Fill out critical sections (red asterisk) - required to export</li>
                <li>Complete required sections (white asterisk) for a comprehensive model card</li>
                <li>Add optional information as needed</li>
                <li>Watch the live preview update (toggle on/off with the eye icon)</li>
                <li>Your work auto-saves to local storage every second</li>
                <li>Export your completed model card in JSON, PDF, Markdown, or HTML format</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Critical Sections <span className="text-destructive">*</span></h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Basic Information:</strong> Model ID (required to export)</li>
                <li><strong>Model Details:</strong> Developers (required to export)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Required Sections <span className="text-foreground">*</span></h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Uses:</strong> Intended use cases, limitations, and out-of-scope uses</li>
                <li><strong>Bias, Risks & Limitations:</strong> Ethics and safety considerations</li>
                <li><strong>Training Details:</strong> Training data and procedures</li>
                <li><strong>Evaluation:</strong> Performance metrics and testing results</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Optional Sections</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Model Sources:</strong> Repository, paper, and demo links</li>
                <li><strong>Environmental Impact:</strong> Carbon footprint and compute resources</li>
                <li><strong>Technical Specifications:</strong> Model architecture and infrastructure</li>
                <li><strong>Citation:</strong> How to cite your model</li>
                <li><strong>Additional Information:</strong> Model examination, glossary, authors</li>
                <li><strong>HuggingFace Metadata:</strong> Library, pipeline tag, tags for Hub integration</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Progress tracking shows completion percentage</li>
                <li>Accordion sections collapse/expand for easy navigation</li>
                <li>Save indicator shows when data is being saved</li>
                <li>Reset button clears all fields (with confirmation)</li>
                <li>AI assistance available on select fields (if configured)</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Your data is automatically saved to local storage as you work. Nothing is sent to a server.
              </p>
            </div>
          </div>

          {/* Close button at bottom */}
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setIsOpen(false)}>
              Got it
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
