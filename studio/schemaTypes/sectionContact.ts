import { defineField } from 'sanity'
import { creerSingleton } from './singleton'

export const sectionContact = creerSingleton({
  name: 'sectionContact',
  title: 'Section Contact (en-tête)',
  fields: [defineField({ name: 'entete', title: 'En-tête', type: 'enteteSection' })],
})
