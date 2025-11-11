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
  link.download = `${data.model_id.replace(/\s+/g, '-').toLowerCase()}-modelcard.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export model card as HuggingFace Markdown format with YAML frontmatter
 */
export function exportToMarkdown(data: ModelCard) {
  let markdown = ''

  // YAML Frontmatter
  markdown += `---\n`
  if (data.card_data) {
    markdown += `# Model metadata (optional)\n`
    Object.entries(data.card_data).forEach(([key, value]) => {
      markdown += `${key}: ${value}\n`
    })
  }
  if (data.license) markdown += `license: ${data.license}\n`
  if (data.language) markdown += `language: ${data.language}\n`
  if (data.model_type) markdown += `model_type: ${data.model_type}\n`
  markdown += `---\n\n`

  // Title
  markdown += `# Model Card for ${data.model_id}\n\n`

  // Summary
  if (data.model_summary) {
    markdown += `${data.model_summary}\n\n`
  }

  // Model Details
  markdown += `## Model Details\n\n`
  markdown += `### Model Description\n\n`
  if (data.model_description) markdown += `${data.model_description}\n\n`
  if (data.developers) markdown += `- **Developed by:** ${data.developers}\n`
  if (data.funded_by) markdown += `- **Funded by [optional]:** ${data.funded_by}\n`
  if (data.shared_by) markdown += `- **Shared by [optional]:** ${data.shared_by}\n`
  if (data.model_type) markdown += `- **Model type:** ${data.model_type}\n`
  if (data.language) markdown += `- **Language(s) (NLP):** ${data.language}\n`
  if (data.license) markdown += `- **License:** ${data.license}\n`
  if (data.base_model) markdown += `- **Finetuned from model [optional]:** ${data.base_model}\n`
  markdown += `\n`

  // Model Sources
  if (data.model_sources?.repo || data.model_sources?.paper || data.model_sources?.demo) {
    markdown += `### Model Sources [optional]\n\n`
    if (data.model_sources.repo) markdown += `- **Repository:** ${data.model_sources.repo}\n`
    if (data.model_sources.paper) markdown += `- **Paper [optional]:** ${data.model_sources.paper}\n`
    if (data.model_sources.demo) markdown += `- **Demo [optional]:** ${data.model_sources.demo}\n`
    markdown += `\n`
  }

  // Uses
  if (data.uses) {
    markdown += `## Uses\n\n`
    if (data.uses.direct_use) {
      markdown += `### Direct Use\n\n${data.uses.direct_use}\n\n`
    }
    if (data.uses.downstream_use) {
      markdown += `### Downstream Use [optional]\n\n${data.uses.downstream_use}\n\n`
    }
    if (data.uses.out_of_scope_use) {
      markdown += `### Out-of-Scope Use\n\n${data.uses.out_of_scope_use}\n\n`
    }
  }

  // Bias, Risks, and Limitations
  if (data.bias_risks) {
    markdown += `## Bias, Risks, and Limitations\n\n`
    if (data.bias_risks.bias_risks_limitations) {
      markdown += `${data.bias_risks.bias_risks_limitations}\n\n`
    }
    if (data.bias_risks.bias_recommendations) {
      markdown += `### Recommendations\n\n${data.bias_risks.bias_recommendations}\n\n`
    }
  }

  // How to Get Started
  if (data.get_started_code) {
    markdown += `## How to Get Started with the Model\n\n`
    markdown += `Use the code below to get started with the model.\n\n`
    markdown += `\`\`\`\n${data.get_started_code}\n\`\`\`\n\n`
  }

  // Training Details
  if (data.training_details) {
    markdown += `## Training Details\n\n`
    if (data.training_details.training_data) {
      markdown += `### Training Data\n\n${data.training_details.training_data}\n\n`
    }
    if (data.training_details.preprocessing || data.training_details.training_regime || data.training_details.speeds_sizes_times) {
      markdown += `### Training Procedure\n\n`
      if (data.training_details.preprocessing) {
        markdown += `#### Preprocessing [optional]\n\n${data.training_details.preprocessing}\n\n`
      }
      if (data.training_details.training_regime) {
        markdown += `#### Training Hyperparameters\n\n- **Training regime:** ${data.training_details.training_regime}\n\n`
      }
      if (data.training_details.speeds_sizes_times) {
        markdown += `#### Speeds, Sizes, Times [optional]\n\n${data.training_details.speeds_sizes_times}\n\n`
      }
    }
  }

  // Evaluation
  if (data.evaluation) {
    markdown += `## Evaluation\n\n`
    if (data.evaluation.testing_data || data.evaluation.testing_factors || data.evaluation.testing_metrics) {
      markdown += `### Testing Data, Factors & Metrics\n\n`
      if (data.evaluation.testing_data) {
        markdown += `#### Testing Data\n\n${data.evaluation.testing_data}\n\n`
      }
      if (data.evaluation.testing_factors) {
        markdown += `#### Factors\n\n${data.evaluation.testing_factors}\n\n`
      }
      if (data.evaluation.testing_metrics) {
        markdown += `#### Metrics\n\n${data.evaluation.testing_metrics}\n\n`
      }
    }
    if (data.evaluation.results) {
      markdown += `### Results\n\n${data.evaluation.results}\n\n`
    }
    if (data.evaluation.results_summary) {
      markdown += `#### Summary\n\n${data.evaluation.results_summary}\n\n`
    }
  }

  // Environmental Impact
  if (data.environmental_impact) {
    markdown += `## Environmental Impact\n\n`
    markdown += `Carbon emissions can be estimated using the [Machine Learning Impact calculator](https://mlco2.github.io/impact#compute) presented in [Lacoste et al. (2019)](https://arxiv.org/abs/1910.09700).\n\n`
    if (data.environmental_impact.hardware_type) markdown += `- **Hardware Type:** ${data.environmental_impact.hardware_type}\n`
    if (data.environmental_impact.hours_used) markdown += `- **Hours used:** ${data.environmental_impact.hours_used}\n`
    if (data.environmental_impact.cloud_provider) markdown += `- **Cloud Provider:** ${data.environmental_impact.cloud_provider}\n`
    if (data.environmental_impact.cloud_region) markdown += `- **Compute Region:** ${data.environmental_impact.cloud_region}\n`
    if (data.environmental_impact.co2_emitted) markdown += `- **Carbon Emitted:** ${data.environmental_impact.co2_emitted}\n`
    markdown += `\n`
  }

  // Technical Specifications
  if (data.technical_specs) {
    markdown += `## Technical Specifications [optional]\n\n`
    if (data.technical_specs.model_specs) {
      markdown += `### Model Architecture and Objective\n\n${data.technical_specs.model_specs}\n\n`
    }
    if (data.technical_specs.compute_infrastructure || data.technical_specs.hardware_requirements || data.technical_specs.software) {
      markdown += `### Compute Infrastructure\n\n`
      if (data.technical_specs.compute_infrastructure) {
        markdown += `${data.technical_specs.compute_infrastructure}\n\n`
      }
      if (data.technical_specs.hardware_requirements) {
        markdown += `#### Hardware\n\n${data.technical_specs.hardware_requirements}\n\n`
      }
      if (data.technical_specs.software) {
        markdown += `#### Software\n\n${data.technical_specs.software}\n\n`
      }
    }
  }

  // Citation
  if (data.citation) {
    markdown += `## Citation [optional]\n\n`
    if (data.citation.citation_bibtex) {
      markdown += `**BibTeX:**\n\n\`\`\`\n${data.citation.citation_bibtex}\n\`\`\`\n\n`
    }
    if (data.citation.citation_apa) {
      markdown += `**APA:**\n\n${data.citation.citation_apa}\n\n`
    }
  }

  // Additional Information
  if (data.additional_info) {
    if (data.additional_info.model_examination) {
      markdown += `## Model Examination [optional]\n\n${data.additional_info.model_examination}\n\n`
    }
    if (data.additional_info.glossary) {
      markdown += `## Glossary [optional]\n\n${data.additional_info.glossary}\n\n`
    }
    if (data.additional_info.more_information) {
      markdown += `## More Information [optional]\n\n${data.additional_info.more_information}\n\n`
    }
    if (data.additional_info.model_card_authors) {
      markdown += `## Model Card Authors [optional]\n\n${data.additional_info.model_card_authors}\n\n`
    }
    if (data.additional_info.model_card_contact) {
      markdown += `## Model Card Contact\n\n${data.additional_info.model_card_contact}\n\n`
    }
  }

  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `README.md`
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
  <title>${data.model_id} - Model Card</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1 { border-bottom: 3px solid #333; padding-bottom: 10px; }
    h2 { color: #444; margin-top: 30px; border-bottom: 2px solid #ddd; padding-bottom: 5px; }
    h3 { color: #666; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>Model Card for ${data.model_id}</h1>
`

  if (data.model_summary) {
    html += `<p>${data.model_summary}</p>`
  }

  if (data.model_description || data.developers) {
    html += `<h2>Model Details</h2>`
    if (data.model_description) {
      html += `<p>${data.model_description}</p>`
    }
    if (data.developers) {
      html += `<p><strong>Developed by:</strong> ${data.developers}</p>`
    }
    if (data.license) {
      html += `<p><strong>License:</strong> ${data.license}</p>`
    }
  }

  if (data.evaluation?.results) {
    html += `<h2>Evaluation</h2><p>${data.evaluation.results}</p>`
  }

  if (data.bias_risks?.bias_risks_limitations) {
    html += `<h2>Bias, Risks, and Limitations</h2><p>${data.bias_risks.bias_risks_limitations}</p>`
  }

  html += `</body></html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${data.model_id.replace(/\s+/g, '-').toLowerCase()}-modelcard.html`
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
  doc.text(`Model Card for ${data.model_id}`, 20, y)
  y += 15

  // Summary
  if (data.model_summary) {
    doc.setFontSize(10)
    const summaryLines = doc.splitTextToSize(data.model_summary, 170)
    doc.text(summaryLines, 20, y)
    y += summaryLines.length * 5 + 10
  }

  // Developers
  if (data.developers) {
    doc.setFontSize(12)
    doc.text(`Developed by: ${data.developers}`, 20, y)
    y += 10
  }

  // Description
  if (data.model_description) {
    doc.setFontSize(14)
    doc.text('Model Details', 20, y)
    y += 7
    doc.setFontSize(10)
    const descLines = doc.splitTextToSize(data.model_description, 170)
    doc.text(descLines, 20, y)
    y += descLines.length * 5 + 10
  }

  doc.save(`${data.model_id.replace(/\s+/g, '-').toLowerCase()}-modelcard.pdf`)
}
