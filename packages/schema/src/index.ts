/**
 * @modelcard/schema
 * Shared Zod schemas and TypeScript types for Model Cards
 * Based on HuggingFace Model Card Standard
 */

// Export all schemas
export {
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
  validateModelCard,
  parseModelCard,
} from './modelcard.schema';

// Export all types
export type {
  ModelCard,
  CardData,
  ModelSources,
  Uses,
  BiasRisksLimitations,
  TrainingDetails,
  Evaluation,
  EnvironmentalImpact,
  TechnicalSpecs,
  Citation,
  AdditionalInfo,
  PartialModelCard,
} from './types';
