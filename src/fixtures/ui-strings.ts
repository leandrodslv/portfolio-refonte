import type { LocalizedString, UiStrings } from '../content/types'
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
