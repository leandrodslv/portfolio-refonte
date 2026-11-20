import { describe, expect, it } from 'vitest'
import { sourceImage } from './images'

const contexte = { type: 'project', repere: 'belote-kart' }
const reference = 'image-0a1b2c3d4e5f60718293a4b5c6d7e8f901234567-1600x900-webp'

describe('sourceImage', () => {
  it('construit la source et les dimensions depuis la référence', () => {
    expect(sourceImage(reference, 'abc123', 'dev', contexte, 'couverture.image')).toEqual({
      source:
        'https://cdn.sanity.io/images/abc123/dev/0a1b2c3d4e5f60718293a4b5c6d7e8f901234567-1600x900.webp',
      largeur: 1600,
      hauteur: 900,
    })
  })

  it.each([undefined, '', 'file-abc-pdf', 'image-abc-large-webp'])(
    'référence absente ou illisible (%j) : échoue en nommant le champ',
    (valeur) => {
      expect(() => sourceImage(valeur, 'abc123', 'dev', contexte, 'couverture.image')).toThrow(
        'champ couverture.image',
      )
    },
  )
})
