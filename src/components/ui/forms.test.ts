import { describe, expect, it } from 'vitest'
import Checkbox from './Checkbox.astro'
import Field from './Field.astro'
import FieldMessage from './FieldMessage.astro'
import { analyser, rendre, violationsAxe } from './rendu'

const LONG = 'Texte nettement plus long que la version française de référence pour le contrôle'
const base = { id: 'nom', label: 'Nom', errorPrefix: 'Erreur :' }

describe('Field', () => {
  it('associe une étiquette visible au champ', async () => {
    const doc = analyser(await rendre(Field, { props: base }))
    expect(doc.querySelector('label')?.getAttribute('for')).toBe('nom')
    expect(doc.querySelector('input')?.id).toBe('nom')
    expect(doc.querySelector('label')?.textContent).toBe('Nom')
  })

  it('relie aide et erreur par aria-describedby, erreur dans une région aria-live', async () => {
    const doc = analyser(
      await rendre(Field, {
        props: { ...base, help: 'Prénom et nom', error: 'Champ requis', errorPrefix: 'Erreur :' },
      }),
    )
    const champ = doc.querySelector('input')
    expect(champ?.getAttribute('aria-describedby')).toBe('nom-help nom-error')
    expect(champ?.getAttribute('aria-invalid')).toBe('true')
    const region = doc.getElementById('nom-error')
    expect(region?.getAttribute('aria-live')).toBe('polite')
    expect(region?.textContent).toContain('Erreur :')
    expect(region?.textContent).toContain('Champ requis')
    expect(doc.getElementById('nom-help')?.textContent).toContain('Prénom et nom')
  })

  it('sans erreur : région aria-live présente mais vide, aucun aria-invalid', async () => {
    const doc = analyser(await rendre(Field, { props: base }))
    const region = doc.getElementById('nom-error')
    expect(region?.getAttribute('aria-live')).toBe('polite')
    expect(region?.textContent?.trim()).toBe('')
    expect(doc.querySelector('input')?.hasAttribute('aria-invalid')).toBe(false)
    expect(doc.querySelector('input')?.hasAttribute('aria-describedby')).toBe(false)
  })

  it('rend une zone de texte avec multiline', async () => {
    const doc = analyser(await rendre(Field, { props: { ...base, multiline: true, rows: 6 } }))
    expect(doc.querySelector('textarea')?.getAttribute('rows')).toBe('6')
    expect(doc.querySelector('input')).toBeNull()
  })

  it('transmet type e-mail, required et disabled', async () => {
    const doc = analyser(
      await rendre(Field, { props: { ...base, type: 'email', required: true, disabled: true } }),
    )
    const champ = doc.querySelector('input')
    expect(champ?.getAttribute('type')).toBe('email')
    expect(champ?.hasAttribute('required')).toBe(true)
    expect(champ?.hasAttribute('disabled')).toBe(true)
  })

  it.each([
    ['repos', {}],
    ['erreur', { error: 'Requis', errorPrefix: 'Erreur :', help: 'Aide' }],
    ['désactivé', { disabled: true }],
    ['zone de texte', { multiline: true }],
    ['texte long', { label: LONG, help: LONG, error: LONG, errorPrefix: 'Erreur :' }],
  ])('%s : aucune violation axe', async (_nom, props) => {
    expect(await violationsAxe(await rendre(Field, { props: { ...base, ...props } }))).toEqual([])
  })
})

describe('Checkbox', () => {
  const props = { id: 'rgpd', label: 'J’accepte', errorPrefix: 'Erreur :' }

  it('associe l’étiquette et relie l’erreur', async () => {
    const doc = analyser(
      await rendre(Checkbox, { props: { ...props, error: 'À cocher', errorPrefix: 'Erreur :' } }),
    )
    const champ = doc.querySelector('input')
    expect(champ?.getAttribute('type')).toBe('checkbox')
    expect(doc.querySelector('label')?.getAttribute('for')).toBe('rgpd')
    expect(champ?.getAttribute('aria-describedby')).toBe('rgpd-error')
    expect(doc.getElementById('rgpd-error')?.getAttribute('aria-live')).toBe('polite')
  })

  it.each([
    ['repos', {}],
    ['cochée', { checked: true }],
    ['erreur', { error: 'À cocher', errorPrefix: 'Erreur :' }],
    ['désactivée', { disabled: true }],
    ['texte long', { label: LONG, help: LONG }],
  ])('%s : aucune violation axe', async (_nom, extra) => {
    expect(await violationsAxe(await rendre(Checkbox, { props: { ...props, ...extra } }))).toEqual(
      [],
    )
  })
})

describe('FieldMessage', () => {
  it('aide : paragraphe absent sans contenu', async () => {
    const doc = analyser(await rendre(FieldMessage, { props: { id: 'a', kind: 'help' } }))
    expect(doc.getElementById('a')).toBeNull()
  })

  it('erreur : région aria-live avec préfixe', async () => {
    const doc = analyser(
      await rendre(FieldMessage, {
        props: { id: 'e', kind: 'error', prefix: 'Erreur :' },
        slots: { default: 'Requis' },
      }),
    )
    expect(doc.getElementById('e')?.getAttribute('aria-live')).toBe('polite')
    expect(doc.getElementById('e')?.textContent).toContain('Erreur : Requis')
  })
})

describe('régressions de revue', () => {
  it('Field sans erreur : aucun préfixe affiché malgré errorPrefix', async () => {
    const doc = analyser(await rendre(Field, { props: base }))
    expect(doc.getElementById('nom-error')?.textContent?.trim()).toBe('')
    expect(doc.querySelector('.ui-field-message__prefix')).toBeNull()
  })

  it('Checkbox sans erreur : aucun préfixe, région aria-live présente', async () => {
    const doc = analyser(
      await rendre(Checkbox, { props: { id: 'c', label: 'x', errorPrefix: 'Erreur :' } }),
    )
    expect(doc.getElementById('c-error')?.textContent?.trim()).toBe('')
    expect(doc.getElementById('c-error')?.getAttribute('aria-live')).toBe('polite')
  })

  it('Checkbox : checked, disabled, required, aide et erreur reliées', async () => {
    const doc = analyser(
      await rendre(Checkbox, {
        props: {
          id: 'c',
          label: 'x',
          errorPrefix: 'Erreur :',
          checked: true,
          disabled: true,
          required: true,
          help: 'Aide',
          error: 'Requis',
        },
      }),
    )
    const champ = doc.querySelector('input')
    expect(champ?.hasAttribute('checked')).toBe(true)
    expect(champ?.hasAttribute('disabled')).toBe(true)
    expect(champ?.hasAttribute('required')).toBe(true)
    expect(champ?.getAttribute('aria-describedby')).toBe('c-help c-error')
  })

  it('Field désactivé conserve son aide', async () => {
    const doc = analyser(await rendre(Field, { props: { ...base, disabled: true, help: 'Aide' } }))
    expect(doc.getElementById('nom-help')?.textContent).toContain('Aide')
    expect(doc.querySelector('input')?.getAttribute('aria-describedby')).toBe('nom-help')
  })

  it('un attribut de l’appelant n’écrase pas la liaison aria-describedby', async () => {
    const doc = analyser(
      await rendre(Field, { props: { ...base, help: 'Aide', 'aria-describedby': 'autre' } }),
    )
    expect(doc.querySelector('input')?.getAttribute('aria-describedby')).toBe('nom-help')
  })

  it('marque d’obligation fournie par prop et autocomplete transmis', async () => {
    const doc = analyser(
      await rendre(Field, {
        props: { ...base, required: true, requiredMark: '(obligatoire)', autocomplete: 'email' },
      }),
    )
    expect(doc.querySelector('label')?.textContent).toContain('(obligatoire)')
    expect(doc.querySelector('input')?.getAttribute('autocomplete')).toBe('email')
  })
})
