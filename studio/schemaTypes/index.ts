import { enteteSection } from './enteteSection'
import { footer } from './footer'
import { hero } from './hero'
import { imageInformative } from './imageInformative'
import { lien } from './lien'
import { localizedString } from './localizedString'
import { localizedStringOptionnel } from './localizedStringOptionnel'
import { localizedText } from './localizedText'
import { localizedTextOptionnel } from './localizedTextOptionnel'
import { creerProject } from './project'
import { sectionAPropos } from './sectionAPropos'
import { sectionCompetences } from './sectionCompetences'
import { sectionContact } from './sectionContact'
import { sectionParcours } from './sectionParcours'
import { sectionProjets } from './sectionProjets'
import { sectionServices } from './sectionServices'
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
    enteteSection,
    creerProject(verrouSlug),
    siteSettings,
    uiStrings,
    hero,
    sectionProjets,
    sectionParcours,
    sectionCompetences,
    sectionServices,
    sectionAPropos,
    sectionContact,
    footer,
  ]
}
