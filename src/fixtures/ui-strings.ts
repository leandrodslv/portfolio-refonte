import type { LocalizedString, UiStrings } from '../content/types'
import type { TextesFondations } from '../fondations/Fondations'
import type { Locale } from '../lib/localizedPath'

type CleStory = 'formSucces' | 'formErreurEnvoi'

function localise(fr: string, en: string): LocalizedString {
  return { _type: 'localizedString', fr, en }
}

export const uiStringsFixture: Required<Pick<UiStrings, CleStory>> = {
  formSucces: localise('Message envoyé.', 'Message sent.'),
  formErreurEnvoi: localise('Le message n’a pas pu être envoyé.', 'The message could not be sent.'),
}

export function texte(locale: Locale, cle: CleStory): string {
  const valeur = uiStringsFixture[cle][locale]
  if (!valeur) throw new Error(`Fixture ${cle} vide pour ${locale}.`)
  return valeur
}

export const textesFondations: Record<Locale, TextesFondations> = {
  fr: {
    titre: 'Fondations',
    intro:
      'Chaque token de design-system/tokens.css, avec sa valeur résolue dans les trois Thèmes.',
    apercuTypo: 'Aa',
    categories: {
      couleur: 'Couleurs',
      ombre: 'Ombres',
      bordure: 'Bordures et rayons',
      duree: 'Durées et courbes',
      espacement: 'Espacements',
      typographie: 'Typographie',
      dimension: 'Dimensions',
      effet: 'Effets et visibilité',
    },
    themes: { pop: 'Pop', terminal: 'Terminal', wireframe: 'Wireframe' },
  },
  en: {
    titre: 'Foundations',
    intro: 'Every token in design-system/tokens.css, with its resolved value in all three Themes.',
    apercuTypo: 'Aa',
    categories: {
      couleur: 'Colours',
      ombre: 'Shadows',
      bordure: 'Borders and radii',
      duree: 'Durations and easings',
      espacement: 'Spacing',
      typographie: 'Typography',
      dimension: 'Sizes',
      effet: 'Effects and visibility',
    },
    themes: { pop: 'Pop', terminal: 'Terminal', wireframe: 'Wireframe' },
  },
}
