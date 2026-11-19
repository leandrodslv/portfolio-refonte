import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

type Regle = {
  source: string
  has?: { type: string; value: string }[]
  headers: { key: string; value: string }[]
}

const { headers: regles } = JSON.parse(
  readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'),
) as { headers: Regle[] }

describe('vercel.json', () => {
  it('garde frame-ancestors sur toutes les adresses', () => {
    const globale = regles.find((regle) => !regle.has)
    expect(globale?.headers).toContainEqual({
      key: 'Content-Security-Policy',
      value: "frame-ancestors 'none'",
    })
  })

  it('ajoute X-Robots-Tag noindex pour l’hôte de dev seulement', () => {
    const dev = regles.find((regle) => regle.has)
    expect(dev?.has).toEqual([{ type: 'host', value: '.*-git-dev-.*\\.vercel\\.app' }])
    expect(dev?.headers).toEqual([{ key: 'X-Robots-Tag', value: 'noindex' }])
    expect(
      new RegExp(`^${dev?.has?.[0]?.value}$`).test('portfolio-git-dev-leandro.vercel.app'),
    ).toBe(true)
    expect(new RegExp(`^${dev?.has?.[0]?.value}$`).test('portfolio.vercel.app')).toBe(false)
  })
})
