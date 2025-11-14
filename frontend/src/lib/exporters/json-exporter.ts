import type { ModelCard } from '@modelcard/schema'
import { BaseExporter } from './base'
import type { ExportOptions } from './types'

/**
 * JSON exporter
 * Exports model card as formatted JSON
 */
export class JsonExporter extends BaseExporter {
  readonly format = 'json' as const
  readonly fileExtension = 'json'
  readonly mimeType = 'application/json'

  protected generate(data: ModelCard, options: ExportOptions): Blob {
    const json = JSON.stringify(data, null, 2)
    return new Blob([json], { type: this.mimeType })
  }
}
