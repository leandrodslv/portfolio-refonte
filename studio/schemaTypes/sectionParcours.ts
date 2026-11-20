import { defineArrayMember, defineField } from 'sanity'
import { validerAuMoinsUn } from '../lib/sections'
import { creerSingleton } from './singleton'

export const sectionParcours = creerSingleton({
  name: 'sectionParcours',
  title: 'Section Parcours',
  fields: [
    defineField({ name: 'entete', title: 'En-tête', type: 'enteteSection' }),
    defineField({
      name: 'etapes',
      title: 'Étapes (glisser pour réordonner)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'etape',
          title: 'Étape',
          fields: [
            defineField({ name: 'periode', title: 'Période', type: 'localizedString' }),
            defineField({ name: 'titre', title: 'Titre', type: 'localizedString' }),
            defineField({ name: 'lieu', title: 'Lieu', type: 'localizedString' }),
            defineField({ name: 'description', title: 'Description', type: 'localizedText' }),
          ],
          preview: {
            select: { titre: 'titre.fr', sous: 'periode.fr' },
            prepare: ({ titre, sous }) => ({ title: titre, subtitle: sous }),
          },
        }),
      ],
      validation: (regle) => regle.custom(validerAuMoinsUn),
    }),
  ],
})
