import { defineField } from 'sanity'
import { creerSingleton } from './singleton'

export const sectionContact = creerSingleton({
  name: 'sectionContact',
  title: 'Section Contact (en-tête)',
  fields: [
    defineField({ name: 'entete', title: 'En-tête', type: 'enteteSection' }),
    defineField({
      name: 'libelleLienFormulaire',
      title: 'Lien de repli vers le formulaire (sans JavaScript)',
      type: 'localizedString',
    }),
    defineField({
      name: 'libelleZoneFormulaire',
      title: 'Intitulé accessible de la zone du formulaire',
      type: 'localizedString',
    }),
  ],
})
