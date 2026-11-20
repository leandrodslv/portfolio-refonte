import { defineArrayMember, defineField } from 'sanity'
import { FAMILLES_COMPETENCE, TEINTES, validerAuMoinsUn } from '../lib/sections'
import { creerSingleton } from './singleton'

export const sectionCompetences = creerSingleton({
  name: 'sectionCompetences',
  title: 'Section Compétences',
  fields: [
    defineField({ name: 'entete', title: 'En-tête', type: 'enteteSection' }),
    defineField({
      name: 'competences',
      title: 'Compétences (glisser pour réordonner)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'competence',
          title: 'Compétence',
          fields: [
            defineField({ name: 'nom', title: 'Nom', type: 'localizedString' }),
            defineField({
              name: 'famille',
              title: 'Famille',
              type: 'string',
              options: { list: [...FAMILLES_COMPETENCE], layout: 'radio' },
              validation: (regle) => regle.required(),
            }),
            defineField({
              name: 'teinte',
              title: 'Teinte',
              type: 'string',
              options: { list: [...TEINTES] },
              validation: (regle) => regle.required(),
            }),
          ],
          preview: {
            select: { titre: 'nom.fr', sous: 'famille' },
            prepare: ({ titre, sous }) => ({ title: titre, subtitle: sous }),
          },
        }),
      ],
      validation: (regle) => regle.custom(validerAuMoinsUn),
    }),
  ],
})
