import { defineField, defineType } from 'sanity'
import { CATALOGUE_UI_STRINGS } from '../lib/catalogueUiStrings'

export const uiStrings = defineType({
  name: 'uiStrings',
  title: 'Textes d’interface',
  type: 'document',
  groups: CATALOGUE_UI_STRINGS.map(({ groupe, titre }) => ({ name: groupe, title: titre })),
  fields: CATALOGUE_UI_STRINGS.flatMap(({ groupe, cles }) =>
    cles.map(({ cle, titre, longue }) =>
      defineField({
        name: cle,
        title: titre,
        type: longue ? 'localizedText' : 'localizedString',
        group: groupe,
      }),
    ),
  ),
  preview: { prepare: () => ({ title: 'Textes d’interface' }) },
})
