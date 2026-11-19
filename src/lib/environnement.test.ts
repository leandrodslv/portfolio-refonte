import { describe, expect, it } from 'vitest'
import { contenuRobotsTxt, directiveRobots, estProduction } from './environnement'

describe('environnement', () => {
  it('production : indexable, sans noindex', () => {
    expect(estProduction('production')).toBe(true)
    expect(directiveRobots('production')).toBeNull()
    expect(contenuRobotsTxt('production')).toBe('User-agent: *\nAllow: /\n')
  })

  it.each(['preview', undefined, '', 'development', 'Production'])(
    '%s : noindex et robots.txt interdit',
    (env) => {
      expect(estProduction(env)).toBe(false)
      expect(directiveRobots(env)).toBe('noindex')
      expect(contenuRobotsTxt(env)).toBe('User-agent: *\nDisallow: /\n')
    },
  )
})
