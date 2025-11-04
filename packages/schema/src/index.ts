/**
 * @modelcard/schema
 * Shared Zod schemas and TypeScript types for Model Cards
 * Based on Google Model Card Standard with Healthcare Extensions
 */

// Export all schemas
export {
  ModelCardSchema,
  OwnerSchema,
  ModelDetailsSchema,
  TrainingDataSchema,
  ImplementationSchema,
  EvaluationSchema,
  EthicsAndSafetySchema,
  UsageAndLimitationsSchema,
  HealthcareExtensionSchema,
  ProvenanceSchema,
  RepresentativenessSchema,
  ClinicalContextEnum,
  CareSettingEnum,
  validateModelCard,
  parseModelCard,
} from './modelcard.schema';

// Export all types
export type {
  ModelCard,
  Owner,
  ModelDetails,
  TrainingData,
  Implementation,
  Evaluation,
  EthicsAndSafety,
  UsageAndLimitations,
  HealthcareExtension,
  Provenance,
  Representativeness,
  ClinicalContext,
  CareSetting,
  PartialModelCard,
} from './types';
