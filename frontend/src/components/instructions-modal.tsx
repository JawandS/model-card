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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl animate-in fade-in duration-150">
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
                A model card is a documentation framework for machine learning models, providing transparency about their development, intended use, and performance characteristics. This is especially critical in healthcare applications.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How to Use</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Fill out all required fields marked with * in the form</li>
                <li>Watch the live preview update as you type</li>
                <li>Add optional sections like Risk Management and Provenance as needed</li>
                <li>Export your completed model card in JSON, PDF, Markdown, or HTML format</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Required Sections</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Basic Information:</strong> Model name, version, and owner</li>
                <li><strong>Intended Use:</strong> Clinical context and care settings</li>
                <li><strong>Data Sources:</strong> Training data characteristics</li>
                <li><strong>Evaluation:</strong> Performance metrics and validation</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Optional Sections</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Risk Management:</strong> Safety considerations and oversight</li>
                <li><strong>Provenance:</strong> Creation metadata and lineage</li>
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
