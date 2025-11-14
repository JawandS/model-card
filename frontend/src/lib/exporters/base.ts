import type { ModelCard } from '@modelcard/schema'
import type { ExportFormat, ExportOptions, IExporter } from './types'
import { downloadFile, generateFilename } from './utils'

/**
 * Abstract base class for all exporters
 * Uses template method pattern for consistent export flow
 */
export abstract class BaseExporter implements IExporter {
  /** Export format identifier */
  abstract readonly format: ExportFormat

  /** File extension (without dot) */
  abstract readonly fileExtension: string

  /** MIME type for the blob */
  abstract readonly mimeType: string

  /**
   * Template method - defines the export algorithm
   */
  export(data: ModelCard, options: ExportOptions = {}): void {
    // 1. Validate data
    this.validate(data)

    // 2. Generate content
    const content = this.generate(data, options)

    // 3. Create filename
    const filename = this.getFilename(data, options)

    // 4. Download file
    this.download(content, filename)
  }

  /**
   * Validate model card data (can be overridden)
   */
  protected validate(data: ModelCard): void {
    if (!data.model_id) {
      throw new Error('Model ID is required for export')
    }
  }

  /**
   * Generate content blob (must be implemented by subclasses)
   */
  protected abstract generate(data: ModelCard, options: ExportOptions): Blob

  /**
   * Get filename (can be overridden)
   */
  protected getFilename(data: ModelCard, options: ExportOptions): string {
    if (options.filename) {
      return `${options.filename}.${this.fileExtension}`
    }
    return generateFilename(data, this.fileExtension)
  }

  /**
   * Download file (can be overridden)
   */
  protected download(content: Blob, filename: string): void {
    downloadFile(content, filename)
  }
}
