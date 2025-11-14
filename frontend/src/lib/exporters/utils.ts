import { marked } from 'marked'
import DOMPurify from 'dompurify'
import type { ModelCard } from '@modelcard/schema'

/**
 * Check if a value has meaningful content
 */
export function hasContent(obj: any): boolean {
  if (!obj) return false
  if (typeof obj === 'string') return obj.trim().length > 0
  if (Array.isArray(obj)) return obj.length > 0
  if (typeof obj === 'object') return Object.keys(obj).length > 0
  return false
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Render markdown safely (parse + sanitize)
 */
export function renderMarkdown(markdown: string): string {
  const html = marked.parse(markdown, { async: false }) as string
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                   'ul', 'ol', 'li', 'a', 'code', 'pre', 'blockquote', 'hr', 'table',
                   'thead', 'tbody', 'tr', 'th', 'td', 'img', 'del', 'ins', 'sub', 'sup'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class']
  })
}

/**
 * Render key-value pairs as HTML
 */
export function renderKeyValue(obj: Record<string, any>): string {
  return Object.entries(obj)
    .filter(([_, value]) => hasContent(value))
    .map(([key, value]) => {
      const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      return `<div class="key-value"><span class="key">${escapeHtml(displayKey)}:</span> <span class="value">${escapeHtml(String(value))}</span></div>`
    }).join('')
}

/**
 * Convert markdown to plain text (for PDF export)
 */
export function markdownToPlainText(markdown: string): string {
  return markdown
    // Remove bold/italic markers but keep the text
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')  // Bold italic
    .replace(/\*\*(.+?)\*\*/g, '$1')      // Bold
    .replace(/\*(.+?)\*/g, '$1')          // Italic
    .replace(/__(.+?)__/g, '$1')          // Bold
    .replace(/_(.+?)_/g, '$1')            // Italic
    // Convert links to just the text
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    // Convert headings to just text
    .replace(/^#{1,6}\s+(.+)$/gm, '$1')
    // Convert bullet points
    .replace(/^\s*[-*+]\s+(.+)$/gm, '• $1')
    // Convert numbered lists
    .replace(/^\s*\d+\.\s+(.+)$/gm, '$1')
    // Remove code blocks markers
    .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, ''))
    .replace(/`(.+?)`/g, '$1')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Trigger file download in the browser
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generate filename from model ID
 */
export function generateFilename(data: ModelCard, extension: string): string {
  const sanitizedId = data.model_id.replace(/\s+/g, '-').toLowerCase()
  return `${sanitizedId}-modelcard.${extension}`
}
