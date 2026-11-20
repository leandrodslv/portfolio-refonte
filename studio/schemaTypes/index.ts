import { imageInformative } from './imageInformative'
import { lien } from './lien'
import { localizedString } from './localizedString'
import { localizedStringOptionnel } from './localizedStringOptionnel'
import { localizedText } from './localizedText'
import { localizedTextOptionnel } from './localizedTextOptionnel'
import { creerProject } from './project'
import { siteSettings } from './siteSettings'
import { sousProjet } from './sousProjet'
import { uiStrings } from './uiStrings'

export function creerSchemaTypes({ verrouSlug }: { verrouSlug: boolean }) {
  return [
    localizedString,
    localizedText,
    localizedStringOptionnel,
    localizedTextOptionnel,
    imageInformative,
    lien,
    sousProjet,
    creerProject(verrouSlug),
    siteSettings,
    uiStrings,
  ]
}
