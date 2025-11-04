import { z } from 'zod';
import {
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
} from './modelcard.schema';

/**
 * TypeScript types inferred from Zod schemas
 */

export type ModelCard = z.infer<typeof ModelCardSchema>;
export type Owner = z.infer<typeof OwnerSchema>;
export type ModelDetails = z.infer<typeof ModelDetailsSchema>;
export type TrainingData = z.infer<typeof TrainingDataSchema>;
export type Implementation = z.infer<typeof ImplementationSchema>;
export type Evaluation = z.infer<typeof EvaluationSchema>;
export type EthicsAndSafety = z.infer<typeof EthicsAndSafetySchema>;
export type UsageAndLimitations = z.infer<typeof UsageAndLimitationsSchema>;
export type HealthcareExtension = z.infer<typeof HealthcareExtensionSchema>;
export type Provenance = z.infer<typeof ProvenanceSchema>;
export type Representativeness = z.infer<typeof RepresentativenessSchema>;

export type ClinicalContext = z.infer<typeof ClinicalContextEnum>;
export type CareSetting = z.infer<typeof CareSettingEnum>;

/**
 * Partial type for form state (all fields optional for progressive filling)
 */
export type PartialModelCard = Partial<ModelCard>;
