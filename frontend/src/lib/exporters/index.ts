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
 * Export model card as HTML with theme support
 */
export function exportToHTML(data: ModelCard, theme: 'light' | 'dark' | 'auto' = 'auto', initialTheme: 'light' | 'dark' = 'light') {
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

  const renderArray = (arr: string[]) => {
    return arr.map(item => `<li>${escapeHtml(item)}</li>`).join('')
  }

  const renderKeyValue = (obj: Record<string, any>) => {
    return Object.entries(obj)
      .filter(([_, value]) => hasContent(value))
      .map(([key, value]) => {
        const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        return `<div class="key-value"><span class="key">${escapeHtml(displayKey)}:</span> <span class="value">${escapeHtml(String(value))}</span></div>`
      }).join('')
  }

  // Initialize HTML with theme class based on selection
  const initialThemeAttr = theme === 'auto' ? `data-theme="${initialTheme}"` : theme === 'dark' ? 'data-theme="dark"' : 'data-theme="light"'

  let html = `<!DOCTYPE html>
<html lang="en" ${initialThemeAttr}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(data.model_id)} - Model Card</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      /* Light mode colors - Professional Navy Blue + Teal */
      --bg: hsl(215 18% 93%);
      --fg: hsl(215 25% 15%);
      --primary: hsl(215 45% 35%);
      --accent: hsl(185 60% 40%);
      --card: hsl(215 12% 96%);
      --muted: hsl(215 18% 90%);
      --border: hsl(215 15% 85%);
      --code-bg: hsl(215 15% 92%);
    }

    html[data-theme="dark"] {
      /* Dark mode colors */
      --bg: hsl(215 28% 12%);
      --fg: hsl(210 20% 95%);
      --primary: hsl(215 50% 55%);
      --accent: hsl(185 65% 50%);
      --card: hsl(215 25% 15%);
      --muted: hsl(215 20% 25%);
      --border: hsl(215 20% 30%);
      --code-bg: hsl(215 20% 18%);
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
      padding: 1rem;
      transition: background 0.3s ease, color 0.3s ease;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      background: var(--card);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      transition: background 0.3s ease;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid var(--border);
    }

    .header-content {
      flex: 1;
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

    .section {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
    }

    .section:first-of-type {
      margin-top: 0;
      padding-top: 0;
      border-top: none;
    }

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 1rem;
    }

    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--fg);
      margin-top: 1.25rem;
      margin-bottom: 0.75rem;
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

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: var(--accent);
      color: white;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      margin: 0.25rem 0.25rem 0.25rem 0;
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
        padding: 1rem;
      }

      h1 {
        font-size: 1.5rem;
      }

      .summary {
        font-size: 1rem;
      }

      .header {
        flex-direction: column;
        gap: 1rem;
      }

      .grid {
        grid-template-columns: 1fr;
      }
    }

    @media print {
      body {
        background: white;
        color: black;
      }

      .container {
        box-shadow: none;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-content">
        <h1>Model Card for ${escapeHtml(data.model_id)}</h1>
        ${hasContent(data.model_summary) ? `<div class="summary">${renderMarkdown(data.model_summary!)}</div>` : ''}
      </div>
    </div>
`

  // Model Details Section
  if (hasContent(data.model_description) || hasContent(data.developers) || hasContent(data.model_type) ||
      hasContent(data.license) || hasContent(data.language) || hasContent(data.base_model)) {
    html += `    <div class="section">
      <h2>Model Details</h2>
`
    if (hasContent(data.model_description)) {
      html += `      <div class="prose">${renderMarkdown(data.model_description!)}</div>\n`
    }
    if (hasContent(data.developers)) {
      html += `      <div class="key-value"><span class="key">Developers:</span> <span class="value">${escapeHtml(data.developers)}</span></div>\n`
    }
    if (hasContent(data.funded_by)) {
      html += `      <div class="key-value"><span class="key">Funded by:</span> <span class="value">${escapeHtml(data.funded_by!)}</span></div>\n`
    }
    if (hasContent(data.shared_by)) {
      html += `      <div class="key-value"><span class="key">Shared by:</span> <span class="value">${escapeHtml(data.shared_by!)}</span></div>\n`
    }
    if (hasContent(data.model_type)) {
      html += `      <div class="key-value"><span class="key">Model type:</span> <span class="value">${escapeHtml(data.model_type!)}</span></div>\n`
    }
    if (hasContent(data.language)) {
      html += `      <div class="key-value"><span class="key">Language:</span> <span class="value">${escapeHtml(data.language!)}</span></div>\n`
    }
    if (hasContent(data.license)) {
      html += `      <div class="key-value"><span class="key">License:</span> <span class="value">${escapeHtml(data.license!)}</span></div>\n`
    }
    if (hasContent(data.base_model)) {
      html += `      <div class="key-value"><span class="key">Base model:</span> <span class="value">${escapeHtml(data.base_model!)}</span></div>\n`
    }
    html += `    </div>\n`
  }

  // Model Sources Section
  if (hasContent(data.model_sources?.repo) || hasContent(data.model_sources?.paper) || hasContent(data.model_sources?.demo)) {
    html += `    <div class="section">
      <h2>Model Sources</h2>
`
    if (hasContent(data.model_sources?.repo)) {
      html += `      <div class="key-value"><span class="key">Repository:</span> <span class="value"><a href="${escapeHtml(data.model_sources!.repo!)}" target="_blank">${escapeHtml(data.model_sources!.repo!)}</a></span></div>\n`
    }
    if (hasContent(data.model_sources?.paper)) {
      html += `      <div class="key-value"><span class="key">Paper:</span> <span class="value"><a href="${escapeHtml(data.model_sources!.paper!)}" target="_blank">${escapeHtml(data.model_sources!.paper!)}</a></span></div>\n`
    }
    if (hasContent(data.model_sources?.demo)) {
      html += `      <div class="key-value"><span class="key">Demo:</span> <span class="value"><a href="${escapeHtml(data.model_sources!.demo!)}" target="_blank">${escapeHtml(data.model_sources!.demo!)}</a></span></div>\n`
    }
    html += `    </div>\n`
  }

  // Uses Section
  if (hasContent(data.uses?.direct_use) || hasContent(data.uses?.downstream_use) || hasContent(data.uses?.out_of_scope_use)) {
    html += `    <div class="section">
      <h2>Uses</h2>
`
    if (hasContent(data.uses?.direct_use)) {
      html += `      <h3>Direct Use</h3>\n      <div class="prose">${renderMarkdown(data.uses!.direct_use!)}</div>\n`
    }
    if (hasContent(data.uses?.downstream_use)) {
      html += `      <h3>Downstream Use</h3>\n      <div class="prose">${renderMarkdown(data.uses!.downstream_use!)}</div>\n`
    }
    if (hasContent(data.uses?.out_of_scope_use)) {
      html += `      <h3>Out-of-Scope Use</h3>\n      <div class="prose">${renderMarkdown(data.uses!.out_of_scope_use!)}</div>\n`
    }
    html += `    </div>\n`
  }

  // Bias, Risks, and Limitations Section
  if (hasContent(data.bias_risks?.bias_risks_limitations) || hasContent(data.bias_risks?.bias_recommendations)) {
    html += `    <div class="section">
      <h2>Bias, Risks, and Limitations</h2>
`
    if (hasContent(data.bias_risks?.bias_risks_limitations)) {
      html += `      <div class="prose">${renderMarkdown(data.bias_risks!.bias_risks_limitations!)}</div>\n`
    }
    if (hasContent(data.bias_risks?.bias_recommendations)) {
      html += `      <h3>Recommendations</h3>\n      <div class="prose">${renderMarkdown(data.bias_risks!.bias_recommendations!)}</div>\n`
    }
    html += `    </div>\n`
  }

  // Get Started Section
  if (hasContent(data.get_started_code)) {
    html += `    <div class="section">
      <h2>How to Get Started with the Model</h2>
      <pre><code>${escapeHtml(data.get_started_code!)}</code></pre>
    </div>\n`
  }

  // Training Details Section
  if (hasContent(data.training_details?.training_data) || hasContent(data.training_details?.preprocessing) ||
      hasContent(data.training_details?.training_regime) || hasContent(data.training_details?.speeds_sizes_times)) {
    html += `    <div class="section">
      <h2>Training Details</h2>
`
    if (hasContent(data.training_details?.training_data)) {
      html += `      <h3>Training Data</h3>\n      <div class="prose">${renderMarkdown(data.training_details!.training_data!)}</div>\n`
    }
    if (hasContent(data.training_details?.preprocessing)) {
      html += `      <h3>Preprocessing</h3>\n      <div class="prose">${renderMarkdown(data.training_details!.preprocessing!)}</div>\n`
    }
    if (hasContent(data.training_details?.training_regime)) {
      html += `      <h3>Training Regime</h3>\n      <div class="prose">${renderMarkdown(data.training_details!.training_regime!)}</div>\n`
    }
    if (hasContent(data.training_details?.speeds_sizes_times)) {
      html += `      <h3>Speeds, Sizes, Times</h3>\n      <div class="prose">${renderMarkdown(data.training_details!.speeds_sizes_times!)}</div>\n`
    }
    html += `    </div>\n`
  }

  // Evaluation Section
  if (hasContent(data.evaluation?.testing_data) || hasContent(data.evaluation?.testing_factors) ||
      hasContent(data.evaluation?.testing_metrics) || hasContent(data.evaluation?.results) ||
      hasContent(data.evaluation?.results_summary)) {
    html += `    <div class="section">
      <h2>Evaluation</h2>
`
    if (hasContent(data.evaluation?.testing_data)) {
      html += `      <h3>Testing Data</h3>\n      <div class="prose">${renderMarkdown(data.evaluation!.testing_data!)}</div>\n`
    }
    if (hasContent(data.evaluation?.testing_factors)) {
      html += `      <h3>Testing Factors</h3>\n      <div class="prose">${renderMarkdown(data.evaluation!.testing_factors!)}</div>\n`
    }
    if (hasContent(data.evaluation?.testing_metrics)) {
      html += `      <h3>Testing Metrics</h3>\n      <div class="prose">${renderMarkdown(data.evaluation!.testing_metrics!)}</div>\n`
    }
    if (hasContent(data.evaluation?.results)) {
      html += `      <h3>Results</h3>\n      <div class="prose">${renderMarkdown(data.evaluation!.results!)}</div>\n`
    }
    if (hasContent(data.evaluation?.results_summary)) {
      html += `      <h3>Summary</h3>\n      <div class="prose">${renderMarkdown(data.evaluation!.results_summary!)}</div>\n`
    }
    html += `    </div>\n`
  }

  // Environmental Impact Section
  if (hasContent(data.environmental_impact?.hardware_type) || hasContent(data.environmental_impact?.hours_used) ||
      hasContent(data.environmental_impact?.cloud_provider) || hasContent(data.environmental_impact?.cloud_region) ||
      hasContent(data.environmental_impact?.co2_emitted)) {
    html += `    <div class="section">
      <h2>Environmental Impact</h2>
      <div class="grid">
`
    if (hasContent(data.environmental_impact?.hardware_type)) {
      html += `        <div class="grid-item"><div class="grid-item-title">Hardware Type</div><div class="grid-item-value">${escapeHtml(data.environmental_impact!.hardware_type!)}</div></div>\n`
    }
    if (hasContent(data.environmental_impact?.hours_used)) {
      html += `        <div class="grid-item"><div class="grid-item-title">Hours Used</div><div class="grid-item-value">${escapeHtml(data.environmental_impact!.hours_used!)}</div></div>\n`
    }
    if (hasContent(data.environmental_impact?.cloud_provider)) {
      html += `        <div class="grid-item"><div class="grid-item-title">Cloud Provider</div><div class="grid-item-value">${escapeHtml(data.environmental_impact!.cloud_provider!)}</div></div>\n`
    }
    if (hasContent(data.environmental_impact?.cloud_region)) {
      html += `        <div class="grid-item"><div class="grid-item-title">Cloud Region</div><div class="grid-item-value">${escapeHtml(data.environmental_impact!.cloud_region!)}</div></div>\n`
    }
    if (hasContent(data.environmental_impact?.co2_emitted)) {
      html += `        <div class="grid-item"><div class="grid-item-title">CO₂ Emitted</div><div class="grid-item-value">${escapeHtml(data.environmental_impact!.co2_emitted!)}</div></div>\n`
    }
    html += `      </div>
    </div>\n`
  }

  // Technical Specifications Section
  if (hasContent(data.technical_specs?.model_specs) || hasContent(data.technical_specs?.compute_infrastructure) ||
      hasContent(data.technical_specs?.hardware_requirements) || hasContent(data.technical_specs?.software)) {
    html += `    <div class="section">
      <h2>Technical Specifications</h2>
`
    if (hasContent(data.technical_specs?.model_specs)) {
      html += `      <h3>Model Architecture and Objective</h3>\n      <div class="prose">${renderMarkdown(data.technical_specs!.model_specs!)}</div>\n`
    }
    if (hasContent(data.technical_specs?.compute_infrastructure)) {
      html += `      <h3>Compute Infrastructure</h3>\n      <div class="prose">${renderMarkdown(data.technical_specs!.compute_infrastructure!)}</div>\n`
    }
    if (hasContent(data.technical_specs?.hardware_requirements)) {
      html += `      <h3>Hardware Requirements</h3>\n      <div class="prose">${renderMarkdown(data.technical_specs!.hardware_requirements!)}</div>\n`
    }
    if (hasContent(data.technical_specs?.software)) {
      html += `      <h3>Software</h3>\n      <div class="prose">${renderMarkdown(data.technical_specs!.software!)}</div>\n`
    }
    html += `    </div>\n`
  }

  // Citation Section
  if (hasContent(data.citation?.citation_bibtex) || hasContent(data.citation?.citation_apa)) {
    html += `    <div class="section">
      <h2>Citation</h2>
`
    if (hasContent(data.citation?.citation_bibtex)) {
      html += `      <h3>BibTeX</h3>\n      <pre><code>${escapeHtml(data.citation!.citation_bibtex!)}</code></pre>\n`
    }
    if (hasContent(data.citation?.citation_apa)) {
      html += `      <h3>APA</h3>\n      <div class="prose">${renderMarkdown(data.citation!.citation_apa!)}</div>\n`
    }
    html += `    </div>\n`
  }

  // Additional Information Section
  if (hasContent(data.additional_info?.model_examination) || hasContent(data.additional_info?.glossary) ||
      hasContent(data.additional_info?.more_information) || hasContent(data.additional_info?.model_card_authors) ||
      hasContent(data.additional_info?.model_card_contact)) {
    html += `    <div class="section">
      <h2>Additional Information</h2>
`
    if (hasContent(data.additional_info?.model_examination)) {
      html += `      <h3>Model Examination</h3>\n      <div class="prose">${renderMarkdown(data.additional_info!.model_examination!)}</div>\n`
    }
    if (hasContent(data.additional_info?.glossary)) {
      html += `      <h3>Glossary</h3>\n      <div class="prose">${renderMarkdown(data.additional_info!.glossary!)}</div>\n`
    }
    if (hasContent(data.additional_info?.more_information)) {
      html += `      <h3>More Information</h3>\n      <div class="prose">${renderMarkdown(data.additional_info!.more_information!)}</div>\n`
    }
    if (hasContent(data.additional_info?.model_card_authors)) {
      html += `      <div class="key-value"><span class="key">Model Card Authors:</span> <span class="value">${escapeHtml(data.additional_info!.model_card_authors!)}</span></div>\n`
    }
    if (hasContent(data.additional_info?.model_card_contact)) {
      html += `      <div class="key-value"><span class="key">Model Card Contact:</span> <span class="value">${escapeHtml(data.additional_info!.model_card_contact!)}</span></div>\n`
    }
    html += `    </div>\n`
  }

  // Card Data Section (YAML frontmatter metadata)
  if (hasContent(data.card_data)) {
    html += `    <div class="section">
      <h2>Model Card Metadata</h2>
      ${renderKeyValue(data.card_data!)}
    </div>\n`
  }

  html += `  </div>\n`

  // Add auto theme detection JavaScript if theme is auto
  if (theme === 'auto') {
    html += `
  <script>
    function detectParentTheme() {
      // Check parent document for dark mode indicators
      const htmlElement = document.documentElement
      const bodyElement = document.body

      // Check data-theme attribute
      const dataTheme = htmlElement.getAttribute('data-theme')
      if (dataTheme === 'dark') return 'dark'
      if (dataTheme === 'light') return 'light'

      // Check for dark class on html or body
      if (htmlElement.classList.contains('dark') || bodyElement.classList.contains('dark')) {
        return 'dark'
      }

      // Check for light class
      if (htmlElement.classList.contains('light') || bodyElement.classList.contains('light')) {
        return 'light'
      }

      // Fallback to system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }

      return 'light'
    }

    function updateTheme() {
      const detectedTheme = detectParentTheme()
      document.documentElement.setAttribute('data-theme', detectedTheme)
    }

    // Initialize theme on load
    updateTheme()

    // Watch for changes to parent document theme
    const observer = new MutationObserver(() => {
      updateTheme()
    })

    // Observe changes to html and body elements
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    })

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    })

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme)
    }
  </script>
`
  }

  html += `</body>
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
