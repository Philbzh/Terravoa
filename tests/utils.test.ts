import { describe, it, expect } from 'vitest'
import { slugify } from '@/lib/utils'

describe('slugify', () => {
  it('converts basic text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('handles German umlauts', () => {
    expect(slugify('Käse Spätlese')).toBe('kaese-spaetlese')
    expect(slugify('Grüße')).toBe('gruesse')
    expect(slugify('Öl')).toBe('oel')
  })

  it('removes special characters', () => {
    expect(slugify('Olive Oil (Cold-Pressed)')).toBe('olive-oil-cold-pressed')
  })

  it('trims leading/trailing hyphens', () => {
    expect(slugify('--hello--')).toBe('hello')
  })

  it('handles empty string', () => {
    expect(slugify('')).toBe('')
  })
})
