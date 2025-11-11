import { z } from 'zod';
import {
  ModelCardSchema,
  CardDataSchema,
  ModelSourcesSchema,
  UsesSchema,
  BiasRisksLimitationsSchema,
  TrainingDetailsSchema,
  EvaluationSchema,
  EnvironmentalImpactSchema,
  TechnicalSpecsSchema,
  CitationSchema,
  AdditionalInfoSchema,
} from './modelcard.schema';

/**
 * TypeScript types inferred from Zod schemas (HuggingFace Model Card Standard)
 */

export type ModelCard = z.infer<typeof ModelCardSchema>;
export type CardData = z.infer<typeof CardDataSchema>;
export type ModelSources = z.infer<typeof ModelSourcesSchema>;
export type Uses = z.infer<typeof UsesSchema>;
export type BiasRisksLimitations = z.infer<typeof BiasRisksLimitationsSchema>;
export type TrainingDetails = z.infer<typeof TrainingDetailsSchema>;
export type Evaluation = z.infer<typeof EvaluationSchema>;
export type EnvironmentalImpact = z.infer<typeof EnvironmentalImpactSchema>;
export type TechnicalSpecs = z.infer<typeof TechnicalSpecsSchema>;
export type Citation = z.infer<typeof CitationSchema>;
export type AdditionalInfo = z.infer<typeof AdditionalInfoSchema>;

/**
 * Partial type for form state (all fields optional for progressive filling)
 */
export type PartialModelCard = Partial<ModelCard>;
