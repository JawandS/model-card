import { ModelCard } from '@modelcard/schema'
import { jsPDF } from 'jspdf'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

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

  // Generate YAML Frontmatter with HuggingFace metadata
  const yamlFields: Record<string, any> = {}

  // Map all metadata fields from metadata section (HuggingFace YAML format)
  if (data.metadata?.license) yamlFields.license = data.metadata.license
  if (data.metadata?.language) yamlFields.language = data.metadata.language
  if (data.metadata?.base_model) yamlFields.base_model = data.metadata.base_model
  if (data.metadata?.library_name) yamlFields.library_name = data.metadata.library_name
  if (data.metadata?.pipeline_tag) yamlFields.pipeline_tag = data.metadata.pipeline_tag
  if (data.metadata?.tags && data.metadata.tags.length > 0) {
    yamlFields.tags = data.metadata.tags
  }
  if (data.metadata?.inference !== undefined) {
    yamlFields.inference = data.metadata.inference
  }

  // Legacy card_data support (if present)
  if (data.card_data) {
    Object.entries(data.card_data).forEach(([key, value]) => {
      if (!yamlFields[key]) {
        yamlFields[key] = value
      }
    })
  }

  // Generate YAML frontmatter
  if (Object.keys(yamlFields).length > 0) {
    markdown += `---\n`

    // Format YAML fields
    Object.entries(yamlFields).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Format arrays with proper YAML syntax
        markdown += `${key}:\n`
        value.forEach(item => {
          markdown += `  - ${item}\n`
        })
      } else if (typeof value === 'boolean') {
        // Format booleans without quotes
        markdown += `${key}: ${value}\n`
      } else {
        // Format strings and numbers
        markdown += `${key}: ${value}\n`
      }
    })

    markdown += `---\n\n`
  }

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
 * Export model card as HTML with accordion UI (self-contained, no external dependencies)
 */
export function exportToHTML(data: ModelCard) {
  const hasContent = (obj: any) => {
    if (!obj) return false
    if (typeof obj === 'string') return obj.trim().length > 0
    if (Array.isArray(obj)) return obj.length > 0
    if (typeof obj === 'object') return Object.keys(obj).length > 0
    return false
  }

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  // Render markdown safely (parse + sanitize)
  const renderMarkdown = (markdown: string) => {
    const html = marked.parse(markdown, { async: false }) as string
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                     'ul', 'ol', 'li', 'a', 'code', 'pre', 'blockquote', 'hr', 'table',
                     'thead', 'tbody', 'tr', 'th', 'td', 'img', 'del', 'ins', 'sub', 'sup'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class']
    })
  }

  const renderKeyValue = (obj: Record<string, any>) => {
    return Object.entries(obj)
      .filter(([_, value]) => hasContent(value))
      .map(([key, value]) => {
        const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        return `<div class="key-value"><span class="key">${escapeHtml(displayKey)}:</span> <span class="value">${escapeHtml(String(value))}</span></div>`
      }).join('')
  }

  // Build accordion sections (group related content)
  const accordionSections: Array<{ title: string; content: string }> = []

  // Section 1: Overview & Setup
  let section1Content = ''

  // Model Details
  if (hasContent(data.model_description) || hasContent(data.developers) || hasContent(data.model_type) ||
      hasContent(data.license) || hasContent(data.language) || hasContent(data.base_model)) {
    section1Content += `<h3>Model Details</h3>\n`
    if (hasContent(data.model_description)) {
      section1Content += `<div class="prose">${renderMarkdown(data.model_description!)}</div>\n`
    }
    if (hasContent(data.developers)) {
      section1Content += `<div class="key-value"><span class="key">Developers:</span> <span class="value">${escapeHtml(data.developers)}</span></div>\n`
    }
    if (hasContent(data.funded_by)) {
      section1Content += `<div class="key-value"><span class="key">Funded by:</span> <span class="value">${escapeHtml(data.funded_by!)}</span></div>\n`
    }
    if (hasContent(data.shared_by)) {
      section1Content += `<div class="key-value"><span class="key">Shared by:</span> <span class="value">${escapeHtml(data.shared_by!)}</span></div>\n`
    }
    if (hasContent(data.model_type)) {
      section1Content += `<div class="key-value"><span class="key">Model type:</span> <span class="value">${escapeHtml(data.model_type!)}</span></div>\n`
    }
    if (hasContent(data.language)) {
      section1Content += `<div class="key-value"><span class="key">Language:</span> <span class="value">${escapeHtml(data.language!)}</span></div>\n`
    }
    if (hasContent(data.license)) {
      section1Content += `<div class="key-value"><span class="key">License:</span> <span class="value">${escapeHtml(data.license!)}</span></div>\n`
    }
    if (hasContent(data.base_model)) {
      section1Content += `<div class="key-value"><span class="key">Base model:</span> <span class="value">${escapeHtml(data.base_model!)}</span></div>\n`
    }
  }

  // Model Sources
  if (hasContent(data.model_sources?.repo) || hasContent(data.model_sources?.paper) || hasContent(data.model_sources?.demo)) {
    section1Content += `<h3>Model Sources</h3>\n`
    if (hasContent(data.model_sources?.repo)) {
      section1Content += `<div class="key-value"><span class="key">Repository:</span> <span class="value"><a href="${escapeHtml(data.model_sources!.repo!)}" target="_blank">${escapeHtml(data.model_sources!.repo!)}</a></span></div>\n`
    }
    if (hasContent(data.model_sources?.paper)) {
      section1Content += `<div class="key-value"><span class="key">Paper:</span> <span class="value"><a href="${escapeHtml(data.model_sources!.paper!)}" target="_blank">${escapeHtml(data.model_sources!.paper!)}</a></span></div>\n`
    }
    if (hasContent(data.model_sources?.demo)) {
      section1Content += `<div class="key-value"><span class="key">Demo:</span> <span class="value"><a href="${escapeHtml(data.model_sources!.demo!)}" target="_blank">${escapeHtml(data.model_sources!.demo!)}</a></span></div>\n`
    }
  }

  // Get Started
  if (hasContent(data.get_started_code)) {
    section1Content += `<h3>How to Get Started</h3>\n<pre><code>${escapeHtml(data.get_started_code!)}</code></pre>\n`
  }

  if (section1Content) {
    accordionSections.push({ title: 'Overview & Setup', content: section1Content })
  }

  // Section 2: Intended Use & Safety
  let section2Content = ''

  // Uses
  if (hasContent(data.uses?.direct_use) || hasContent(data.uses?.downstream_use) || hasContent(data.uses?.out_of_scope_use)) {
    section2Content += `<h3>Uses</h3>\n`
    if (hasContent(data.uses?.direct_use)) {
      section2Content += `<h4>Direct Use</h4>\n<div class="prose">${renderMarkdown(data.uses!.direct_use!)}</div>\n`
    }
    if (hasContent(data.uses?.downstream_use)) {
      section2Content += `<h4>Downstream Use</h4>\n<div class="prose">${renderMarkdown(data.uses!.downstream_use!)}</div>\n`
    }
    if (hasContent(data.uses?.out_of_scope_use)) {
      section2Content += `<h4>Out-of-Scope Use</h4>\n<div class="prose">${renderMarkdown(data.uses!.out_of_scope_use!)}</div>\n`
    }
  }

  // Bias, Risks, and Limitations
  if (hasContent(data.bias_risks?.bias_risks_limitations) || hasContent(data.bias_risks?.bias_recommendations)) {
    section2Content += `<h3>Bias, Risks, and Limitations</h3>\n`
    if (hasContent(data.bias_risks?.bias_risks_limitations)) {
      section2Content += `<div class="prose">${renderMarkdown(data.bias_risks!.bias_risks_limitations!)}</div>\n`
    }
    if (hasContent(data.bias_risks?.bias_recommendations)) {
      section2Content += `<h4>Recommendations</h4>\n<div class="prose">${renderMarkdown(data.bias_risks!.bias_recommendations!)}</div>\n`
    }
  }

  if (section2Content) {
    accordionSections.push({ title: 'Intended Use & Safety', content: section2Content })
  }

  // Section 3: Training & Evaluation
  let section3Content = ''

  // Training Details
  if (hasContent(data.training_details?.training_data) || hasContent(data.training_details?.preprocessing) ||
      hasContent(data.training_details?.training_regime) || hasContent(data.training_details?.speeds_sizes_times)) {
    section3Content += `<h3>Training Details</h3>\n`
    if (hasContent(data.training_details?.training_data)) {
      section3Content += `<h4>Training Data</h4>\n<div class="prose">${renderMarkdown(data.training_details!.training_data!)}</div>\n`
    }
    if (hasContent(data.training_details?.preprocessing)) {
      section3Content += `<h4>Preprocessing</h4>\n<div class="prose">${renderMarkdown(data.training_details!.preprocessing!)}</div>\n`
    }
    if (hasContent(data.training_details?.training_regime)) {
      section3Content += `<h4>Training Regime</h4>\n<div class="prose">${renderMarkdown(data.training_details!.training_regime!)}</div>\n`
    }
    if (hasContent(data.training_details?.speeds_sizes_times)) {
      section3Content += `<h4>Speeds, Sizes, Times</h4>\n<div class="prose">${renderMarkdown(data.training_details!.speeds_sizes_times!)}</div>\n`
    }
  }

  // Evaluation
  if (hasContent(data.evaluation?.testing_data) || hasContent(data.evaluation?.testing_factors) ||
      hasContent(data.evaluation?.testing_metrics) || hasContent(data.evaluation?.results) ||
      hasContent(data.evaluation?.results_summary)) {
    section3Content += `<h3>Evaluation</h3>\n`
    if (hasContent(data.evaluation?.testing_data)) {
      section3Content += `<h4>Testing Data</h4>\n<div class="prose">${renderMarkdown(data.evaluation!.testing_data!)}</div>\n`
    }
    if (hasContent(data.evaluation?.testing_factors)) {
      section3Content += `<h4>Testing Factors</h4>\n<div class="prose">${renderMarkdown(data.evaluation!.testing_factors!)}</div>\n`
    }
    if (hasContent(data.evaluation?.testing_metrics)) {
      section3Content += `<h4>Testing Metrics</h4>\n<div class="prose">${renderMarkdown(data.evaluation!.testing_metrics!)}</div>\n`
    }
    if (hasContent(data.evaluation?.results)) {
      section3Content += `<h4>Results</h4>\n<div class="prose">${renderMarkdown(data.evaluation!.results!)}</div>\n`
    }
    if (hasContent(data.evaluation?.results_summary)) {
      section3Content += `<h4>Summary</h4>\n<div class="prose">${renderMarkdown(data.evaluation!.results_summary!)}</div>\n`
    }
  }

  if (section3Content) {
    accordionSections.push({ title: 'Training & Evaluation', content: section3Content })
  }

  // Section 4: Impact & Specifications
  let section4Content = ''

  // Environmental Impact
  if (hasContent(data.environmental_impact?.hardware_type) || hasContent(data.environmental_impact?.hours_used) ||
      hasContent(data.environmental_impact?.cloud_provider) || hasContent(data.environmental_impact?.cloud_region) ||
      hasContent(data.environmental_impact?.co2_emitted)) {
    section4Content += `<h3>Environmental Impact</h3>\n<div class="grid">\n`
    if (hasContent(data.environmental_impact?.hardware_type)) {
      section4Content += `<div class="grid-item"><div class="grid-item-title">Hardware Type</div><div class="grid-item-value">${escapeHtml(data.environmental_impact!.hardware_type!)}</div></div>\n`
    }
    if (hasContent(data.environmental_impact?.hours_used)) {
      section4Content += `<div class="grid-item"><div class="grid-item-title">Hours Used</div><div class="grid-item-value">${escapeHtml(data.environmental_impact!.hours_used!)}</div></div>\n`
    }
    if (hasContent(data.environmental_impact?.cloud_provider)) {
      section4Content += `<div class="grid-item"><div class="grid-item-title">Cloud Provider</div><div class="grid-item-value">${escapeHtml(data.environmental_impact!.cloud_provider!)}</div></div>\n`
    }
    if (hasContent(data.environmental_impact?.cloud_region)) {
      section4Content += `<div class="grid-item"><div class="grid-item-title">Cloud Region</div><div class="grid-item-value">${escapeHtml(data.environmental_impact!.cloud_region!)}</div></div>\n`
    }
    if (hasContent(data.environmental_impact?.co2_emitted)) {
      section4Content += `<div class="grid-item"><div class="grid-item-title">CO₂ Emitted</div><div class="grid-item-value">${escapeHtml(data.environmental_impact!.co2_emitted!)}</div></div>\n`
    }
    section4Content += `</div>\n`
  }

  // Technical Specifications
  if (hasContent(data.technical_specs?.model_specs) || hasContent(data.technical_specs?.compute_infrastructure) ||
      hasContent(data.technical_specs?.hardware_requirements) || hasContent(data.technical_specs?.software)) {
    section4Content += `<h3>Technical Specifications</h3>\n`
    if (hasContent(data.technical_specs?.model_specs)) {
      section4Content += `<h4>Model Architecture and Objective</h4>\n<div class="prose">${renderMarkdown(data.technical_specs!.model_specs!)}</div>\n`
    }
    if (hasContent(data.technical_specs?.compute_infrastructure)) {
      section4Content += `<h4>Compute Infrastructure</h4>\n<div class="prose">${renderMarkdown(data.technical_specs!.compute_infrastructure!)}</div>\n`
    }
    if (hasContent(data.technical_specs?.hardware_requirements)) {
      section4Content += `<h4>Hardware Requirements</h4>\n<div class="prose">${renderMarkdown(data.technical_specs!.hardware_requirements!)}</div>\n`
    }
    if (hasContent(data.technical_specs?.software)) {
      section4Content += `<h4>Software</h4>\n<div class="prose">${renderMarkdown(data.technical_specs!.software!)}</div>\n`
    }
  }

  if (section4Content) {
    accordionSections.push({ title: 'Impact & Specifications', content: section4Content })
  }

  // Section 5: Citation & Additional Information
  let section5Content = ''

  // Citation
  if (hasContent(data.citation?.citation_bibtex) || hasContent(data.citation?.citation_apa)) {
    section5Content += `<h3>Citation</h3>\n`
    if (hasContent(data.citation?.citation_bibtex)) {
      section5Content += `<h4>BibTeX</h4>\n<pre><code>${escapeHtml(data.citation!.citation_bibtex!)}</code></pre>\n`
    }
    if (hasContent(data.citation?.citation_apa)) {
      section5Content += `<h4>APA</h4>\n<div class="prose">${renderMarkdown(data.citation!.citation_apa!)}</div>\n`
    }
  }

  // Additional Information
  if (hasContent(data.additional_info?.model_examination) || hasContent(data.additional_info?.glossary) ||
      hasContent(data.additional_info?.more_information) || hasContent(data.additional_info?.model_card_authors) ||
      hasContent(data.additional_info?.model_card_contact)) {
    section5Content += `<h3>Additional Information</h3>\n`
    if (hasContent(data.additional_info?.model_examination)) {
      section5Content += `<h4>Model Examination</h4>\n<div class="prose">${renderMarkdown(data.additional_info!.model_examination!)}</div>\n`
    }
    if (hasContent(data.additional_info?.glossary)) {
      section5Content += `<h4>Glossary</h4>\n<div class="prose">${renderMarkdown(data.additional_info!.glossary!)}</div>\n`
    }
    if (hasContent(data.additional_info?.more_information)) {
      section5Content += `<h4>More Information</h4>\n<div class="prose">${renderMarkdown(data.additional_info!.more_information!)}</div>\n`
    }
    if (hasContent(data.additional_info?.model_card_authors)) {
      section5Content += `<div class="key-value"><span class="key">Model Card Authors:</span> <span class="value">${escapeHtml(data.additional_info!.model_card_authors!)}</span></div>\n`
    }
    if (hasContent(data.additional_info?.model_card_contact)) {
      section5Content += `<div class="key-value"><span class="key">Model Card Contact:</span> <span class="value">${escapeHtml(data.additional_info!.model_card_contact!)}</span></div>\n`
    }
  }

  // Card Data Metadata
  if (hasContent(data.card_data)) {
    section5Content += `<h3>Model Card Metadata</h3>\n${renderKeyValue(data.card_data!)}\n`
  }

  if (section5Content) {
    accordionSections.push({ title: 'Citation & Additional Information', content: section5Content })
  }

  // Build HTML with accordion UI
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(data.model_id)} - Model Card</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #f5f7fa;
      --fg: #1a202c;
      --primary: #2c5282;
      --accent: #2c7a7b;
      --card: #ffffff;
      --muted: #e2e8f0;
      --border: #cbd5e0;
      --code-bg: #edf2f7;
      --hover: #f7fafc;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--bg);
      color: var(--fg);
      line-height: 1.6;
      padding: 1.5rem;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      background: var(--card);
      border-radius: 0.75rem;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .header {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid var(--border);
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }

    .summary {
      font-size: 1.125rem;
      color: var(--fg);
      opacity: 0.9;
      margin-top: 0.5rem;
    }

    .controls {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.5rem 1rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .btn:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .btn:active {
      transform: translateY(0);
    }

    .accordion {
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      overflow: hidden;
    }

    .accordion-item {
      border-bottom: 1px solid var(--border);
    }

    .accordion-item:last-child {
      border-bottom: none;
    }

    .accordion-trigger {
      width: 100%;
      padding: 1rem 1.25rem;
      background: var(--card);
      border: none;
      text-align: left;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--primary);
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background 0.2s ease;
      font-family: inherit;
    }

    .accordion-trigger:hover {
      background: var(--hover);
    }

    .accordion-trigger[aria-expanded="true"] {
      background: var(--muted);
    }

    .chevron {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
      flex-shrink: 0;
    }

    .accordion-trigger[aria-expanded="true"] .chevron {
      transform: rotate(180deg);
    }

    .accordion-content {
      overflow: hidden;
      transition: max-height 0.3s ease, padding 0.3s ease;
      max-height: 0;
      padding: 0 1.25rem;
    }

    .accordion-content[data-state="open"] {
      max-height: 10000px;
      padding: 1.25rem;
    }

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--primary);
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }

    h3:first-child {
      margin-top: 0;
    }

    h4 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--fg);
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }

    p {
      margin: 0.75rem 0;
      color: var(--fg);
      opacity: 0.95;
    }

    ul, ol {
      margin: 0.75rem 0;
      padding-left: 1.5rem;
    }

    li {
      margin: 0.5rem 0;
      color: var(--fg);
      opacity: 0.95;
    }

    .key-value {
      display: flex;
      gap: 0.5rem;
      margin: 0.5rem 0;
      padding: 0.5rem;
      background: var(--muted);
      border-radius: 0.375rem;
      font-size: 0.875rem;
    }

    .key {
      font-weight: 600;
      color: var(--primary);
      min-width: 120px;
    }

    .value {
      color: var(--fg);
      flex: 1;
    }

    .prose {
      color: var(--fg);
    }

    .prose > *:first-child {
      margin-top: 0;
    }

    .prose > *:last-child {
      margin-bottom: 0;
    }

    .prose p {
      margin: 0.75rem 0;
    }

    .prose ul, .prose ol {
      margin: 0.75rem 0;
      padding-left: 1.5rem;
    }

    .prose li {
      margin: 0.25rem 0;
    }

    .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
      color: var(--primary);
    }

    .prose h1 { font-size: 1.5rem; }
    .prose h2 { font-size: 1.25rem; }
    .prose h3 { font-size: 1.125rem; }
    .prose h4 { font-size: 1rem; }

    .prose blockquote {
      margin: 1rem 0;
      padding-left: 1rem;
      border-left: 3px solid var(--accent);
      font-style: italic;
      opacity: 0.9;
    }

    .prose table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }

    .prose th, .prose td {
      border: 1px solid var(--border);
      padding: 0.5rem;
      text-align: left;
    }

    .prose th {
      background: var(--muted);
      font-weight: 600;
    }

    .prose hr {
      border: none;
      border-top: 1px solid var(--border);
      margin: 1.5rem 0;
    }

    .prose img {
      max-width: 100%;
      height: auto;
      border-radius: 0.5rem;
      margin: 1rem 0;
    }

    code {
      background: var(--code-bg);
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
      font-size: 0.875em;
      color: var(--accent);
    }

    pre {
      background: var(--code-bg);
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin: 1rem 0;
      border: 1px solid var(--border);
    }

    pre code {
      background: none;
      padding: 0;
      color: var(--fg);
    }

    a {
      color: var(--accent);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s ease;
    }

    a:hover {
      border-bottom-color: var(--accent);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }

    .grid-item {
      background: var(--muted);
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border);
    }

    .grid-item-title {
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .grid-item-value {
      color: var(--fg);
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      body {
        padding: 0.5rem;
      }

      .container {
        padding: 1.25rem;
      }

      h1 {
        font-size: 1.5rem;
      }

      .summary {
        font-size: 1rem;
      }

      .grid {
        grid-template-columns: 1fr;
      }

      .accordion-trigger {
        font-size: 1rem;
        padding: 0.875rem 1rem;
      }
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }

      .container {
        box-shadow: none;
        padding: 0;
      }

      .controls {
        display: none;
      }

      .accordion-content {
        max-height: none !important;
        padding: 1rem 0 !important;
      }

      .accordion-trigger {
        pointer-events: none;
      }

      .chevron {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Model Card for ${escapeHtml(data.model_id)}</h1>
      ${hasContent(data.model_summary) ? `<div class="summary">${renderMarkdown(data.model_summary!)}</div>` : ''}
    </div>

    <div class="controls">
      <button class="btn" id="expandAll">Expand All</button>
      <button class="btn" id="collapseAll">Collapse All</button>
    </div>

    <div class="accordion">
`

  // Render accordion items
  accordionSections.forEach((section, index) => {
    const isOpen = index === 0 // First section open by default
    html += `      <div class="accordion-item">
        <button
          class="accordion-trigger"
          aria-expanded="${isOpen}"
          data-index="${index}"
        >
          <span>${escapeHtml(section.title)}</span>
          <svg class="chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="accordion-content" data-state="${isOpen ? 'open' : 'closed'}">
          ${section.content}
        </div>
      </div>
`
  })

  html += `    </div>
  </div>

  <script>
    // Accordion functionality
    const triggers = document.querySelectorAll('.accordion-trigger')
    const expandAllBtn = document.getElementById('expandAll')
    const collapseAllBtn = document.getElementById('collapseAll')

    function toggleAccordion(trigger) {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true'
      const content = trigger.nextElementSibling

      trigger.setAttribute('aria-expanded', !isExpanded)
      content.setAttribute('data-state', isExpanded ? 'closed' : 'open')
    }

    function expandAll() {
      triggers.forEach(trigger => {
        trigger.setAttribute('aria-expanded', 'true')
        trigger.nextElementSibling.setAttribute('data-state', 'open')
      })
    }

    function collapseAll() {
      triggers.forEach(trigger => {
        trigger.setAttribute('aria-expanded', 'false')
        trigger.nextElementSibling.setAttribute('data-state', 'closed')
      })
    }

    // Event listeners
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => toggleAccordion(trigger))
    })

    expandAllBtn.addEventListener('click', expandAll)
    collapseAllBtn.addEventListener('click', collapseAll)

    // Keyboard accessibility
    triggers.forEach((trigger, index) => {
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggleAccordion(trigger)
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          const nextTrigger = triggers[index + 1]
          if (nextTrigger) nextTrigger.focus()
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          const prevTrigger = triggers[index - 1]
          if (prevTrigger) prevTrigger.focus()
        }
      })
    })
  </script>
</body>
</html>`

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
  const pageHeight = doc.internal.pageSize.height
  const margin = 20
  const maxWidth = 170

  // Helper to convert markdown to plain text
  const markdownToPlainText = (markdown: string): string => {
    return markdown
      // Remove bold/italic markers but keep the text
      .replace(/\*\*\*(.+?)\*\*\*/g, '$1')  // Bold italic
      .replace(/\*\*(.+?)\*\*/g, '$1')      // Bold
      .replace(/\*(.+?)\*/g, '$1')          // Italic
      .replace(/__(.+?)__/g, '$1')          // Bold
      .replace(/_(.+?)_/g, '$1')            // Italic
      // Convert links to just the text
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      // Convert headings to just text
      .replace(/^#{1,6}\s+(.+)$/gm, '$1')
      // Convert bullet points
      .replace(/^\s*[-*+]\s+(.+)$/gm, '• $1')
      // Convert numbered lists
      .replace(/^\s*\d+\.\s+(.+)$/gm, '$1')
      // Remove code blocks markers
      .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, ''))
      .replace(/`(.+?)`/g, '$1')
      // Remove horizontal rules
      .replace(/^[-*_]{3,}$/gm, '')
      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  // Check if we need a new page
  const checkPageBreak = (requiredSpace: number) => {
    if (y + requiredSpace > pageHeight - margin) {
      doc.addPage()
      y = margin
    }
  }

  // Helper to add a section
  const addSection = (title: string, content: string | undefined) => {
    if (!content || !content.trim()) return

    checkPageBreak(20)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(title, margin, y)
    y += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const plainText = markdownToPlainText(content)
    const lines = doc.splitTextToSize(plainText, maxWidth)

    lines.forEach((line: string) => {
      checkPageBreak(7)
      doc.text(line, margin, y)
      y += 5
    })
    y += 5
  }

  // Title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(`Model Card for ${data.model_id}`, margin, y)
  y += 15

  // Summary
  if (data.model_summary) {
    doc.setFontSize(11)
    doc.setFont('helvetica', 'italic')
    const summaryText = markdownToPlainText(data.model_summary)
    const summaryLines = doc.splitTextToSize(summaryText, maxWidth)
    doc.text(summaryLines, margin, y)
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
    doc.text(`Developers: ${data.developers}`, margin, y)
    y += 6
  }
  if (data.license) {
    checkPageBreak(6)
    doc.text(`License: ${data.license}`, margin, y)
    y += 6
  }
  if (data.model_type) {
    checkPageBreak(6)
    doc.text(`Model Type: ${data.model_type}`, margin, y)
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

  doc.save(`${data.model_id.replace(/\s+/g, '-').toLowerCase()}-modelcard.pdf`)
}
