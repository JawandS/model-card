import { z } from 'zod';

/**
 * Healthcare Model Card Schema
 * Zod validation schemas for healthcare ML model documentation
 */

// Enums
export const ClinicalContextEnum = z.enum([
  'screening',
  'triage',
  'diagnosis',
  'monitoring',
  'administrative',
]);

export const CareSettingEnum = z.enum([
  'inpatient',
  'outpatient',
  'ed',
  'telehealth',
  'other',
]);

export const DataSourceEnum = z.enum([
  'claims',
  'ehr',
  'registry',
  'imaging',
  'wearables',
  'other',
]);

// Sub-schemas
export const OwnerSchema = z.object({
  organization: z.string().min(1, 'Organization is required'),
  contact: z.string().email('Invalid email format').optional(),
});

export const IntendedUseSchema = z.object({
  summary: z.string().min(1, 'Summary is required'),
  clinical_context: ClinicalContextEnum,
  care_setting: CareSettingEnum.optional(),
  contraindications: z.string().optional(),
});

export const RepresentativenessSchema = z.object({
  population_frame: z.string().optional(),
  payer_mix: z.string().optional(),
  age_distribution: z.string().optional(),
  sex_distribution: z.string().optional(),
  race_ethnicity_notes: z.string().optional(),
  missingness: z.string().optional(),
});

export const DataSchema = z.object({
  source: DataSourceEnum,
  time_window: z.string().min(1, 'Time window is required'),
  geography: z.string().optional(),
  codesets: z.array(z.string()).optional(),
  representativeness: RepresentativenessSchema.optional(),
});

export const EvaluationSchema = z.object({
  overall_metrics: z.string().min(1, 'Overall metrics are required'),
  subgroup_analysis: z.string().optional(),
  external_validation: z.string().optional(),
  limitations: z.string().optional(),
});

export const RiskManagementSchema = z.object({
  failure_modes: z.string().optional(),
  human_oversight: z.string().optional(),
  monitoring_plan: z.string().optional(),
});

export const ProvenanceSchema = z.object({
  created_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  created_by: z.string().optional(),
  dataset_id: z.string().optional(),
  artifact_hash: z.string().optional(),
});

// Main Model Card Schema
export const ModelCardSchema = z.object({
  name: z.string().min(1, 'Model name is required'),
  model_version: z.string().min(1, 'Model version is required'),
  owner: OwnerSchema,
  intended_use: IntendedUseSchema,
  data: DataSchema,
  evaluation: EvaluationSchema,
  risk_management: RiskManagementSchema.optional(),
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
