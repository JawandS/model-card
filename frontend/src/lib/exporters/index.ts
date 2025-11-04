import { ModelCard } from '@modelcard/schema'
import { jsPDF } from 'jspdf'

/**
 * Export model card as JSON
 */
export function exportToJSON(data: ModelCard) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${data.name.replace(/\s+/g, '-').toLowerCase()}-modelcard.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export model card as Markdown
 */
export function exportToMarkdown(data: ModelCard) {
  let markdown = `# ${data.name}\n\n`

  // Model Details
  if (data.model_details) {
    markdown += `## Model Details\n\n`
    if (data.model_details.version) markdown += `**Version:** ${data.model_details.version}\n\n`
    if (data.model_details.description) markdown += `${data.model_details.description}\n\n`
    if (data.model_details.license) markdown += `**License:** ${data.model_details.license}\n\n`
  }

  // Training Data
  if (data.training_data) {
    markdown += `## Training Data\n\n`
    if (data.training_data.description) markdown += `${data.training_data.description}\n\n`
    if (data.training_data.source) markdown += `**Source:** ${data.training_data.source}\n\n`
    if (data.training_data.size) markdown += `**Size:** ${data.training_data.size}\n\n`
  }

  // Implementation
  if (data.implementation) {
    markdown += `## Implementation\n\n`
    if (data.implementation.hardware) markdown += `**Hardware:** ${data.implementation.hardware}\n\n`
    if (data.implementation.software) markdown += `**Software:** ${data.implementation.software}\n\n`
    if (data.implementation.framework) markdown += `**Framework:** ${data.implementation.framework}\n\n`
  }

  // Evaluation
  if (data.evaluation) {
    markdown += `## Evaluation\n\n`
    if (data.evaluation.benchmark_results) markdown += `### Benchmark Results\n\n${data.evaluation.benchmark_results}\n\n`
    if (data.evaluation.metrics) markdown += `### Metrics\n\n${data.evaluation.metrics}\n\n`
    if (data.evaluation.factors) markdown += `### Subgroup Analysis\n\n${data.evaluation.factors}\n\n`
  }

  // Ethics and Safety
  if (data.ethics_and_safety) {
    markdown += `## Ethics and Safety\n\n`
    if (data.ethics_and_safety.approach) markdown += `**Approach:** ${data.ethics_and_safety.approach}\n\n`
    if (data.ethics_and_safety.bias_analysis) markdown += `### Bias Analysis\n\n${data.ethics_and_safety.bias_analysis}\n\n`
    if (data.ethics_and_safety.fairness_assessment) markdown += `### Fairness Assessment\n\n${data.ethics_and_safety.fairness_assessment}\n\n`
    if (data.ethics_and_safety.risks) markdown += `**Risks:** ${data.ethics_and_safety.risks}\n\n`
  }

  // Usage and Limitations
  if (data.usage_and_limitations) {
    markdown += `## Usage and Limitations\n\n`
    if (data.usage_and_limitations.intended_use) markdown += `### Intended Use\n\n${data.usage_and_limitations.intended_use}\n\n`
    if (data.usage_and_limitations.limitations) markdown += `### Limitations\n\n${data.usage_and_limitations.limitations}\n\n`
  }

  // Healthcare Extension
  if (data.healthcare) {
    markdown += `## Healthcare Extension\n\n`
    if (data.healthcare.clinical_context) markdown += `**Clinical Context:** ${data.healthcare.clinical_context}\n\n`
    if (data.healthcare.care_setting) markdown += `**Care Setting:** ${data.healthcare.care_setting}\n\n`
    if (data.healthcare.patient_population) markdown += `**Patient Population:** ${data.healthcare.patient_population}\n\n`
  }

  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${data.name.replace(/\s+/g, '-').toLowerCase()}-modelcard.md`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export model card as HTML
 */
export function exportToHTML(data: ModelCard) {
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${data.name} - Model Card</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1 { border-bottom: 3px solid #333; padding-bottom: 10px; }
    h2 { color: #444; margin-top: 30px; border-bottom: 2px solid #ddd; padding-bottom: 5px; }
    h3 { color: #666; }
  </style>
</head>
<body>
  <h1>${data.name}</h1>
`

  if (data.model_details?.version) {
    html += `<p><strong>Version:</strong> ${data.model_details.version}</p>`
  }

  if (data.model_details?.description) {
    html += `<h2>Model Details</h2><p>${data.model_details.description}</p>`
  }

  if (data.evaluation?.metrics) {
    html += `<h2>Evaluation</h2><p>${data.evaluation.metrics}</p>`
  }

  if (data.ethics_and_safety?.bias_analysis) {
    html += `<h2>Ethics and Safety</h2><h3>Bias Analysis</h3><p>${data.ethics_and_safety.bias_analysis}</p>`
  }

  html += `</body></html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${data.name.replace(/\s+/g, '-').toLowerCase()}-modelcard.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export model card as PDF
 */
export function exportToPDF(data: ModelCard) {
  const doc = new jsPDF()
  let y = 20

  // Title
  doc.setFontSize(20)
  doc.text(data.name, 20, y)
  y += 15

  // Version
  if (data.model_details?.version) {
    doc.setFontSize(12)
    doc.text(`Version: ${data.model_details.version}`, 20, y)
    y += 10
  }

  // Description
  if (data.model_details?.description) {
    doc.setFontSize(14)
    doc.text('Model Details', 20, y)
    y += 7
    doc.setFontSize(10)
    const descLines = doc.splitTextToSize(data.model_details.description, 170)
    doc.text(descLines, 20, y)
    y += descLines.length * 5 + 10
  }

  doc.save(`${data.name.replace(/\s+/g, '-').toLowerCase()}-modelcard.pdf`)
}
