import { z } from 'zod';

/**
 * Model Card Schema (Based on HuggingFace Model Card Standard)
 *
 * Reference: https://huggingface.co/docs/hub/model-cards
 * Template: https://github.com/huggingface/huggingface_hub/blob/main/src/huggingface_hub/templates/modelcard_template.md
 */

// YAML Frontmatter (card_data) - for HuggingFace Hub metadata
export const CardDataSchema = z.record(z.any()).optional();

// Model Sources
export const ModelSourcesSchema = z.object({
  repo: z.string().url('Invalid repository URL').optional(),
  paper: z.string().url('Invalid paper URL').optional(),
  demo: z.string().url('Invalid demo URL').optional(),
});

// Uses Section
export const UsesSchema = z.object({
  direct_use: z.string().optional(),
  downstream_use: z.string().optional(),
  out_of_scope_use: z.string().optional(),
});

// Bias, Risks, and Limitations
export const BiasRisksLimitationsSchema = z.object({
  bias_risks_limitations: z.string().optional(),
  bias_recommendations: z.string().optional(),
});

// Training Details
export const TrainingDetailsSchema = z.object({
  training_data: z.string().optional(),
  preprocessing: z.string().optional(),
  training_regime: z.string().optional(), // fp32, fp16, bf16, etc.
  speeds_sizes_times: z.string().optional(),
});

// Evaluation Section
export const EvaluationSchema = z.object({
  testing_data: z.string().optional(),
  testing_factors: z.string().optional(),
  testing_metrics: z.string().optional(),
  results: z.string().optional(),
  results_summary: z.string().optional(),
});

// Environmental Impact
export const EnvironmentalImpactSchema = z.object({
  hardware_type: z.string().optional(),
  hours_used: z.string().optional(),
  cloud_provider: z.string().optional(),
  cloud_region: z.string().optional(),
  co2_emitted: z.string().optional(),
});

// Technical Specifications
export const TechnicalSpecsSchema = z.object({
  model_specs: z.string().optional(),
  compute_infrastructure: z.string().optional(),
  hardware_requirements: z.string().optional(),
  software: z.string().optional(),
});

// Citation
export const CitationSchema = z.object({
  citation_bibtex: z.string().optional(),
  citation_apa: z.string().optional(),
});

// Additional Information
export const AdditionalInfoSchema = z.object({
  model_examination: z.string().optional(),
  glossary: z.string().optional(),
  more_information: z.string().optional(),
  model_card_authors: z.string().optional(),
  model_card_contact: z.string().optional(),
});

// Main Model Card Schema (HuggingFace Standard)
export const ModelCardSchema = z.object({
  // YAML Frontmatter
  card_data: CardDataSchema,

  // Basic Information
  model_id: z.string().min(1, 'Model ID is required'),
  model_summary: z.string().optional(),

  // Model Details Section
  model_description: z.string().optional(),
  developers: z.string().min(1, 'Developer information is required'),
  funded_by: z.string().optional(),
  shared_by: z.string().optional(),
  model_type: z.string().optional(),
  language: z.string().optional(), // For NLP models
  license: z.string().optional(),
  base_model: z.string().optional(), // For finetuned models

  // Model Sources (optional)
  model_sources: ModelSourcesSchema.optional(),

  // Uses Section
  uses: UsesSchema.optional(),

  // Bias, Risks, and Limitations
  bias_risks: BiasRisksLimitationsSchema.optional(),

  // How to Get Started with the Model (required)
  get_started_code: z.string().optional(),

  // Training Details
  training_details: TrainingDetailsSchema.optional(),

  // Evaluation
  evaluation: EvaluationSchema.optional(),

  // Environmental Impact
  environmental_impact: EnvironmentalImpactSchema.optional(),

  // Technical Specifications (optional)
  technical_specs: TechnicalSpecsSchema.optional(),

  // Citation (optional)
  citation: CitationSchema.optional(),

  // Additional Information
  additional_info: AdditionalInfoSchema.optional(),
});

// Helper function to validate and parse model card data
export function validateModelCard(data: unknown) {
  return ModelCardSchema.safeParse(data);
}

// Helper function to validate and throw on error
export function parseModelCard(data: unknown) {
  return ModelCardSchema.parse(data);
}
