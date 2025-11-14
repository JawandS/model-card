import type { ModelCard } from '@modelcard/schema'
import { jsPDF } from 'jspdf'
import { BaseExporter } from './base'
import type { ExportOptions } from './types'
import { markdownToPlainText } from './utils'

/**
 * PDF exporter
 * Exports model card as formatted PDF document
 */
export class PdfExporter extends BaseExporter {
  readonly format = 'pdf' as const
  readonly fileExtension = 'pdf'
  readonly mimeType = 'application/pdf'

  // PDF layout constants
  private readonly pageHeight: number
  private readonly margin = 20
  private readonly maxWidth = 170

  constructor() {
    super()
    // Initialize jsPDF to get page height
    const tempDoc = new jsPDF()
    this.pageHeight = tempDoc.internal.pageSize.height
  }

  protected generate(data: ModelCard, options: ExportOptions): Blob {
    const doc = new jsPDF()
    let y = 20

    // Helper to check if we need a new page
    const checkPageBreak = (requiredSpace: number) => {
      if (y + requiredSpace > this.pageHeight - this.margin) {
        doc.addPage()
        y = this.margin
      }
    }

    // Helper to add a section
    const addSection = (title: string, content: string | undefined) => {
      if (!content || !content.trim()) return

      checkPageBreak(20)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text(title, this.margin, y)
      y += 8

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const plainText = markdownToPlainText(content)
      const lines = doc.splitTextToSize(plainText, this.maxWidth)

      lines.forEach((line: string) => {
        checkPageBreak(7)
        doc.text(line, this.margin, y)
        y += 5
      })
      y += 5
    }

    // Title
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(`Model Card for ${data.model_id}`, this.margin, y)
    y += 15

    // Summary
    if (data.model_summary) {
      doc.setFontSize(11)
      doc.setFont('helvetica', 'italic')
      const summaryText = markdownToPlainText(data.model_summary)
      const summaryLines = doc.splitTextToSize(summaryText, this.maxWidth)
      doc.text(summaryLines, this.margin, y)
      y += summaryLines.length * 5 + 10
    }

    // Model Details
    if (data.model_description) {
      addSection('Model Details', data.model_description)
    }

    // Key metadata
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    if (data.developers) {
      checkPageBreak(6)
      doc.text(`Developers: ${data.developers}`, this.margin, y)
      y += 6
    }
    if (data.license) {
      checkPageBreak(6)
      doc.text(`License: ${data.license}`, this.margin, y)
      y += 6
    }
    if (data.model_type) {
      checkPageBreak(6)
      doc.text(`Model Type: ${data.model_type}`, this.margin, y)
      y += 6
    }
    y += 5

    // Uses
    if (data.uses?.direct_use) {
      addSection('Direct Use', data.uses.direct_use)
    }
    if (data.uses?.downstream_use) {
      addSection('Downstream Use', data.uses.downstream_use)
    }
    if (data.uses?.out_of_scope_use) {
      addSection('Out-of-Scope Use', data.uses.out_of_scope_use)
    }

    // Bias, Risks, and Limitations
    if (data.bias_risks?.bias_risks_limitations) {
      addSection('Bias, Risks, and Limitations', data.bias_risks.bias_risks_limitations)
    }
    if (data.bias_risks?.bias_recommendations) {
      addSection('Recommendations', data.bias_risks.bias_recommendations)
    }

    // Training Details
    if (data.training_details?.training_data) {
      addSection('Training Data', data.training_details.training_data)
    }
    if (data.training_details?.preprocessing) {
      addSection('Preprocessing', data.training_details.preprocessing)
    }

    // Evaluation
    if (data.evaluation?.results) {
      addSection('Evaluation Results', data.evaluation.results)
    }

    // Technical Specifications
    if (data.technical_specs?.model_specs) {
      addSection('Technical Specifications', data.technical_specs.model_specs)
    }

    // Additional Information
    if (data.additional_info?.glossary) {
      addSection('Glossary', data.additional_info.glossary)
    }

    // Generate blob
    return doc.output('blob')
  }

  protected download(content: Blob, filename: string): void {
    // jsPDF blob doesn't need URL.createObjectURL
    const url = URL.createObjectURL(content)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}
