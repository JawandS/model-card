import { z } from 'zod';

/**
 * Model Card Schema (Based on Google Model Card Standard)
 * Extended with healthcare-specific fields for ML models in healthcare
 *
 * Reference: https://modelcards.withgoogle.com/
 */

// Healthcare-specific Enums (optional extensions)
export const ClinicalContextEnum = z.enum([
  'screening',
  'triage',
  'diagnosis',
  'monitoring',
  'administrative',
  'prognosis',
  'treatment_planning',
]);

export const CareSettingEnum = z.enum([
  'inpatient',
  'outpatient',
  'ed',
  'telehealth',
  'home_care',
  'long_term_care',
  'other',
]);

// Sub-schemas following Google Model Card structure

// Model Details (Model Information)
export const OwnerSchema = z.object({
  name: z.string().min(1, 'Owner name/organization is required'),
  contact: z.string().email('Invalid email format').optional(),
});

export const ModelDetailsSchema = z.object({
  description: z.string().optional(),
  version: z.string().min(1, 'Model version is required'),
  owners: z.array(OwnerSchema).optional(),
  license: z.string().optional(),
  citation: z.string().optional(),
  references: z.array(z.string()).optional(),
  input_format: z.string().optional(),
  output_format: z.string().optional(),
});

// Training Data (Model Data)
export const TrainingDataSchema = z.object({
  description: z.string().optional(),
  source: z.string().optional(),
  preprocessing: z.string().optional(),
  size: z.string().optional(),
});

// Implementation Information
export const ImplementationSchema = z.object({
  hardware: z.string().optional(),
  software: z.string().optional(),
  framework: z.string().optional(),
});

// Evaluation
export const EvaluationSchema = z.object({
  benchmark_results: z.string().optional(),
  metrics: z.string().optional(),
  datasets: z.string().optional(),
  factors: z.string().optional(), // For demographic/subgroup analysis
});

// Ethics and Safety (includes bias considerations)
export const EthicsAndSafetySchema = z.object({
  approach: z.string().optional(),
  risks: z.string().optional(),
  harms: z.string().optional(),
  bias_analysis: z.string().optional(), // Specific field for bias
  fairness_assessment: z.string().optional(), // Fairness across groups
  use_cases: z.array(z.string()).optional(),
  out_of_scope_uses: z.array(z.string()).optional(),
});

// Usage and Limitations
export const UsageAndLimitationsSchema = z.object({
  intended_use: z.string().optional(),
  limitations: z.string().optional(),
  ethical_considerations: z.string().optional(),
  benefits: z.string().optional(),
});

// Healthcare Extension (optional)
export const RepresentativenessSchema = z.object({
  population_frame: z.string().optional(),
  payer_mix: z.string().optional(),
  age_distribution: z.string().optional(),
  sex_distribution: z.string().optional(),
  race_ethnicity_notes: z.string().optional(),
  geographic_distribution: z.string().optional(),
  missingness: z.string().optional(),
});

export const HealthcareExtensionSchema = z.object({
  clinical_context: ClinicalContextEnum.optional(),
  care_setting: CareSettingEnum.optional(),
  contraindications: z.string().optional(),
  patient_population: z.string().optional(),
  clinical_validation: z.string().optional(),
  representativeness: RepresentativenessSchema.optional(),
  failure_modes: z.string().optional(),
  human_oversight: z.string().optional(),
  monitoring_plan: z.string().optional(),
});

// Provenance
export const ProvenanceSchema = z.object({
  created_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  created_by: z.string().optional(),
  last_updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  version_history: z.string().optional(),
});

// Main Model Card Schema (Google Model Card Standard + Healthcare Extensions)
export const ModelCardSchema = z.object({
  // Basic Information
  name: z.string().min(1, 'Model name is required'),

  // Google Model Card Standard Sections
  model_details: ModelDetailsSchema,
  training_data: TrainingDataSchema.optional(),
  implementation: ImplementationSchema.optional(),
  evaluation: EvaluationSchema.optional(),
  ethics_and_safety: EthicsAndSafetySchema.optional(),
  usage_and_limitations: UsageAndLimitationsSchema.optional(),

  // Optional Extensions
  healthcare: HealthcareExtensionSchema.optional(),
  provenance: ProvenanceSchema.optional(),
});

// Helper function to validate and parse model card data
export function validateModelCard(data: unknown) {
  return ModelCardSchema.safeParse(data);
}

// Helper function to validate and throw on error
export function parseModelCard(data: unknown) {
  return ModelCardSchema.parse(data);
}
