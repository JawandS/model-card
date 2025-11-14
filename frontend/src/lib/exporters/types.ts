import type { ModelCard } from '@modelcard/schema'

/**
 * Supported export formats
 */
export type ExportFormat = 'json' | 'markdown' | 'html' | 'pdf'

/**
 * Export options (extensible for future formats)
 */
export interface ExportOptions {
  /** Custom filename (without extension) */
  filename?: string
  /** Format-specific options */
  [key: string]: any
}

/**
 * Export result
 */
export interface ExportResult {
  success: boolean
  filename?: string
  error?: string
}

/**
 * Base exporter interface
 */
export interface IExporter {
  /** Export format identifier */
  readonly format: ExportFormat

  /** File extension (without dot) */
  readonly fileExtension: string

  /** MIME type for the blob */
  readonly mimeType: string

  /** Export model card data */
  export(data: ModelCard, options?: ExportOptions): void
}
