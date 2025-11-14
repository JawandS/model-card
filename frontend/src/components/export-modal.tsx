'use client'

import * as React from 'react'
import { Download, X, FileJson, FileType, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModelCardSchema, type PartialModelCard } from '@modelcard/schema'
import { exportToJSON, exportToPDF, exportToMarkdown, exportToHTML } from '@/lib/exporters'
import { cleanEmptyStrings } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useAlertModal } from '@/hooks/use-alert-modal'

export function ExportModal() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { toast } = useToast()
  const { showAlert } = useAlertModal()

  const handleExport = (format: 'json' | 'pdf' | 'markdown' | 'html') => {
    // Load data from localStorage
    const saved = localStorage.getItem('modelcard-draft')
    if (!saved) {
      showAlert({
        variant: 'error',
        title: 'No Data Found',
        description: 'No model card data found. Please fill out the form first.',
      })
      return
    }

    let formData: PartialModelCard
    try {
      formData = JSON.parse(saved)
    } catch (error) {
      showAlert({
        variant: 'error',
        title: 'Failed to Load Data',
        description: 'Failed to load model card data. The saved data may be corrupted.',
      })
      return
    }

    // Clean empty strings from the data (converts '' to undefined)
    // This prevents validation failures for optional fields with format constraints (e.g., URLs)
    const cleanedData = cleanEmptyStrings(formData)
    const result = ModelCardSchema.safeParse(cleanedData)

    if (!result.success) {
      // Build detailed error message as array
      const errors = result.error.errors
      const errorMessages = errors.map(err => {
        const field = err.path.join('.')
        return `${field}: ${err.message}`
      })

      showAlert({
        variant: 'error',
        title: 'Validation Failed',
        description: [
          'Please fix the following errors:',
          ...errorMessages,
          '',
          'Required fields: model_id, developers',
        ],
      })
      return
    }

    const validData = result.data

    try {
      switch (format) {
        case 'json':
          exportToJSON(validData)
          toast({
            title: 'JSON exported successfully!',
            description: 'Your model card has been downloaded.',
          })
          break
        case 'pdf':
          exportToPDF(validData)
          toast({
            title: 'PDF exported successfully!',
            description: 'Your model card has been downloaded.',
          })
          break
        case 'markdown':
          exportToMarkdown(validData)
          toast({
            title: 'Markdown exported successfully!',
            description: 'Your model card has been downloaded.',
          })
          break
        case 'html':
          exportToHTML(validData)
          toast({
            title: 'HTML exported successfully!',
            description: 'Your model card has been downloaded.',
          })
          break
      }

      // Close modal after export
      setIsOpen(false)
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'There was an error exporting your model card.',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="rounded-xl shadow-lg hover:shadow-xl h-12 w-12"
        title="Export model card"
      >
        <Download className="h-6 w-6" />
        <span className="sr-only">Export Model Card</span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg">
        <div className="glass rounded-2xl p-8 m-4">
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
            <div className="p-3 rounded-xl bg-accent shadow-md">
              <Download className="h-8 w-8 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary">
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
              className="w-full justify-start group h-auto py-4 hover:bg-accent/10"
            >
              <FileJson className="mr-3 h-5 w-5 group-hover:scale-110 group-hover:text-foreground transition-all flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold group-hover:text-foreground">JSON</div>
                <div className="text-xs text-muted-foreground group-hover:text-foreground/80">Machine-readable format</div>
              </div>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleExport('pdf')}
              className="w-full justify-start group h-auto py-4 hover:bg-accent/10"
            >
              <FileType className="mr-3 h-5 w-5 group-hover:scale-110 group-hover:text-foreground transition-all flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold group-hover:text-foreground">PDF</div>
                <div className="text-xs text-muted-foreground group-hover:text-foreground/80">Formatted document for sharing</div>
              </div>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleExport('markdown')}
              className="w-full justify-start group h-auto py-4 hover:bg-accent/10"
            >
              <FileText className="mr-3 h-5 w-5 group-hover:scale-110 group-hover:text-foreground transition-all flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold group-hover:text-foreground">Markdown</div>
                <div className="text-xs text-muted-foreground group-hover:text-foreground/80">For documentation and version control</div>
              </div>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleExport('html')}
              className="w-full justify-start group h-auto py-4 hover:bg-accent/10"
            >
              <Download className="mr-3 h-5 w-5 group-hover:scale-110 group-hover:text-foreground transition-all flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold group-hover:text-foreground">HTML</div>
                <div className="text-xs text-muted-foreground group-hover:text-foreground/80">Interactive accordion format - embeddable anywhere</div>
              </div>
            </Button>
          </div>

          {/* Footer with close button */}
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
