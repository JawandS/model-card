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
 * Export model card as HTML with theme support
 */
export function exportToHTML(data: ModelCard, theme: 'light' | 'dark' | 'auto' = 'auto') {
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
  const initialTheme = theme === 'auto' ? 'data-theme="light"' : theme === 'dark' ? 'data-theme="dark"' : 'data-theme="light"'

  let html = `<!DOCTYPE html>
<html lang="en" ${initialTheme}>
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

    ${theme === 'auto' ? `
    .theme-toggle {
      background: var(--muted);
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      padding: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--fg);
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .theme-toggle:hover {
      background: var(--border);
      transform: scale(1.05);
    }

    .theme-icon {
      width: 1.25rem;
      height: 1.25rem;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    ` : ''}

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

      .theme-toggle {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-content">
        <h1>Model Card for ${escapeHtml(data.model_id)}</h1>
        ${hasContent(data.model_summary) ? `<div class="summary">${escapeHtml(data.model_summary)}</div>` : ''}
      </div>
      ${theme === 'auto' ? `
      <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
        <svg class="theme-icon" id="theme-icon-light" style="display: none;">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg class="theme-icon" id="theme-icon-dark" style="display: none;">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <span id="theme-text">Theme</span>
      </button>
      ` : ''}
    </div>
`

  // Model Details Section
  if (hasContent(data.model_description) || hasContent(data.developers) || hasContent(data.model_type) ||
      hasContent(data.license) || hasContent(data.model_languages) || hasContent(data.base_model)) {
    html += `    <div class="section">
      <h2>Model Details</h2>
`
    if (hasContent(data.model_description)) {
      html += `      <p>${escapeHtml(data.model_description)}</p>\n`
    }
    if (hasContent(data.developers)) {
      html += `      <div class="key-value"><span class="key">Developers:</span> <span class="value">${escapeHtml(data.developers)}</span></div>\n`
    }
    if (hasContent(data.funded_by)) {
      html += `      <div class="key-value"><span class="key">Funded by:</span> <span class="value">${escapeHtml(data.funded_by)}</span></div>\n`
    }
    if (hasContent(data.shared_by)) {
      html += `      <div class="key-value"><span class="key">Shared by:</span> <span class="value">${escapeHtml(data.shared_by)}</span></div>\n`
    }
    if (hasContent(data.model_type)) {
      html += `      <div class="key-value"><span class="key">Model type:</span> <span class="value">${escapeHtml(data.model_type)}</span></div>\n`
    }
    if (hasContent(data.model_languages) && Array.isArray(data.model_languages)) {
      html += `      <div class="key-value"><span class="key">Languages:</span> <span class="value">${data.model_languages.map(escapeHtml).join(', ')}</span></div>\n`
    }
    if (hasContent(data.license)) {
      html += `      <div class="key-value"><span class="key">License:</span> <span class="value">${escapeHtml(data.license)}</span></div>\n`
    }
    if (hasContent(data.base_model)) {
      html += `      <div class="key-value"><span class="key">Base model:</span> <span class="value">${escapeHtml(data.base_model)}</span></div>\n`
    }
    if (hasContent(data.model_function)) {
      html += `      <div class="key-value"><span class="key">Model function:</span> <span class="value">${escapeHtml(data.model_function)}</span></div>\n`
    }
    if (hasContent(data.feedback)) {
      html += `      <div class="key-value"><span class="key">Feedback:</span> <span class="value">${escapeHtml(data.feedback)}</span></div>\n`
    }
    html += `    </div>\n`
  }

  // Model Sources Section
  if (hasContent(data.model_sources?.repository) || hasContent(data.model_sources?.paper) || hasContent(data.model_sources?.demo)) {
    html += `    <div class="section">
      <h2>Model Sources</h2>
`
    if (hasContent(data.model_sources?.repository)) {
      html += `      <div class="key-value"><span class="key">Repository:</span> <span class="value"><a href="${escapeHtml(data.model_sources.repository)}" target="_blank">${escapeHtml(data.model_sources.repository)}</a></span></div>\n`
    }
    if (hasContent(data.model_sources?.paper)) {
      html += `      <div class="key-value"><span class="key">Paper:</span> <span class="value"><a href="${escapeHtml(data.model_sources.paper)}" target="_blank">${escapeHtml(data.model_sources.paper)}</a></span></div>\n`
    }
    if (hasContent(data.model_sources?.demo)) {
      html += `      <div class="key-value"><span class="key">Demo:</span> <span class="value"><a href="${escapeHtml(data.model_sources.demo)}" target="_blank">${escapeHtml(data.model_sources.demo)}</a></span></div>\n`
    }
    html += `    </div>\n`
  }

  // Uses Section
  if (hasContent(data.uses?.direct_use) || hasContent(data.uses?.downstream_use) || hasContent(data.uses?.out_of_scope_use)) {
    html += `    <div class="section">
      <h2>Uses</h2>
`
    if (hasContent(data.uses?.direct_use)) {
      html += `      <h3>Direct Use</h3>\n      <p>${escapeHtml(data.uses.direct_use)}</p>\n`
    }
    if (hasContent(data.uses?.downstream_use)) {
      html += `      <h3>Downstream Use</h3>\n      <p>${escapeHtml(data.uses.downstream_use)}</p>\n`
    }
    if (hasContent(data.uses?.out_of_scope_use)) {
      html += `      <h3>Out-of-Scope Use</h3>\n      <p>${escapeHtml(data.uses.out_of_scope_use)}</p>\n`
    }
    html += `    </div>\n`
  }

  // Bias, Risks, and Limitations Section
  if (hasContent(data.bias_risks?.bias_risks_limitations) || hasContent(data.bias_risks?.bias_recommendations)) {
    html += `    <div class="section">
      <h2>Bias, Risks, and Limitations</h2>
`
    if (hasContent(data.bias_risks?.bias_risks_limitations)) {
      html += `      <p>${escapeHtml(data.bias_risks.bias_risks_limitations)}</p>\n`
    }
    if (hasContent(data.bias_risks?.bias_recommendations)) {
      html += `      <h3>Recommendations</h3>\n      <p>${escapeHtml(data.bias_risks.bias_recommendations)}</p>\n`
    }
    html += `    </div>\n`
  }

  // Get Started Section
  if (hasContent(data.get_started_code)) {
    html += `    <div class="section">
      <h2>How to Get Started with the Model</h2>
      <pre><code>${escapeHtml(data.get_started_code)}</code></pre>
    </div>\n`
  }

  // Training Details Section
  if (hasContent(data.training?.training_data) || hasContent(data.training?.preprocessing) ||
      hasContent(data.training?.training_regime) || hasContent(data.training?.speeds_sizes_times)) {
    html += `    <div class="section">
      <h2>Training Details</h2>
`
    if (hasContent(data.training?.training_data)) {
      html += `      <h3>Training Data</h3>\n      <p>${escapeHtml(data.training.training_data)}</p>\n`
    }
    if (hasContent(data.training?.preprocessing)) {
      html += `      <h3>Preprocessing</h3>\n      <p>${escapeHtml(data.training.preprocessing)}</p>\n`
    }
    if (hasContent(data.training?.training_regime)) {
      html += `      <h3>Training Regime</h3>\n      <p>${escapeHtml(data.training.training_regime)}</p>\n`
    }
    if (hasContent(data.training?.speeds_sizes_times)) {
      html += `      <h3>Speeds, Sizes, Times</h3>\n      <p>${escapeHtml(data.training.speeds_sizes_times)}</p>\n`
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
      html += `      <h3>Testing Data</h3>\n      <p>${escapeHtml(data.evaluation.testing_data)}</p>\n`
    }
    if (hasContent(data.evaluation?.testing_factors)) {
      html += `      <h3>Testing Factors</h3>\n      <p>${escapeHtml(data.evaluation.testing_factors)}</p>\n`
    }
    if (hasContent(data.evaluation?.testing_metrics)) {
      html += `      <h3>Testing Metrics</h3>\n      <p>${escapeHtml(data.evaluation.testing_metrics)}</p>\n`
    }
    if (hasContent(data.evaluation?.results)) {
      html += `      <h3>Results</h3>\n      <p>${escapeHtml(data.evaluation.results)}</p>\n`
    }
    if (hasContent(data.evaluation?.results_summary)) {
      html += `      <h3>Summary</h3>\n      <p>${escapeHtml(data.evaluation.results_summary)}</p>\n`
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
      html += `        <div class="grid-item"><div class="grid-item-title">Hardware Type</div><div class="grid-item-value">${escapeHtml(data.environmental_impact.hardware_type)}</div></div>\n`
    }
    if (hasContent(data.environmental_impact?.hours_used)) {
      html += `        <div class="grid-item"><div class="grid-item-title">Hours Used</div><div class="grid-item-value">${escapeHtml(data.environmental_impact.hours_used)}</div></div>\n`
    }
    if (hasContent(data.environmental_impact?.cloud_provider)) {
      html += `        <div class="grid-item"><div class="grid-item-title">Cloud Provider</div><div class="grid-item-value">${escapeHtml(data.environmental_impact.cloud_provider)}</div></div>\n`
    }
    if (hasContent(data.environmental_impact?.cloud_region)) {
      html += `        <div class="grid-item"><div class="grid-item-title">Cloud Region</div><div class="grid-item-value">${escapeHtml(data.environmental_impact.cloud_region)}</div></div>\n`
    }
    if (hasContent(data.environmental_impact?.co2_emitted)) {
      html += `        <div class="grid-item"><div class="grid-item-title">CO₂ Emitted</div><div class="grid-item-value">${escapeHtml(data.environmental_impact.co2_emitted)}</div></div>\n`
    }
    html += `      </div>
    </div>\n`
  }

  // Technical Specifications Section
  if (hasContent(data.technical_specs?.model_specs) || hasContent(data.technical_specs?.compute_infrastructure) ||
      hasContent(data.technical_specs?.hardware) || hasContent(data.technical_specs?.software)) {
    html += `    <div class="section">
      <h2>Technical Specifications</h2>
`
    if (hasContent(data.technical_specs?.model_specs)) {
      html += `      <h3>Model Architecture and Objective</h3>\n      <p>${escapeHtml(data.technical_specs.model_specs)}</p>\n`
    }
    if (hasContent(data.technical_specs?.compute_infrastructure)) {
      html += `      <h3>Compute Infrastructure</h3>\n      <p>${escapeHtml(data.technical_specs.compute_infrastructure)}</p>\n`
    }
    if (hasContent(data.technical_specs?.hardware)) {
      html += `      <h3>Hardware</h3>\n      <p>${escapeHtml(data.technical_specs.hardware)}</p>\n`
    }
    if (hasContent(data.technical_specs?.software)) {
      html += `      <h3>Software</h3>\n      <p>${escapeHtml(data.technical_specs.software)}</p>\n`
    }
    html += `    </div>\n`
  }

  // Citation Section
  if (hasContent(data.citation?.citation_bibtex) || hasContent(data.citation?.citation_apa)) {
    html += `    <div class="section">
      <h2>Citation</h2>
`
    if (hasContent(data.citation?.citation_bibtex)) {
      html += `      <h3>BibTeX</h3>\n      <pre><code>${escapeHtml(data.citation.citation_bibtex)}</code></pre>\n`
    }
    if (hasContent(data.citation?.citation_apa)) {
      html += `      <h3>APA</h3>\n      <p>${escapeHtml(data.citation.citation_apa)}</p>\n`
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
      html += `      <h3>Model Examination</h3>\n      <p>${escapeHtml(data.additional_info.model_examination)}</p>\n`
    }
    if (hasContent(data.additional_info?.glossary)) {
      html += `      <h3>Glossary</h3>\n      <p>${escapeHtml(data.additional_info.glossary)}</p>\n`
    }
    if (hasContent(data.additional_info?.more_information)) {
      html += `      <h3>More Information</h3>\n      <p>${escapeHtml(data.additional_info.more_information)}</p>\n`
    }
    if (hasContent(data.additional_info?.model_card_authors)) {
      html += `      <div class="key-value"><span class="key">Model Card Authors:</span> <span class="value">${escapeHtml(data.additional_info.model_card_authors)}</span></div>\n`
    }
    if (hasContent(data.additional_info?.model_card_contact)) {
      html += `      <div class="key-value"><span class="key">Model Card Contact:</span> <span class="value">${escapeHtml(data.additional_info.model_card_contact)}</span></div>\n`
    }
    html += `    </div>\n`
  }

  // Card Data Section (YAML frontmatter metadata)
  if (hasContent(data.card_data)) {
    html += `    <div class="section">
      <h2>Model Card Metadata</h2>
      ${renderKeyValue(data.card_data)}
    </div>\n`
  }

  html += `  </div>\n`

  // Add theme toggle JavaScript if theme is auto
  if (theme === 'auto') {
    html += `
  <script>
    function updateThemeIcon() {
      const currentTheme = document.documentElement.getAttribute('data-theme')
      const lightIcon = document.getElementById('theme-icon-light')
      const darkIcon = document.getElementById('theme-icon-dark')
      const themeText = document.getElementById('theme-text')

      if (currentTheme === 'dark') {
        lightIcon.style.display = 'block'
        darkIcon.style.display = 'none'
        themeText.textContent = 'Light'
      } else {
        lightIcon.style.display = 'none'
        darkIcon.style.display = 'block'
        themeText.textContent = 'Dark'
      }
    }

    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme')
      const newTheme = currentTheme === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', newTheme)
      localStorage.setItem('modelcard-theme', newTheme)
      updateThemeIcon()
    }

    // Initialize theme from localStorage or default to light
    const savedTheme = localStorage.getItem('modelcard-theme') || 'light'
    document.documentElement.setAttribute('data-theme', savedTheme)
    updateThemeIcon()
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
