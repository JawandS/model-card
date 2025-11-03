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
  markdown += `**Version:** ${data.model_version}\n\n`

  // Owner
  markdown += `## Owner\n\n`
  markdown += `- **Organization:** ${data.owner.organization}\n`
  if (data.owner.contact) {
    markdown += `- **Contact:** ${data.owner.contact}\n`
  }
  markdown += `\n`

  // Intended Use
  markdown += `## Intended Use\n\n`
  markdown += `${data.intended_use.summary}\n\n`
  markdown += `- **Clinical Context:** ${data.intended_use.clinical_context}\n`
  if (data.intended_use.care_setting) {
    markdown += `- **Care Setting:** ${data.intended_use.care_setting}\n`
  }
  if (data.intended_use.contraindications) {
    markdown += `\n**Contraindications:**\n${data.intended_use.contraindications}\n`
  }
  markdown += `\n`

  // Data
  markdown += `## Data\n\n`
  markdown += `- **Source:** ${data.data.source}\n`
  markdown += `- **Time Window:** ${data.data.time_window}\n`
  if (data.data.geography) {
    markdown += `- **Geography:** ${data.data.geography}\n`
  }

  if (data.data.representativeness) {
    markdown += `\n### Representativeness\n\n`
    const rep = data.data.representativeness
    if (rep.population_frame) markdown += `**Population Frame:** ${rep.population_frame}\n\n`
    if (rep.payer_mix) markdown += `**Payer Mix:** ${rep.payer_mix}\n\n`
    if (rep.age_distribution) markdown += `**Age Distribution:** ${rep.age_distribution}\n\n`
    if (rep.sex_distribution) markdown += `**Sex Distribution:** ${rep.sex_distribution}\n\n`
    if (rep.race_ethnicity_notes) markdown += `**Race/Ethnicity:** ${rep.race_ethnicity_notes}\n\n`
    if (rep.missingness) markdown += `**Missingness:** ${rep.missingness}\n\n`
  }
  markdown += `\n`

  // Evaluation
  markdown += `## Evaluation\n\n`
  markdown += `### Overall Metrics\n\n${data.evaluation.overall_metrics}\n\n`
  if (data.evaluation.subgroup_analysis) {
    markdown += `### Subgroup Analysis\n\n${data.evaluation.subgroup_analysis}\n\n`
  }
  if (data.evaluation.external_validation) {
    markdown += `### External Validation\n\n${data.evaluation.external_validation}\n\n`
  }
  if (data.evaluation.limitations) {
    markdown += `### Limitations\n\n${data.evaluation.limitations}\n\n`
  }

  // Risk Management (optional)
  if (data.risk_management && Object.values(data.risk_management).some(v => v)) {
    markdown += `## Risk Management\n\n`
    if (data.risk_management.failure_modes) {
      markdown += `**Failure Modes:** ${data.risk_management.failure_modes}\n\n`
    }
    if (data.risk_management.human_oversight) {
      markdown += `**Human Oversight:** ${data.risk_management.human_oversight}\n\n`
    }
    if (data.risk_management.monitoring_plan) {
      markdown += `**Monitoring Plan:** ${data.risk_management.monitoring_plan}\n\n`
    }
  }

  // Provenance (optional)
  if (data.provenance && Object.values(data.provenance).some(v => v)) {
    markdown += `## Provenance\n\n`
    if (data.provenance.created_at) markdown += `- **Created:** ${data.provenance.created_at}\n`
    if (data.provenance.created_by) markdown += `- **Created By:** ${data.provenance.created_by}\n`
    if (data.provenance.dataset_id) markdown += `- **Dataset ID:** ${data.provenance.dataset_id}\n`
    if (data.provenance.artifact_hash) markdown += `- **Artifact Hash:** ${data.provenance.artifact_hash}\n`
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
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name} - Model Card</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
    h2 { color: #1e40af; margin-top: 30px; border-bottom: 2px solid #ddd; padding-bottom: 8px; }
    h3 { color: #1e3a8a; margin-top: 20px; }
    .metadata { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .section { margin: 20px 0; }
    .label { font-weight: 600; color: #4b5563; }
    pre { background: #f9fafb; padding: 10px; border-left: 3px solid #2563eb; overflow-x: auto; }
    @media print { body { max-width: 100%; } }
  </style>
</head>
<body>
  <h1>${data.name}</h1>

  <div class="metadata">
    <p><span class="label">Version:</span> ${data.model_version}</p>
    <p><span class="label">Organization:</span> ${data.owner.organization}</p>
    ${data.owner.contact ? `<p><span class="label">Contact:</span> ${data.owner.contact}</p>` : ''}
  </div>

  <h2>Intended Use</h2>
  <div class="section">
    <p>${data.intended_use.summary}</p>
    <p><span class="label">Clinical Context:</span> ${data.intended_use.clinical_context}</p>
    ${data.intended_use.care_setting ? `<p><span class="label">Care Setting:</span> ${data.intended_use.care_setting}</p>` : ''}
    ${data.intended_use.contraindications ? `<p><span class="label">Contraindications:</span> ${data.intended_use.contraindications}</p>` : ''}
  </div>

  <h2>Data</h2>
  <div class="section">
    <p><span class="label">Source:</span> ${data.data.source}</p>
    <p><span class="label">Time Window:</span> ${data.data.time_window}</p>
    ${data.data.geography ? `<p><span class="label">Geography:</span> ${data.data.geography}</p>` : ''}

    ${data.data.representativeness ? `
    <h3>Data Representativeness</h3>
    ${data.data.representativeness.population_frame ? `<p><span class="label">Population Frame:</span> ${data.data.representativeness.population_frame}</p>` : ''}
    ${data.data.representativeness.age_distribution ? `<p><span class="label">Age Distribution:</span> ${data.data.representativeness.age_distribution}</p>` : ''}
    ${data.data.representativeness.sex_distribution ? `<p><span class="label">Sex Distribution:</span> ${data.data.representativeness.sex_distribution}</p>` : ''}
    ` : ''}
  </div>

  <h2>Evaluation</h2>
  <div class="section">
    <h3>Overall Metrics</h3>
    <pre>${data.evaluation.overall_metrics}</pre>
    ${data.evaluation.subgroup_analysis ? `<h3>Subgroup Analysis</h3><pre>${data.evaluation.subgroup_analysis}</pre>` : ''}
    ${data.evaluation.limitations ? `<h3>Limitations</h3><p>${data.evaluation.limitations}</p>` : ''}
  </div>

  ${data.risk_management && Object.values(data.risk_management).some(v => v) ? `
  <h2>Risk Management</h2>
  <div class="section">
    ${data.risk_management.failure_modes ? `<p><span class="label">Failure Modes:</span> ${data.risk_management.failure_modes}</p>` : ''}
    ${data.risk_management.human_oversight ? `<p><span class="label">Human Oversight:</span> ${data.risk_management.human_oversight}</p>` : ''}
    ${data.risk_management.monitoring_plan ? `<p><span class="label">Monitoring Plan:</span> ${data.risk_management.monitoring_plan}</p>` : ''}
  </div>
  ` : ''}

  ${data.provenance && Object.values(data.provenance).some(v => v) ? `
  <h2>Provenance</h2>
  <div class="section">
    ${data.provenance.created_at ? `<p><span class="label">Created:</span> ${data.provenance.created_at}</p>` : ''}
    ${data.provenance.created_by ? `<p><span class="label">Created By:</span> ${data.provenance.created_by}</p>` : ''}
    ${data.provenance.dataset_id ? `<p><span class="label">Dataset ID:</span> ${data.provenance.dataset_id}</p>` : ''}
  </div>
  ` : ''}

  <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #6b7280;">
    <p>Generated on ${new Date().toLocaleDateString()}</p>
  </footer>
</body>
</html>`

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
  let yPos = 20

  // Title
  doc.setFontSize(20)
  doc.setTextColor(37, 99, 235)
  doc.text(data.name, 20, yPos)
  yPos += 10

  // Version & Owner
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.text(`Version: ${data.model_version}`, 20, yPos)
  yPos += 6
  doc.text(`Organization: ${data.owner.organization}`, 20, yPos)
  yPos += 6
  if (data.owner.contact) {
    doc.text(`Contact: ${data.owner.contact}`, 20, yPos)
    yPos += 6
  }
  yPos += 4

  // Intended Use
  doc.setFontSize(14)
  doc.setTextColor(30, 64, 175)
  doc.text('Intended Use', 20, yPos)
  yPos += 8
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  const summaryLines = doc.splitTextToSize(data.intended_use.summary, 170)
  doc.text(summaryLines, 20, yPos)
  yPos += summaryLines.length * 5 + 4
  doc.text(`Clinical Context: ${data.intended_use.clinical_context}`, 20, yPos)
  yPos += 6
  if (data.intended_use.care_setting) {
    doc.text(`Care Setting: ${data.intended_use.care_setting}`, 20, yPos)
    yPos += 6
  }
  yPos += 4

  // Check if we need a new page
  if (yPos > 250) {
    doc.addPage()
    yPos = 20
  }

  // Data
  doc.setFontSize(14)
  doc.setTextColor(30, 64, 175)
  doc.text('Data', 20, yPos)
  yPos += 8
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.text(`Source: ${data.data.source}`, 20, yPos)
  yPos += 6
  doc.text(`Time Window: ${data.data.time_window}`, 20, yPos)
  yPos += 6
  if (data.data.geography) {
    doc.text(`Geography: ${data.data.geography}`, 20, yPos)
    yPos += 6
  }
  yPos += 4

  // Evaluation
  if (yPos > 250) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setTextColor(30, 64, 175)
  doc.text('Evaluation', 20, yPos)
  yPos += 8
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  const metricsLines = doc.splitTextToSize(data.evaluation.overall_metrics, 170)
  doc.text(metricsLines, 20, yPos)
  yPos += metricsLines.length * 5

  doc.save(`${data.name.replace(/\s+/g, '-').toLowerCase()}-modelcard.pdf`)
}
