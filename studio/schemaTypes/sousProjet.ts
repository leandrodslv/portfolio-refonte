import { defineField, defineType } from 'sanity'

export const sousProjet = defineType({
  name: 'sousProjet',
  title: 'Sous-projet',
  type: 'object',
  fields: [
    defineField({ name: 'titre', title: 'Titre', type: 'localizedString' }),
    defineField({ name: 'defi', title: 'Le défi', type: 'localizedText' }),
    defineField({ name: 'concept', title: 'Le concept', type: 'localizedText' }),
    defineField({
      name: 'etiquettes',
      title: 'Étiquettes',
      type: 'array',
      of: [{ type: 'localizedString' }],
    }),
    defineField({
      name: 'galerie',
      title: 'Galerie',
      type: 'array',
      of: [{ type: 'imageInformative' }],
    }),
    defineField({ name: 'lien', title: 'Lien', type: 'lien' }),
  ],
  preview: { select: { titre: 'titre.fr' }, prepare: ({ titre }) => ({ title: titre }) },
})
