import { defineField } from 'sanity'
import { creerSingleton } from './singleton'

export const sectionProjets = creerSingleton({
  name: 'sectionProjets',
  title: 'Section Projets (en-tête)',
  fields: [defineField({ name: 'entete', title: 'En-tête', type: 'enteteSection' })],
})
