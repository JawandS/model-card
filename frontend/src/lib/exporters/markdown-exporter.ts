import type { ModelCard } from '@modelcard/schema'
import { BaseExporter } from './base'
import type { ExportOptions } from './types'

/**
 * Markdown exporter
 * Exports model card as HuggingFace-compatible Markdown with YAML frontmatter
 */
export class MarkdownExporter extends BaseExporter {
  readonly format = 'markdown' as const
  readonly fileExtension = 'md'
  readonly mimeType = 'text/markdown'

  protected getFilename(): string {
    // Always use README.md for markdown exports (HuggingFace standard)
    return 'README.md'
  }

  protected generate(data: ModelCard, options: ExportOptions): Blob {
    const markdown = this.buildMarkdown(data)
    return new Blob([markdown], { type: this.mimeType })
  }

  private buildMarkdown(data: ModelCard): string {
    let markdown = ''

    // Generate YAML Frontmatter with HuggingFace metadata
    markdown += this.buildYamlFrontmatter(data)

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

    return markdown
  }

  private buildYamlFrontmatter(data: ModelCard): string {
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

    // Generate YAML frontmatter if we have any fields
    if (Object.keys(yamlFields).length === 0) {
      return ''
    }

    let yaml = `---\n`

    // Format YAML fields
    Object.entries(yamlFields).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Format arrays with proper YAML syntax
        yaml += `${key}:\n`
        value.forEach(item => {
          yaml += `  - ${item}\n`
        })
      } else if (typeof value === 'boolean') {
        // Format booleans without quotes
        yaml += `${key}: ${value}\n`
      } else {
        // Format strings and numbers
        yaml += `${key}: ${value}\n`
      }
    })

    yaml += `---\n\n`
    return yaml
  }
}
