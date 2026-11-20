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
  const globale = regles.find((regle) => !regle.has)
  const valeur = (nom: string) => globale?.headers.filter((entete) => entete.key === nom)

  it.each([
    'Content-Security-Policy',
    'Strict-Transport-Security',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Permissions-Policy',
  ])('déclare %s une seule fois sur toutes les adresses', (nom) => {
    expect(valeur(nom)).toHaveLength(1)
  })

  it('la CSP d’en-tête ferme les directives hors script et style', () => {
    const csp = valeur('Content-Security-Policy')?.[0]?.value ?? ''
    for (const directive of [
      "base-uri 'self'",
      "object-src 'none'",
      "form-action 'self'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "media-src 'self'",
      "worker-src 'self' blob:",
      "frame-src 'none'",
      "frame-ancestors 'none'",
    ]) {
      expect(csp).toContain(directive)
    }
    expect(csp).not.toMatch(/(script-src|style-src|default-src)/)
    expect(csp).not.toMatch(/unsafe-(inline|eval)/)
  })

  it('HSTS : un jour au plus, sans preload ni includeSubDomains', () => {
    const hsts = valeur('Strict-Transport-Security')?.[0]?.value ?? ''
    const duree = Number(/max-age=(\d+)/.exec(hsts)?.[1])
    expect(duree).toBeGreaterThan(0)
    expect(duree).toBeLessThanOrEqual(86400)
    expect(hsts).not.toMatch(/preload|includeSubDomains/i)
  })

  it('X-Content-Type-Options vaut nosniff', () => {
    expect(valeur('X-Content-Type-Options')?.[0]?.value).toBe('nosniff')
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
