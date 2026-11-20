import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Paramètres du Site',
  type: 'document',
  fields: [
    defineField({ name: 'nomDuSite', title: 'Nom du Site', type: 'localizedString' }),
    defineField({ name: 'titreParDefaut', title: 'Titre par défaut', type: 'localizedString' }),
    defineField({
      name: 'descriptionParDefaut',
      title: 'Description par défaut',
      type: 'localizedText',
    }),
    defineField({
      name: 'urlLinkedin',
      title: 'Adresse du profil LinkedIn',
      type: 'url',
      validation: (regle) => regle.required().uri({ scheme: ['https'] }),
    }),
  ],
  preview: { prepare: () => ({ title: 'Paramètres du Site' }) },
})
