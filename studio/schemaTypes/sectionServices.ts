import { defineArrayMember, defineField } from 'sanity'
import { validerAuMoinsUn } from '../lib/sections'
import { creerSingleton } from './singleton'

export const sectionServices = creerSingleton({
  name: 'sectionServices',
  title: 'Section Services',
  fields: [
    defineField({ name: 'entete', title: 'En-tête', type: 'enteteSection' }),
    defineField({
      name: 'services',
      title: 'Services (glisser pour réordonner)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'service',
          title: 'Service',
          fields: [
            defineField({ name: 'titre', title: 'Titre', type: 'localizedString' }),
            defineField({ name: 'description', title: 'Description', type: 'localizedText' }),
          ],
          preview: { select: { titre: 'titre.fr' }, prepare: ({ titre }) => ({ title: titre }) },
        }),
      ],
      validation: (regle) => regle.custom(validerAuMoinsUn),
    }),
  ],
})
