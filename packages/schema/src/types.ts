import { z } from 'zod';
import {
  ModelCardSchema,
  OwnerSchema,
  IntendedUseSchema,
  DataSchema,
  EvaluationSchema,
  RiskManagementSchema,
  ProvenanceSchema,
  RepresentativenessSchema,
  ClinicalContextEnum,
  CareSettingEnum,
  DataSourceEnum,
} from './modelcard.schema';

/**
 * TypeScript types inferred from Zod schemas
 */

export type ModelCard = z.infer<typeof ModelCardSchema>;
export type Owner = z.infer<typeof OwnerSchema>;
export type IntendedUse = z.infer<typeof IntendedUseSchema>;
export type Data = z.infer<typeof DataSchema>;
export type Evaluation = z.infer<typeof EvaluationSchema>;
export type RiskManagement = z.infer<typeof RiskManagementSchema>;
export type Provenance = z.infer<typeof ProvenanceSchema>;
export type Representativeness = z.infer<typeof RepresentativenessSchema>;

export type ClinicalContext = z.infer<typeof ClinicalContextEnum>;
export type CareSetting = z.infer<typeof CareSettingEnum>;
export type DataSource = z.infer<typeof DataSourceEnum>;

/**
 * Partial type for form state (all fields optional for progressive filling)
 */
export type PartialModelCard = Partial<ModelCard>;
