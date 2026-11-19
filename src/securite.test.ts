import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const lire = (chemin: string) => readFileSync(new URL(`../${chemin}`, import.meta.url), 'utf8')

describe('.gitleaks.toml', () => {
  const gitleaks = lire('.gitleaks.toml')

  it('hérite des règles par défaut', () => {
    expect(gitleaks).toMatch(/useDefault\s*=\s*true/)
  })

  it('limite l’allowlist au manifeste BMAD documenté', () => {
    const chemins = [...gitleaks.matchAll(/paths\s*=\s*\[([^\]]*)\]/g)].map((m) => m[1]?.trim())
    expect(chemins).toEqual(["'''_bmad/_config/files-manifest\\.csv'''"])
    expect(gitleaks).not.toMatch(/^\s*(regexes|stopwords|commits)\s*=/m)
    expect(gitleaks).not.toMatch(/\[\[rules/)
  })
})

describe('.github/dependabot.yml', () => {
  const dependabot = lire('.github/dependabot.yml')

  it.each(['npm', 'github-actions'])('surveille l’écosystème %s', (ecosysteme) => {
    expect(dependabot).toMatch(new RegExp(`package-ecosystem:\\s*${ecosysteme}`))
  })
})
