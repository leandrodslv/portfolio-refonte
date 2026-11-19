import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const workflow = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8')

const jobs = [...workflow.slice(workflow.indexOf('\njobs:')).matchAll(/^ {2}([\w-]+):\s*$/gm)].map(
  (correspondance) => correspondance[1],
)
const bloc = /ci-ok:[\s\S]*?needs:\s*\[([\s\S]*?)\]/.exec(workflow)?.[1] ?? ''
const exiges = bloc
  .split(',')
  .map((nom) => nom.trim())
  .filter(Boolean)

describe('.github/workflows/ci.yml', () => {
  it('ci-ok exige chaque job du workflow', () => {
    expect(jobs.length).toBeGreaterThan(10)
    const oublies = jobs.filter((job) => job !== 'ci-ok' && !exiges.includes(job))
    expect(oublies, `jobs absents de needs de ci-ok : ${oublies.join(', ')}`).toEqual([])
  })

  it('ci-ok n’exige que des jobs qui existent', () => {
    expect(exiges.filter((job) => !jobs.includes(job))).toEqual([])
  })

  it('exige axe, Lighthouse, le budget JS, l’audit et gitleaks', () => {
    expect(exiges).toEqual(
      expect.arrayContaining(['budget-js', 'lighthouse', 'e2e', 'audit', 'secrets']),
    )
  })
})
