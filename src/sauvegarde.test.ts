import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const lire = (chemin: string) => readFileSync(new URL(chemin, import.meta.url), 'utf8')
const workflow = lire('../.github/workflows/sauvegarde-production.yml')
const doc = lire('../docs/exploitation.md')

describe('.github/workflows/sauvegarde-production.yml', () => {
  it('se lance chaque semaine et à la main, jamais sur une PR ni un push', () => {
    expect(workflow).toMatch(/schedule:\s*\n\s*- cron: '[^']+'/)
    expect(workflow).toContain('workflow_dispatch:')
    expect(workflow).not.toContain('pull_request')
    expect(workflow).not.toMatch(/^\s*push:/m)
  })

  it('la planification est hebdomadaire (jour de la semaine fixé, mois et jour libres)', () => {
    const cron = /cron: '([^']+)'/.exec(workflow)?.[1] ?? ''
    const [minute, heure, jour, mois, semaine] = cron.split(' ')
    expect([jour, mois]).toEqual(['*', '*'])
    expect(semaine).toMatch(/^[0-6]$/)
    expect(minute).toMatch(/^\d+$/)
    expect(heure).toMatch(/^\d+$/)
  })

  it('n’a que la permission de lire le dépôt', () => {
    expect(workflow).toMatch(/^permissions:\s*\n\s+contents: read\s*$/m)
    expect(workflow).not.toMatch(/write/)
  })

  it('épingle chaque action par SHA', () => {
    const actions = [...workflow.matchAll(/uses:\s*(\S+)/g)].map((trouve) => trouve[1] ?? '')
    expect(actions.length).toBeGreaterThanOrEqual(3)
    for (const action of actions) expect(action).toMatch(/@[0-9a-f]{40}$/)
  })

  it('lit le jeton et l’identifiant du projet dans secrets et vars, sans valeur en clair', () => {
    expect(workflow).toContain('${{ secrets.SANITY_READ_TOKEN }}')
    expect(workflow).toContain('${{ vars.SANITY_PROJECT_ID }}')
    expect(workflow).not.toMatch(/sk[A-Za-z0-9]{30,}/)
    expect(workflow).not.toMatch(/SANITY_AUTH_TOKEN:\s*(?!\$\{\{)\S+/)
  })

  it('échoue avec un message qui nomme l’élément manquant', () => {
    expect(workflow).toContain('::error::')
    expect(workflow).toContain('SANITY_READ_TOKEN (secret)')
    expect(workflow).toContain('SANITY_PROJECT_ID (variable)')
  })

  it('exporte production et conserve l’artefact 90 jours, nom daté', () => {
    expect(workflow).toContain('sanity dataset export production')
    expect(workflow).toContain('retention-days: 90')
    expect(workflow).toContain('if-no-files-found: error')
    expect(workflow).toContain('production-$(date -u +%Y-%m-%d)')
  })
})

describe('procédure de publication (docs/exploitation.md)', () => {
  it.each([
    'deploy hook',
    'webhook',
    'SANITY_DATASET',
    'site-lecture-production',
    'sanity dataset export dev',
    'sanity dataset import',
    '--replace',
    'ne supprime pas',
    'sauvegarde-production',
    'cinq minutes',
    'AD-10',
  ])('mentionne « %s »', (terme) => {
    expect(doc).toContain(terme)
  })

  it('ne contient aucune URL de deploy hook réelle', () => {
    expect(doc).not.toMatch(
      /api\.vercel\.com\/v1\/integrations\/deploy\/[A-Za-z0-9_]+\/[A-Za-z0-9]+/,
    )
  })
})
