import { defineField } from 'sanity'
import { validerAuMoinsUn } from '../lib/sections'
import { creerSingleton } from './singleton'

export const sectionAPropos = creerSingleton({
  name: 'sectionAPropos',
  title: 'Section À propos',
  fields: [
    defineField({ name: 'entete', title: 'En-tête', type: 'enteteSection' }),
    defineField({ name: 'badge', title: 'Badge', type: 'localizedStringOptionnel' }),
    defineField({
      name: 'paragraphes',
      title: 'Paragraphes (glisser pour réordonner)',
      type: 'array',
      of: [{ type: 'localizedText' }],
      validation: (regle) => regle.custom(validerAuMoinsUn),
    }),
    defineField({
      name: 'libelleCv',
      title: 'Bouton « Télécharger mon CV »',
      type: 'localizedString',
    }),
    defineField({
      name: 'libelleLocalisation',
      title: 'Libellé de la localisation',
      type: 'localizedString',
    }),
    defineField({
      name: 'valeurLocalisation',
      title: 'Valeur de la localisation',
      type: 'localizedString',
    }),
  ],
})
