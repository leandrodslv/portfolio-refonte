import { describe, expect, it } from 'vitest'
import { ErreurContenu, alt, texte, texteOptionnel } from './localiser'

const contexte = { type: 'project', repere: 'belote-kart' }

describe('texte', () => {
  it('renvoie la chaîne de la locale demandée', () => {
    expect(texte({ fr: 'Projets', en: 'Work' }, 'en', contexte, 'titre')).toBe('Work')
    expect(texte({ fr: 'Projets', en: 'Work' }, 'fr', contexte, 'titre')).toBe('Projets')
  })

  it('EN vide : échoue en nommant type, document, champ et langue', () => {
    expect(() => texte({ fr: 'a', en: '' }, 'fr', contexte, 'description')).toThrow(
      'Contenu invalide : project « belote-kart », champ description : valeur EN vide.',
    )
  })

  it('FR en espaces et EN absent : nomme les deux langues', () => {
    expect(() => texte({ fr: '  ' }, 'en', contexte, 'titre')).toThrow('valeur FR et EN vide')
  })

  it('champ absent : échoue', () => {
    expect(() => texte(undefined, 'fr', contexte, 'titre')).toThrow(ErreurContenu)
  })
})

describe('texteOptionnel', () => {
  it('absent ou entièrement vide : undefined', () => {
    expect(texteOptionnel(undefined, 'fr', contexte, 'titreCarte')).toBeUndefined()
    expect(texteOptionnel({ fr: '', en: '' }, 'fr', contexte, 'titreCarte')).toBeUndefined()
  })

  it('à moitié rempli : échoue en nommant la langue manquante', () => {
    expect(() => texteOptionnel({ fr: 'a' }, 'fr', contexte, 'titreCarte')).toThrow(
      'champ titreCarte : valeur EN vide',
    )
  })

  it('complet : renvoie la locale demandée', () => {
    expect(texteOptionnel({ fr: 'a', en: 'b' }, 'en', contexte, 'titreCarte')).toBe('b')
  })
})

describe('alt', () => {
  it('image informative complète', () => {
    expect(alt({ alt: { fr: 'Maquette', en: 'Mockup' } }, 'en', contexte, 'couverture')).toBe(
      'Mockup',
    )
  })

  it('alt EN manquant : échoue en nommant couverture.alt', () => {
    expect(() => alt({ alt: { fr: 'Maquette' } }, 'fr', contexte, 'couverture')).toThrow(
      'champ couverture.alt : valeur EN vide',
    )
  })

  it('alt absent sur image informative : échoue', () => {
    expect(() => alt({}, 'fr', contexte, 'couverture')).toThrow(ErreurContenu)
  })

  it('image décorative : alt vide, même avec un alt résiduel', () => {
    expect(alt({ decorative: true, alt: { fr: 'x', en: 'y' } }, 'fr', contexte, 'c')).toBe('')
    expect(alt({ decorative: true }, 'en', contexte, 'c')).toBe('')
  })
})
