import { defineField, defineType } from 'sanity'

export const enteteSection = defineType({
  name: 'enteteSection',
  title: 'En-tête de Section',
  type: 'object',
  fields: [
    defineField({ name: 'titre', title: 'Titre', type: 'localizedString' }),
    defineField({
      name: 'titreMisEnAvant',
      title: 'Mot mis en avant (suite du titre)',
      type: 'localizedStringOptionnel',
    }),
    defineField({ name: 'sousTitre', title: 'Sous-titre', type: 'localizedStringOptionnel' }),
  ],
})
