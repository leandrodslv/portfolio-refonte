import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync(new URL('./global.css', import.meta.url), 'utf8')

describe('src/styles/global.css', () => {
  it('importe Tailwind puis design-system/tokens.css', () => {
    expect(css).toMatch(/@import\s+['"]tailwindcss['"]/)
    expect(css).toMatch(/@import\s+['"]\.\.\/\.\.\/design-system\/tokens\.css['"]/)
  })

  it('expose les tokens à Tailwind via @theme inline', () => {
    expect(css).toMatch(/@theme\s+inline\s*\{/)
  })
})
