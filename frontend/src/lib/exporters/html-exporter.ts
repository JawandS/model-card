import type { ModelCard } from '@modelcard/schema'
import { BaseExporter } from './base'
import type { ExportOptions } from './types'
import { hasContent, escapeHtml, renderMarkdown, renderKeyValue } from './utils'

/**
 * HTML exporter
 * Exports model card as self-contained HTML with accordion UI
 */
export class HtmlExporter extends BaseExporter {
  readonly format = 'html' as const
  readonly fileExtension = 'html'
  readonly mimeType = 'text/html'

  protected generate(data: ModelCard, options: ExportOptions): Blob {
    const html = this.buildHtml(data)
    return new Blob([html], { type: this.mimeType })
  }

  private buildHtml(data: ModelCard): string {
    const accordionSections = this.buildAccordionSections(data)

    let html = this.buildHtmlHeader(data)
    html += this.buildHtmlBody(data, accordionSections)
    html += this.buildHtmlScript()
    html += `</body>\n</html>`

    return html
  }

  private buildAccordionSections(data: ModelCard): Array<{ title: string; content: string }> {
    const sections: Array<{ title: string; content: string }> = []

    // Section 1: Overview & Setup
    const section1 = this.buildOverviewSection(data)
    if (section1) sections.push({ title: 'Overview & Setup', content: section1 })

    // Section 2: Intended Use & Safety
    const section2 = this.buildUsesAndSafetySection(data)
    if (section2) sections.push({ title: 'Intended Use & Safety', content: section2 })

    // Section 3: Training & Evaluation
    const section3 = this.buildTrainingAndEvaluationSection(data)
    if (section3) sections.push({ title: 'Training & Evaluation', content: section3 })

    // Section 4: Impact & Specifications
    const section4 = this.buildImpactAndSpecsSection(data)
    if (section4) sections.push({ title: 'Impact & Specifications', content: section4 })

    // Section 5: Citation & Additional Information
    const section5 = this.buildCitationAndAdditionalInfoSection(data)
    if (section5) sections.push({ title: 'Citation & Additional Information', content: section5 })

    return sections
  }

  private buildOverviewSection(data: ModelCard): string {
    let content = ''
    const listToDisplay = (value?: string | string[]): string => {
      if (!value) return ''
      if (Array.isArray(value)) return value.join(', ')
      const parts = value.split(',').map(v => v.trim()).filter(Boolean)
      return parts.join(', ')
    }

    // Model Details
    if (hasContent(data.model_description) || hasContent(data.developers) || hasContent(data.model_type) ||
        hasContent(data.license) || hasContent(data.language) || hasContent(data.base_model)) {
      content += `<h3>Model Details</h3>\n`
      if (hasContent(data.model_description)) {
        content += `<div class="prose">${renderMarkdown(data.model_description!)}</div>\n`
      }
      if (hasContent(data.developers)) {
        content += `<div class="key-value"><span class="key">Developers:</span> <span class="value">${escapeHtml(data.developers)}</span></div>\n`
      }
      if (hasContent(data.funded_by)) {
        content += `<div class="key-value"><span class="key">Funded by:</span> <span class="value">${escapeHtml(data.funded_by!)}</span></div>\n`
      }
      if (hasContent(data.shared_by)) {
        content += `<div class="key-value"><span class="key">Shared by:</span> <span class="value">${escapeHtml(data.shared_by!)}</span></div>\n`
      }
      if (hasContent(data.model_type)) {
        content += `<div class="key-value"><span class="key">Model type:</span> <span class="value">${escapeHtml(data.model_type!)}</span></div>\n`
      }
      if (hasContent(data.language)) {
        content += `<div class="key-value"><span class="key">Language:</span> <span class="value">${escapeHtml(data.language!)}</span></div>\n`
      }
      if (hasContent(data.license)) {
        content += `<div class="key-value"><span class="key">License:</span> <span class="value">${escapeHtml(data.license!)}</span></div>\n`
      }
      if (hasContent(data.base_model)) {
        content += `<div class="key-value"><span class="key">Base model:</span> <span class="value">${escapeHtml(data.base_model!)}</span></div>\n`
      }
    }

    // Model Sources
    if (hasContent(data.model_sources?.repo) || hasContent(data.model_sources?.paper) || hasContent(data.model_sources?.demo)) {
      content += `<h3>Model Sources</h3>\n`
      if (hasContent(data.model_sources?.repo)) {
        content += `<div class="key-value"><span class="key">Repository:</span> <span class="value"><a href="${escapeHtml(data.model_sources!.repo!)}" target="_blank">${escapeHtml(data.model_sources!.repo!)}</a></span></div>\n`
      }
      if (hasContent(data.model_sources?.paper)) {
        content += `<div class="key-value"><span class="key">Paper:</span> <span class="value"><a href="${escapeHtml(data.model_sources!.paper!)}" target="_blank">${escapeHtml(data.model_sources!.paper!)}</a></span></div>\n`
      }
      if (hasContent(data.model_sources?.demo)) {
        content += `<div class="key-value"><span class="key">Demo:</span> <span class="value"><a href="${escapeHtml(data.model_sources!.demo!)}" target="_blank">${escapeHtml(data.model_sources!.demo!)}</a></span></div>\n`
      }
    }

    // Get Started
    if (hasContent(data.get_started_code)) {
      content += `<h3>How to Get Started</h3>\n<pre><code>${escapeHtml(data.get_started_code!)}</code></pre>\n`
    }

    // HuggingFace Hub metadata (frontmatter fields)
    if (data.metadata) {
      const metadataEntries: Record<string, any> = {}
      const datasets = listToDisplay(data.metadata.datasets)
      const metrics = listToDisplay(data.metadata.metrics)
      const tags = listToDisplay(data.metadata.tags)

      if (hasContent(data.metadata.pipeline_tag)) metadataEntries['Pipeline Tag'] = data.metadata.pipeline_tag
      if (hasContent(data.metadata.library_name)) metadataEntries['Library Name'] = data.metadata.library_name
      if (datasets) metadataEntries['Datasets'] = datasets
      if (metrics) metadataEntries['Metrics'] = metrics
      if (tags) metadataEntries['Tags'] = tags
      const includeInference = data.metadata.inference === false || Object.keys(metadataEntries).length > 0
      if (data.metadata.inference !== undefined && includeInference) {
        metadataEntries['Enable Inference Widget'] = data.metadata.inference ? 'true' : 'false'
      }

      if (Object.keys(metadataEntries).length > 0) {
        content += `<h3>HuggingFace Metadata</h3>\n${renderKeyValue(metadataEntries)}\n`
      }
    }

    return content
  }

  private buildUsesAndSafetySection(data: ModelCard): string {
    let content = ''

    // Uses
    if (hasContent(data.uses?.direct_use) || hasContent(data.uses?.downstream_use) || hasContent(data.uses?.out_of_scope_use)) {
      content += `<h3>Uses</h3>\n`
      if (hasContent(data.uses?.direct_use)) {
        content += `<h4>Direct Use</h4>\n<div class="prose">${renderMarkdown(data.uses!.direct_use!)}</div>\n`
      }
      if (hasContent(data.uses?.downstream_use)) {
        content += `<h4>Downstream Use</h4>\n<div class="prose">${renderMarkdown(data.uses!.downstream_use!)}</div>\n`
      }
      if (hasContent(data.uses?.out_of_scope_use)) {
        content += `<h4>Out-of-Scope Use</h4>\n<div class="prose">${renderMarkdown(data.uses!.out_of_scope_use!)}</div>\n`
      }
    }

    // Bias, Risks, and Limitations
    if (hasContent(data.bias_risks?.bias_risks_limitations) || hasContent(data.bias_risks?.bias_recommendations)) {
      content += `<h3>Bias, Risks, and Limitations</h3>\n`
      if (hasContent(data.bias_risks?.bias_risks_limitations)) {
        content += `<div class="prose">${renderMarkdown(data.bias_risks!.bias_risks_limitations!)}</div>\n`
      }
      if (hasContent(data.bias_risks?.bias_recommendations)) {
        content += `<h4>Recommendations</h4>\n<div class="prose">${renderMarkdown(data.bias_risks!.bias_recommendations!)}</div>\n`
      }
    }

    return content
  }

  private buildTrainingAndEvaluationSection(data: ModelCard): string {
    let content = ''

    // Training Details
    if (hasContent(data.training_details?.training_data) || hasContent(data.training_details?.preprocessing) ||
        hasContent(data.training_details?.training_regime) || hasContent(data.training_details?.speeds_sizes_times)) {
      content += `<h3>Training Details</h3>\n`
      if (hasContent(data.training_details?.training_data)) {
        content += `<h4>Training Data</h4>\n<div class="prose">${renderMarkdown(data.training_details!.training_data!)}</div>\n`
      }
      if (hasContent(data.training_details?.preprocessing)) {
        content += `<h4>Preprocessing</h4>\n<div class="prose">${renderMarkdown(data.training_details!.preprocessing!)}</div>\n`
      }
      if (hasContent(data.training_details?.training_regime)) {
        content += `<h4>Training Regime</h4>\n<div class="prose">${renderMarkdown(data.training_details!.training_regime!)}</div>\n`
      }
      if (hasContent(data.training_details?.speeds_sizes_times)) {
        content += `<h4>Speeds, Sizes, Times</h4>\n<div class="prose">${renderMarkdown(data.training_details!.speeds_sizes_times!)}</div>\n`
      }
    }

    // Evaluation
    if (hasContent(data.evaluation?.testing_data) || hasContent(data.evaluation?.testing_factors) ||
        hasContent(data.evaluation?.testing_metrics) || hasContent(data.evaluation?.results) ||
        hasContent(data.evaluation?.results_summary)) {
      content += `<h3>Evaluation</h3>\n`
      if (hasContent(data.evaluation?.testing_data)) {
        content += `<h4>Testing Data</h4>\n<div class="prose">${renderMarkdown(data.evaluation!.testing_data!)}</div>\n`
      }
      if (hasContent(data.evaluation?.testing_factors)) {
        content += `<h4>Testing Factors</h4>\n<div class="prose">${renderMarkdown(data.evaluation!.testing_factors!)}</div>\n`
      }
      if (hasContent(data.evaluation?.testing_metrics)) {
        content += `<h4>Testing Metrics</h4>\n<div class="prose">${renderMarkdown(data.evaluation!.testing_metrics!)}</div>\n`
      }
      if (hasContent(data.evaluation?.results)) {
        content += `<h4>Results</h4>\n<div class="prose">${renderMarkdown(data.evaluation!.results!)}</div>\n`
      }
      if (hasContent(data.evaluation?.results_summary)) {
        content += `<h4>Summary</h4>\n<div class="prose">${renderMarkdown(data.evaluation!.results_summary!)}</div>\n`
      }
    }

    return content
  }

  private buildImpactAndSpecsSection(data: ModelCard): string {
    let content = ''

    // Environmental Impact
    if (hasContent(data.environmental_impact?.hardware_type) || hasContent(data.environmental_impact?.hours_used) ||
        hasContent(data.environmental_impact?.cloud_provider) || hasContent(data.environmental_impact?.cloud_region) ||
        hasContent(data.environmental_impact?.co2_emitted)) {
      content += `<h3>Environmental Impact</h3>\n<div class="grid">\n`
      if (hasContent(data.environmental_impact?.hardware_type)) {
        content += `<div class="grid-item"><div class="grid-item-title">Hardware Type</div><div class="grid-item-value">${escapeHtml(data.environmental_impact!.hardware_type!)}</div></div>\n`
      }
      if (hasContent(data.environmental_impact?.hours_used)) {
        content += `<div class="grid-item"><div class="grid-item-title">Hours Used</div><div class="grid-item-value">${escapeHtml(data.environmental_impact!.hours_used!)}</div></div>\n`
      }
      if (hasContent(data.environmental_impact?.cloud_provider)) {
        content += `<div class="grid-item"><div class="grid-item-title">Cloud Provider</div><div class="grid-item-value">${escapeHtml(data.environmental_impact!.cloud_provider!)}</div></div>\n`
      }
      if (hasContent(data.environmental_impact?.cloud_region)) {
        content += `<div class="grid-item"><div class="grid-item-title">Cloud Region</div><div class="grid-item-value">${escapeHtml(data.environmental_impact!.cloud_region!)}</div></div>\n`
      }
      if (hasContent(data.environmental_impact?.co2_emitted)) {
        content += `<div class="grid-item"><div class="grid-item-title">CO₂ Emitted</div><div class="grid-item-value">${escapeHtml(data.environmental_impact!.co2_emitted!)}</div></div>\n`
      }
      content += `</div>\n`
    }

    // Technical Specifications
    if (hasContent(data.technical_specs?.model_specs) || hasContent(data.technical_specs?.compute_infrastructure) ||
        hasContent(data.technical_specs?.hardware_requirements) || hasContent(data.technical_specs?.software)) {
      content += `<h3>Technical Specifications</h3>\n`
      if (hasContent(data.technical_specs?.model_specs)) {
        content += `<h4>Model Architecture and Objective</h4>\n<div class="prose">${renderMarkdown(data.technical_specs!.model_specs!)}</div>\n`
      }
      if (hasContent(data.technical_specs?.compute_infrastructure)) {
        content += `<h4>Compute Infrastructure</h4>\n<div class="prose">${renderMarkdown(data.technical_specs!.compute_infrastructure!)}</div>\n`
      }
      if (hasContent(data.technical_specs?.hardware_requirements)) {
        content += `<h4>Hardware Requirements</h4>\n<div class="prose">${renderMarkdown(data.technical_specs!.hardware_requirements!)}</div>\n`
      }
      if (hasContent(data.technical_specs?.software)) {
        content += `<h4>Software</h4>\n<div class="prose">${renderMarkdown(data.technical_specs!.software!)}</div>\n`
      }
    }

    return content
  }

  private buildCitationAndAdditionalInfoSection(data: ModelCard): string {
    let content = ''

    // Citation
    if (hasContent(data.citation?.citation_bibtex) || hasContent(data.citation?.citation_apa)) {
      content += `<h3>Citation</h3>\n`
      if (hasContent(data.citation?.citation_bibtex)) {
        content += `<h4>BibTeX</h4>\n<pre><code>${escapeHtml(data.citation!.citation_bibtex!)}</code></pre>\n`
      }
      if (hasContent(data.citation?.citation_apa)) {
        content += `<h4>APA</h4>\n<div class="prose">${renderMarkdown(data.citation!.citation_apa!)}</div>\n`
      }
    }

    // Additional Information
    if (hasContent(data.additional_info?.model_examination) || hasContent(data.additional_info?.glossary) ||
        hasContent(data.additional_info?.more_information) || hasContent(data.additional_info?.model_card_authors) ||
        hasContent(data.additional_info?.model_card_contact)) {
      content += `<h3>Additional Information</h3>\n`
      if (hasContent(data.additional_info?.model_examination)) {
        content += `<h4>Model Examination</h4>\n<div class="prose">${renderMarkdown(data.additional_info!.model_examination!)}</div>\n`
      }
      if (hasContent(data.additional_info?.glossary)) {
        content += `<h4>Glossary</h4>\n<div class="prose">${renderMarkdown(data.additional_info!.glossary!)}</div>\n`
      }
      if (hasContent(data.additional_info?.more_information)) {
        content += `<h4>More Information</h4>\n<div class="prose">${renderMarkdown(data.additional_info!.more_information!)}</div>\n`
      }
      if (hasContent(data.additional_info?.model_card_authors)) {
        content += `<div class="key-value"><span class="key">Model Card Authors:</span> <span class="value">${escapeHtml(data.additional_info!.model_card_authors!)}</span></div>\n`
      }
      if (hasContent(data.additional_info?.model_card_contact)) {
        content += `<div class="key-value"><span class="key">Model Card Contact:</span> <span class="value">${escapeHtml(data.additional_info!.model_card_contact!)}</span></div>\n`
      }
    }

    // Card Data Metadata
    if (hasContent(data.card_data)) {
      content += `<h3>Model Card Metadata</h3>\n${renderKeyValue(data.card_data!)}\n`
    }

    return content
  }

  private buildHtmlHeader(data: ModelCard): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(data.model_id)} - Model Card</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  ${this.buildCss()}
</head>
`
  }

  private buildHtmlBody(data: ModelCard, accordionSections: Array<{ title: string; content: string }>): string {
    let html = `<body>
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

`
    return html
  }

  private buildCss(): string {
    return `  <style>
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
  </style>`
  }

  private buildHtmlScript(): string {
    return `  <script>
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
`
  }
}
