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

    const formatList = (value?: string | string[]) => {
      if (!value) return ''
      return Array.isArray(value) ? value.join(', ') : value
    }

    const formatPairs = (pairs: Array<[string, string | undefined]>) =>
      pairs
        .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
        .map(([label, value]) => `${label}: ${markdownToPlainText(String(value))}`)
        .join('\n')

    // Model Details
    const detailLines: string[] = []
    if (data.model_description) {
      detailLines.push(markdownToPlainText(data.model_description))
    }
    const detailPairs = formatPairs([
      ['Developed by', data.developers],
      ['Funded by', data.funded_by],
      ['Shared by', data.shared_by],
      ['Model type', data.model_type],
      ['Language(s)', data.language],
      ['License', data.license],
      ['Finetuned from', data.base_model],
    ])
    if (detailPairs) {
      detailLines.push(detailPairs)
    }
    addSection('Model Details', detailLines.join('\n\n'))

    // Model Sources
    const sourcesText = formatPairs([
      ['Repository', data.model_sources?.repo],
      ['Paper', data.model_sources?.paper],
      ['Demo', data.model_sources?.demo],
    ])
    addSection('Model Sources', sourcesText)

    // Quickstart
    addSection('How to Get Started', data.get_started_code)

    // Uses
    addSection('Direct Use', data.uses?.direct_use)
    addSection('Downstream Use', data.uses?.downstream_use)
    addSection('Out-of-Scope Use', data.uses?.out_of_scope_use)

    // Bias, Risks, and Limitations
    addSection('Bias, Risks, and Limitations', data.bias_risks?.bias_risks_limitations)
    addSection('Recommendations', data.bias_risks?.bias_recommendations)

    // Training Details
    const trainingLines: string[] = []
    if (data.training_details?.training_data) {
      trainingLines.push(`Training Data:\n${markdownToPlainText(data.training_details.training_data)}`)
    }
    if (data.training_details?.preprocessing) {
      trainingLines.push(`Preprocessing:\n${markdownToPlainText(data.training_details.preprocessing)}`)
    }
    if (data.training_details?.training_regime) {
      trainingLines.push(`Training Regime: ${data.training_details.training_regime}`)
    }
    if (data.training_details?.speeds_sizes_times) {
      trainingLines.push(`Speeds/Sizes/Times:\n${markdownToPlainText(data.training_details.speeds_sizes_times)}`)
    }
    addSection('Training Details', trainingLines.join('\n\n'))

    // Evaluation
    const evaluationLines: string[] = []
    if (data.evaluation?.testing_data) {
      evaluationLines.push(`Testing Data:\n${markdownToPlainText(data.evaluation.testing_data)}`)
    }
    if (data.evaluation?.testing_factors) {
      evaluationLines.push(`Testing Factors:\n${markdownToPlainText(data.evaluation.testing_factors)}`)
    }
    if (data.evaluation?.testing_metrics) {
      evaluationLines.push(`Metrics:\n${markdownToPlainText(data.evaluation.testing_metrics)}`)
    }
    if (data.evaluation?.results) {
      evaluationLines.push(`Results:\n${markdownToPlainText(data.evaluation.results)}`)
    }
    if (data.evaluation?.results_summary) {
      evaluationLines.push(`Summary:\n${markdownToPlainText(data.evaluation.results_summary)}`)
    }
    addSection('Evaluation', evaluationLines.join('\n\n'))

    // Environmental Impact
    const envText = formatPairs([
      ['Hardware Type', data.environmental_impact?.hardware_type],
      ['Hours used', data.environmental_impact?.hours_used],
      ['Cloud Provider', data.environmental_impact?.cloud_provider],
      ['Compute Region', data.environmental_impact?.cloud_region],
      ['Carbon Emitted', data.environmental_impact?.co2_emitted],
    ])
    addSection('Environmental Impact', envText)

    // Technical Specifications
    const techLines: string[] = []
    if (data.technical_specs?.model_specs) {
      techLines.push(markdownToPlainText(data.technical_specs.model_specs))
    }
    const techPairs = formatPairs([
      ['Compute Infrastructure', data.technical_specs?.compute_infrastructure],
      ['Hardware Requirements', data.technical_specs?.hardware_requirements],
      ['Software', data.technical_specs?.software],
    ])
    if (techPairs) techLines.push(techPairs)
    addSection('Technical Specifications', techLines.join('\n\n'))

    // Citation
    if (data.citation?.citation_bibtex || data.citation?.citation_apa) {
      const citationText = [
        data.citation?.citation_bibtex ? `BibTeX:\n${markdownToPlainText(data.citation.citation_bibtex)}` : '',
        data.citation?.citation_apa ? `APA:\n${markdownToPlainText(data.citation.citation_apa)}` : '',
      ].filter(Boolean).join('\n\n')
      addSection('Citation', citationText)
    }

    // Additional Information
    const additionalLines: string[] = []
    if (data.additional_info?.model_examination) {
      additionalLines.push(`Model Examination:\n${markdownToPlainText(data.additional_info.model_examination)}`)
    }
    if (data.additional_info?.glossary) {
      additionalLines.push(`Glossary:\n${markdownToPlainText(data.additional_info.glossary)}`)
    }
    if (data.additional_info?.more_information) {
      additionalLines.push(`More Information:\n${markdownToPlainText(data.additional_info.more_information)}`)
    }
    if (data.additional_info?.model_card_authors) {
      additionalLines.push(`Model Card Authors: ${data.additional_info.model_card_authors}`)
    }
    if (data.additional_info?.model_card_contact) {
      additionalLines.push(`Contact: ${data.additional_info.model_card_contact}`)
    }
    addSection('Additional Information', additionalLines.join('\n\n'))

    // HuggingFace Metadata
    const metadataEntries: Array<[string, string | undefined]> = [
      ['Library Name', data.metadata?.library_name],
      ['Pipeline Tag', data.metadata?.pipeline_tag],
      ['Datasets', formatList(data.metadata?.datasets)],
      ['Metrics', formatList(data.metadata?.metrics)],
      ['Tags', formatList(data.metadata?.tags)],
    ]
    const showInference = data.metadata?.inference === false ||
      metadataEntries.some(([, value]) => value && value.trim() !== '')
    if (data.metadata?.inference !== undefined && showInference) {
      metadataEntries.push(['Inference Widget', String(data.metadata.inference)])
    }
    const metadataLines = formatPairs(metadataEntries)
    addSection('HuggingFace Metadata', metadataLines)

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
