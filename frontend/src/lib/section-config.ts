import { type PartialModelCard } from '@modelcard/schema'

export interface SectionConfig {
  id: string
  title: string
  fields: string[]
  required?: boolean // Whether section itself is required
  priority?: 'critical' | 'required' | 'optional' // Priority level for UI indicators
}

export const SECTION_CONFIGS: SectionConfig[] = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    required: true,
    priority: 'critical',
    fields: [
      'model_id',
      'model_summary',
    ],
  },
  {
    id: 'model-details',
    title: 'Model Details',
    required: true,
    priority: 'critical',
    fields: [
      'model_description',
      'developers',
      'funded_by',
      'shared_by',
      'model_type',
      'language',
      'license',
      'base_model',
    ],
  },
  {
    id: 'model-sources',
    title: 'Model Sources',
    priority: 'optional',
    fields: [
      'model_sources.repo',
      'model_sources.paper',
      'model_sources.demo',
    ],
  },
  {
    id: 'uses',
    title: 'Uses',
    priority: 'required',
    fields: [
      'uses.direct_use',
      'uses.downstream_use',
      'uses.out_of_scope_use',
    ],
  },
  {
    id: 'bias-risks',
    title: 'Bias, Risks, and Limitations',
    priority: 'required',
    fields: [
      'bias_risks.bias_risks_limitations',
      'bias_risks.bias_recommendations',
    ],
  },
  {
    id: 'training',
    title: 'Training Details',
    priority: 'required',
    fields: [
      'training_details.training_data',
      'training_details.preprocessing',
      'training_details.training_regime',
      'training_details.speeds_sizes_times',
    ],
  },
  {
    id: 'evaluation',
    title: 'Evaluation',
    priority: 'required',
    fields: [
      'evaluation.testing_data',
      'evaluation.testing_factors',
      'evaluation.testing_metrics',
      'evaluation.results',
      'evaluation.results_summary',
    ],
  },
  {
    id: 'environmental',
    title: 'Environmental Impact',
    priority: 'optional',
    fields: [
      'environmental_impact.hardware_type',
      'environmental_impact.hours_used',
      'environmental_impact.cloud_provider',
      'environmental_impact.cloud_region',
      'environmental_impact.co2_emitted',
    ],
  },
  {
    id: 'technical',
    title: 'Technical Specifications',
    priority: 'optional',
    fields: [
      'technical_specs.model_specs',
      'technical_specs.compute_infrastructure',
      'technical_specs.hardware_requirements',
      'technical_specs.software',
    ],
  },
  {
    id: 'citation',
    title: 'Citation',
    priority: 'optional',
    fields: [
      'citation.citation_bibtex',
      'citation.citation_apa',
    ],
  },
  {
    id: 'additional',
    title: 'Additional Information',
    priority: 'optional',
    fields: [
      'get_started_code',
      'additional_info.model_examination',
      'additional_info.glossary',
      'additional_info.more_information',
      'additional_info.model_card_authors',
      'additional_info.model_card_contact',
    ],
  },
  {
    id: 'metadata',
    title: 'HuggingFace Metadata',
    priority: 'optional',
    fields: [
      'metadata.license',
      'metadata.language',
      'metadata.base_model',
      'metadata.library_name',
      'metadata.pipeline_tag',
      'metadata.tags',
      'metadata.datasets',
      'metadata.metrics',
    ],
  },
]

// Helper function to get a nested value from an object using dot notation
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

// Helper function to check if a field is filled
export function isFieldFilled(value: any): boolean {
  if (value === undefined || value === null) return false
  if (typeof value === 'string') return value.trim() !== ''
  if (typeof value === 'object') {
    // Check if object has any non-empty values
    return Object.values(value).some(v => isFieldFilled(v))
  }
  return true
}

// Calculate completion for a section
export function calculateSectionCompletion(
  formData: PartialModelCard,
  section: SectionConfig
): { completed: number; total: number; percentage: number } {
  const completed = section.fields.filter(fieldPath => {
    const value = getNestedValue(formData, fieldPath)
    return isFieldFilled(value)
  }).length

  const total = section.fields.length
  const percentage = total > 0 ? (completed / total) * 100 : 0

  return { completed, total, percentage }
}

// Calculate overall completion across all sections
export function calculateOverallCompletion(
  formData: PartialModelCard,
  showOptionalFields: boolean
): { completed: number; total: number; percentage: number } {
  const sectionsToCount = showOptionalFields
    ? SECTION_CONFIGS
    : SECTION_CONFIGS.filter(s => s.required)

  let completedSections = 0

  for (const section of sectionsToCount) {
    const { completed } = calculateSectionCompletion(formData, section)
    // Consider a section complete if at least one field is filled
    if (completed > 0) {
      completedSections++
    }
  }

  const totalSections = sectionsToCount.length
  const percentage = totalSections > 0 ? (completedSections / totalSections) * 100 : 0

  return {
    completed: completedSections,
    total: totalSections,
    percentage,
  }
}

// Get section ID for a given field path
export function getSectionForField(fieldPath: string): string | undefined {
  const section = SECTION_CONFIGS.find(section =>
    section.fields.includes(fieldPath)
  )
  return section?.id
}
