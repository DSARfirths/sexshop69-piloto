import { describe, expect, it } from 'vitest'

import { sanitizeDescriptionHtml } from '../products'

describe('sanitizeDescriptionHtml', () => {
  it('keeps allowed tags and strips disallowed attributes', () => {
    const dirty = '<p class="foo" style="color:red">Hola <strong>mundo</strong></p>'
    const result = sanitizeDescriptionHtml(dirty)
    expect(result).toBe('<p>Hola <strong>mundo</strong></p>')
  })

  it('removes dangerous event handlers and preserves safe href', () => {
    const dirty = "<a href='https://example.com' onclick=\"alert('x')\">Leer más</a>"
    const result = sanitizeDescriptionHtml(dirty)
    expect(result).toBe('<a href="https://example.com">Leer más</a>')
  })

  it('drops script tags entirely', () => {
    const dirty = "<script>alert('xss')</script><p>Seguro</p>"
    const result = sanitizeDescriptionHtml(dirty)
    expect(result).toBe('<p>Seguro</p>')
  })

  it('returns null when nothing safe remains', () => {
    const dirty = '<script>alert(1)</script>'
    const result = sanitizeDescriptionHtml(dirty)
    expect(result).toBeNull()
  })
})
