/**
 * Modular Exporter System
 *
 * This module provides a factory pattern for creating different types of exporters.
 * Each exporter extends the BaseExporter class and implements format-specific logic.
 *
 * @example
 * ```typescript
 * // Factory pattern
 * const exporter = createExporter('json')
 * exporter.export(modelCardData)
 *
 * // Direct function calls (backward compatible)
 * exportToJSON(modelCardData)
 * exportToHTML(modelCardData)
 * ```
 */

import type { ModelCard } from '@modelcard/schema'
import type { ExportFormat, ExportOptions } from './types'
import { BaseExporter } from './base'
import { JsonExporter } from './json-exporter'
import { MarkdownExporter } from './markdown-exporter'
import { HtmlExporter } from './html-exporter'
import { PdfExporter } from './pdf-exporter'

/**
 * Factory function to create an exporter for a specific format
 * @param format - The export format
 * @returns An exporter instance
 * @throws Error if the format is not supported
 */
export function createExporter(format: ExportFormat): BaseExporter {
  switch (format) {
    case 'json':
      return new JsonExporter()
    case 'markdown':
      return new MarkdownExporter()
    case 'html':
      return new HtmlExporter()
    case 'pdf':
      return new PdfExporter()
    default:
      throw new Error(`Unsupported export format: ${format}`)
  }
}

/**
 * Convenience function: Export model card as JSON
 * @param data - Model card data
 * @param options - Export options
 */
export function exportToJSON(data: ModelCard, options?: ExportOptions): void {
  createExporter('json').export(data, options)
}

/**
 * Convenience function: Export model card as Markdown
 * @param data - Model card data
 * @param options - Export options
 */
export function exportToMarkdown(data: ModelCard, options?: ExportOptions): void {
  createExporter('markdown').export(data, options)
}

/**
 * Convenience function: Export model card as HTML
 * @param data - Model card data
 * @param options - Export options
 */
export function exportToHTML(data: ModelCard, options?: ExportOptions): void {
  createExporter('html').export(data, options)
}

/**
 * Convenience function: Export model card as PDF
 * @param data - Model card data
 * @param options - Export options
 */
export function exportToPDF(data: ModelCard, options?: ExportOptions): void {
  createExporter('pdf').export(data, options)
}

// Re-export types for external use
export type { ExportFormat, ExportOptions, ExportResult, IExporter } from './types'

// Re-export base class for extension
export { BaseExporter } from './base'

// Re-export concrete exporters for advanced usage
export { JsonExporter } from './json-exporter'
export { MarkdownExporter } from './markdown-exporter'
export { HtmlExporter } from './html-exporter'
export { PdfExporter } from './pdf-exporter'

// Re-export utilities for custom exporters
export { hasContent, escapeHtml, renderMarkdown, renderKeyValue, markdownToPlainText } from './utils'
