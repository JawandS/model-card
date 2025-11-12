'use client'

import * as React from 'react'
import { Download, X, FileJson, FileType, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModelCardSchema, type ModelCard, type PartialModelCard } from '@modelcard/schema'
import { exportToJSON, exportToPDF, exportToMarkdown, exportToHTML } from '@/lib/exporters'
import { cleanEmptyStrings } from '@/lib/utils'

export function ExportModal() {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleExport = (format: 'json' | 'pdf' | 'markdown' | 'html') => {
    // Load data from localStorage
    const saved = localStorage.getItem('modelcard-draft')
    if (!saved) {
      alert('No model card data found. Please fill out the form first.')
      return
    }

    let formData: PartialModelCard
    try {
      formData = JSON.parse(saved)
    } catch (error) {
      alert('Failed to load model card data.')
      return
    }

    // Clean empty strings from the data (converts '' to undefined)
    // This prevents validation failures for optional fields with format constraints (e.g., URLs)
    const cleanedData = cleanEmptyStrings(formData)

    const result = ModelCardSchema.safeParse(cleanedData)

    if (!result.success) {
      // Build detailed error message
      const errors = result.error.errors
      const errorMessages = errors.map(err => {
        const field = err.path.join('.')
        return `  • ${field}: ${err.message}`
      }).join('\n')

      alert(
        `Validation failed. Please fix the following:\n\n${errorMessages}\n\n` +
        `Required fields: model_id, developers`
      )
      return
    }

    const validData = result.data

    switch (format) {
      case 'json':
        exportToJSON(validData)
        break
      case 'pdf':
        exportToPDF(validData)
        break
      case 'markdown':
        exportToMarkdown(validData)
        break
      case 'html':
        exportToHTML(validData)
        break
    }

    // Close modal after export
    setIsOpen(false)
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="rounded-xl shadow-lg hover:shadow-xl h-12 w-12"
      >
        <Download className="h-6 w-6" />
        <span className="sr-only">Export Model Card</span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg animate-in fade-in duration-150">
        <div className="glass rounded-2xl p-8 m-4">
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <Download className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Export Model Card
              </h2>
              <p className="text-muted-foreground text-base mt-1">
                Download your model card in various formats
              </p>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleExport('json')}
              className="w-full justify-start group h-auto py-4"
            >
              <FileJson className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">JSON</div>
                <div className="text-xs text-muted-foreground">Machine-readable format</div>
              </div>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleExport('pdf')}
              className="w-full justify-start group h-auto py-4"
            >
              <FileType className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">PDF</div>
                <div className="text-xs text-muted-foreground">Formatted document for sharing</div>
              </div>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleExport('markdown')}
              className="w-full justify-start group h-auto py-4"
            >
              <FileText className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">Markdown</div>
                <div className="text-xs text-muted-foreground">For documentation and version control</div>
              </div>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleExport('html')}
              className="w-full justify-start group h-auto py-4"
            >
              <Download className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">HTML</div>
                <div className="text-xs text-muted-foreground">Web-ready format</div>
              </div>
            </Button>
          </div>

          {/* Close button at bottom */}
          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="border-2">
              Cancel
            </Button>
          </div>
        </div>
      </div>
        </>
      )}
    </>
  )
}
