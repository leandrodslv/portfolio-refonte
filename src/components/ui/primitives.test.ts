import { describe, expect, it } from 'vitest'
import Badge from './Badge.astro'
import Button from './Button.astro'
import Card from './Card.astro'
import Link from './Link.astro'
import Section from './Section.astro'
import SectionTitle from './SectionTitle.astro'
import Select from './Select.astro'
import Sticker from './Sticker.astro'
import Tag from './Tag.astro'
import { analyser, rendre, violationsAxe } from './rendu'

const LONG = 'Texte nettement plus long que la version française de référence pour le contrôle'

describe('Button', () => {
  it('rend un bouton de type button avec le texte du slot', async () => {
    const doc = analyser(await rendre(Button, { slots: { default: 'Voir' } }))
    const bouton = doc.querySelector('button')
    expect(bouton?.getAttribute('type')).toBe('button')
    expect(bouton?.textContent?.trim()).toBe('Voir')
    expect(bouton?.className).toContain('ui-button--primary')
  })

  it('rend un lien avec href et sans attribut type', async () => {
    const doc = analyser(
      await rendre(Button, { props: { href: '#work' }, slots: { default: 'Projets' } }),
    )
    expect(doc.querySelector('a')?.getAttribute('href')).toBe('#work')
    expect(doc.querySelector('button')).toBeNull()
  })

  it('transmet disabled', async () => {
    const doc = analyser(
      await rendre(Button, { props: { disabled: true }, slots: { default: 'x' } }),
    )
    expect(doc.querySelector('button')?.hasAttribute('disabled')).toBe(true)
  })

  it.each(['primary', 'secondary', 'toggle'])(
    'variante %s : aucune violation axe',
    async (variant) => {
      const html = await rendre(Button, { props: { variant }, slots: { default: LONG } })
      expect(await violationsAxe(html)).toEqual([])
    },
  )
})

describe('axe', () => {
  it('détecte un bouton sans nom accessible', async () => {
    const html = await rendre(Button)
    expect(await violationsAxe(html)).toEqual(['button-name : Buttons must have discernible text'])
  })
})

describe('Link', () => {
  it('lien externe : nouvelle fenêtre, rel sécurisé et annonce', async () => {
    const html = await rendre(Link, {
      props: { href: 'https://exemple.test', external: true, announce: '(nouvelle fenêtre)' },
      slots: { default: 'LinkedIn' },
    })
    const lien = analyser(html).querySelector('a')
    expect(lien?.getAttribute('target')).toBe('_blank')
    expect(lien?.getAttribute('rel')).toBe('noopener noreferrer')
    expect(lien?.textContent).toContain('(nouvelle fenêtre)')
    expect(await violationsAxe(html)).toEqual([])
  })

  it('lien de téléchargement : attribut download et annonce', async () => {
    const html = await rendre(Link, {
      props: { href: '/cv.pdf', download: true, announce: '(téléchargement)' },
      slots: { default: 'CV' },
    })
    const lien = analyser(html).querySelector('a')
    expect(lien?.hasAttribute('download')).toBe(true)
    expect(lien?.textContent).toContain('(téléchargement)')
  })

  it('refuse un lien externe sans annonce', async () => {
    await expect(
      rendre(Link, { props: { href: 'https://exemple.test', external: true } }),
    ).rejects.toThrow(/announce/)
  })

  it.each(['navigation', 'footer', 'text'])(
    'variante %s : aucune violation axe',
    async (variant) => {
      const html = await rendre(Link, {
        props: { href: '#work', variant },
        slots: { default: LONG },
      })
      expect(await violationsAxe(html)).toEqual([])
    },
  )

  it('navigation : la barre décorative est masquée aux lecteurs d’écran', async () => {
    const html = await rendre(Link, { props: { href: '#work', variant: 'navigation' } })
    expect(analyser(html).querySelector('.ui-link__bar')?.getAttribute('aria-hidden')).toBe('true')
  })
})

describe('Card', () => {
  it('rend un article avec ses slots et son accent', async () => {
    const html = await rendre(Card, {
      props: { accent: 2 },
      slots: { default: '<h3>Titre</h3>', media: '<img src="x.png" alt="Aperçu" />' },
    })
    const doc = analyser(html)
    expect(doc.querySelector('article.ui-card--accent-2')).not.toBeNull()
    expect(doc.querySelector('h3')?.textContent).toBe('Titre')
    expect(doc.querySelector('img')?.getAttribute('alt')).toBe('Aperçu')
    expect(await violationsAxe(html)).toEqual([])
  })

  it('choisit la balise', async () => {
    const html = await rendre(Card, { props: { as: 'li' }, slots: { default: 'x' } })
    expect(analyser(html).querySelector('.ui-card')?.tagName).toBe('LI')
  })
})

describe.each([
  ['Badge', Badge],
  ['Tag', Tag],
  ['Sticker', Sticker],
])('%s', (_nom, composant) => {
  it('rend le texte du slot sans violation axe', async () => {
    const html = await rendre(composant, { slots: { default: LONG } })
    expect(analyser(html).querySelector('span')?.textContent).toBe(LONG)
    expect(await violationsAxe(html)).toEqual([])
  })
})

describe('SectionTitle', () => {
  it('rend un h2 avec id, mot en valeur et sous-titre', async () => {
    const html = await rendre(SectionTitle, {
      props: { id: 'work-heading' },
      slots: { default: 'Mes', highlight: '<span>projets</span>', subtitle: 'Sélection' },
    })
    const doc = analyser(html)
    expect(doc.querySelector('h2#work-heading')?.textContent).toContain('projets')
    expect(doc.querySelector('p')?.textContent).toBe('Sélection')
    expect(await violationsAxe(html)).toEqual([])
  })

  it('respecte le niveau demandé', async () => {
    const html = await rendre(SectionTitle, { props: { level: 3 }, slots: { default: 'x' } })
    expect(analyser(html).querySelector('h3')).not.toBeNull()
  })
})

describe('Section', () => {
  it('rend une section reliée à son titre', async () => {
    const html = await rendre(Section, {
      props: { id: 'work', labelledby: 'work-heading', width: '5xl' },
      slots: { default: '<h2 id="work-heading">Projets</h2>' },
    })
    const doc = analyser(html)
    expect(doc.querySelector('section#work')?.getAttribute('aria-labelledby')).toBe('work-heading')
    expect(doc.querySelector('.ui-section__inner--5xl')).not.toBeNull()
    expect(await violationsAxe(html)).toEqual([])
  })
})

describe('Select', () => {
  it('déclencheur fermé par défaut', async () => {
    const html = await rendre(Select, {
      props: { controls: 'langues' },
      slots: { default: 'FR', icon: '<svg aria-hidden="true"></svg>' },
    })
    const bouton = analyser(html).querySelector('button')
    expect(bouton?.getAttribute('aria-expanded')).toBe('false')
    expect(bouton?.getAttribute('aria-controls')).toBe('langues')
    expect(bouton?.getAttribute('aria-haspopup')).toBe('listbox')
  })

  it('déclencheur ouvert', async () => {
    const html = await rendre(Select, { props: { expanded: true }, slots: { default: 'FR' } })
    expect(analyser(html).querySelector('button')?.getAttribute('aria-expanded')).toBe('true')
  })
})

describe('props et variantes', () => {
  const cls = async (c: Parameters<typeof rendre>[0], props: Record<string, unknown>) =>
    analyser(await rendre(c, { props, slots: { default: 'x' } })).body.firstElementChild

  it('Button : fullWidth, taille compacte, type submit, toggle sans classe de taille', async () => {
    expect((await cls(Button, { fullWidth: true }))?.hasAttribute('data-full')).toBe(true)
    expect((await cls(Button, {}))?.hasAttribute('data-full')).toBe(false)
    expect((await cls(Button, { size: 'compact' }))?.className).toContain('ui-button--compact')
    expect((await cls(Button, { type: 'submit' }))?.getAttribute('type')).toBe('submit')
    expect((await cls(Button, { variant: 'toggle' }))?.className).not.toContain(
      'ui-button--default',
    )
  })

  it('Select : fullWidth ou embedded donne data-full, embedded donne data-embedded', async () => {
    expect((await cls(Select, { fullWidth: true }))?.hasAttribute('data-full')).toBe(true)
    const incruste = await cls(Select, { embedded: true })
    expect(incruste?.hasAttribute('data-full')).toBe(true)
    expect(incruste?.hasAttribute('data-embedded')).toBe(true)
    expect((await cls(Select, {}))?.hasAttribute('data-full')).toBe(false)
  })

  it('Card : variante, inclinaison, et zone média absente sans slot', async () => {
    const service = await cls(Card, { variant: 'service' })
    expect(service?.className).toContain('ui-card--service')
    expect(service?.querySelector('.ui-card__media')).toBeNull()
    const avecMedia = analyser(
      await rendre(Card, { slots: { default: 'x', media: '<img alt="" src="a.png">' } }),
    )
    expect(avecMedia.querySelector('.ui-card__media img')).not.toBeNull()
  })

  it('Section : ton, gouttière et espacement', async () => {
    const section = await cls(Section, { tone: 'card', gutter: 'narrow', spacing: 'tight-top' })
    expect(section?.className).toContain('ui-section--card')
    expect(section?.className).toContain('ui-section--gutter-narrow')
    expect(section?.className).toContain('ui-section--tight-top')
  })

  it('SectionTitle : mobileSize et sous-titre absent sans slot', async () => {
    const titre = analyser(
      await rendre(SectionTitle, { props: { mobileSize: 'compact' }, slots: { default: 'Titre' } }),
    )
    expect(titre.body.innerHTML).toContain('ui-section-title--compact')
    expect(titre.querySelector('.ui-section-title__subtitle')).toBeNull()
  })

  it('Badge : variante hook', async () => {
    expect((await cls(Badge, { variant: 'hook' }))?.className).toContain('hook')
  })

  it('Link : annonce requise pour un lien externe', async () => {
    await expect(
      rendre(Link, { props: { href: 'https://a.fr', external: true }, slots: { default: 'x' } }),
    ).rejects.toThrow()
  })

  it('SectionTitle : le mot en relief est dans un Sticker, absent sans slot', async () => {
    const avec = analyser(
      await rendre(SectionTitle, { slots: { default: 'Mes ', highlight: 'projets' } }),
    )
    expect(avec.querySelector('h2 .ui-sticker')?.textContent?.trim()).toBe('projets')
    const sans = analyser(await rendre(SectionTitle, { slots: { default: 'Mes projets' } }))
    expect(sans.querySelector('.ui-sticker')).toBeNull()
  })

  it('Select : variante language par défaut, row sur demande', async () => {
    expect((await cls(Select, {}))?.className).toContain('ui-select--language')
    expect((await cls(Select, { variant: 'row' }))?.className).toContain('ui-select--row')
  })
})
