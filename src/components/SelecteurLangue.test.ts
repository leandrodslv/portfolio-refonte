import { describe, expect, it } from 'vitest'
import { analyser, rendre, violationsAxe } from './ui/rendu'
import SelecteurLangue from './SelecteurLangue.astro'

const libelles = { fr: 'Langue', en: 'Language' }

describe('SelecteurLangue', () => {
  it.each([
    ['fr', 'FR', '/en/'],
    ['en', 'EN', '/'],
  ] as const)('marque la Langue active et lie l’autre (%s)', async (locale, actif, autreHref) => {
    const html = await rendre(SelecteurLangue, { props: { locale, libelle: libelles[locale] } })
    const document = analyser(html)
    expect(document.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe(
      libelles[locale],
    )
    const liens = [...document.querySelectorAll('a')]
    expect(liens.map((a) => a.textContent?.trim())).toEqual(['FR', 'EN'])
    const courant = liens.filter((a) => a.getAttribute('aria-current') === 'true')
    expect(courant.map((a) => a.textContent?.trim())).toEqual([actif])
    const autre = liens.find((a) => a.getAttribute('aria-current') === null)
    expect(autre?.getAttribute('href')).toBe(autreHref)
    expect(autre?.getAttribute('lang')).toBe(autre?.getAttribute('hreflang'))
  })

  it.each(['fr', 'en'] as const)('n’a aucune violation axe (%s)', async (locale) => {
    const html = await rendre(SelecteurLangue, { props: { locale, libelle: libelles[locale] } })
    expect(await violationsAxe(html)).toEqual([])
  })

  it('mène aux adresses du Projet dans chaque Langue quand un slug est donné', async () => {
    const html = await rendre(SelecteurLangue, {
      props: { locale: 'fr', libelle: 'Langue', slug: 'x' },
    })
    expect([...analyser(html).querySelectorAll('a')].map((a) => a.getAttribute('href'))).toEqual([
      '/projets/x',
      '/en/projects/x',
    ])
  })
})
