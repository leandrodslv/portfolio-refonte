import { describe, expect, it } from 'vitest'
import { analyser, rendre } from './ui/rendu'
import Seo from './Seo.astro'

const liens = async (locale: 'fr' | 'en', slug?: string) => {
  const html = await rendre(Seo, { props: { locale, slug } })
  return [...analyser(html).querySelectorAll('link')].map((l) => [
    l.getAttribute('rel'),
    l.getAttribute('hreflang'),
    l.getAttribute('href'),
  ])
}

describe('Seo', () => {
  it.each(['fr', 'en'] as const)(
    'déclare canonical, hreflang réciproques et x-default (%s)',
    async (locale) => {
      const attendu =
        locale === 'fr' ? 'https://leandro-dasilva.com/' : 'https://leandro-dasilva.com/en/'
      expect(await liens(locale)).toEqual([
        ['canonical', null, attendu],
        ['alternate', 'fr', 'https://leandro-dasilva.com/'],
        ['alternate', 'en', 'https://leandro-dasilva.com/en/'],
        ['alternate', 'x-default', 'https://leandro-dasilva.com/'],
      ])
    },
  )

  it('vise l’adresse du Projet dans chaque Langue quand un slug est donné', async () => {
    expect(await liens('en', 'x')).toEqual([
      ['canonical', null, 'https://leandro-dasilva.com/en/projects/x'],
      ['alternate', 'fr', 'https://leandro-dasilva.com/projets/x'],
      ['alternate', 'en', 'https://leandro-dasilva.com/en/projects/x'],
      ['alternate', 'x-default', 'https://leandro-dasilva.com/projets/x'],
    ])
  })
})
