import { defineField, defineType } from 'sanity'
import { estDecorative } from '../lib/validationProjet'

export const imageInformative = defineType({
  name: 'imageInformative',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (regle) => regle.required(),
    }),
    defineField({
      name: 'decorative',
      title: 'Image décorative (sans texte alternatif)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'alt',
      title: 'Texte alternatif',
      type: 'localizedString',
      hidden: ({ parent }) => estDecorative(parent),
    }),
    defineField({ name: 'titre', title: 'Titre de la création', type: 'localizedStringOptionnel' }),
    defineField({ name: 'categorie', title: 'Catégorie', type: 'localizedStringOptionnel' }),
    defineField({ name: 'logiciel', title: 'Logiciel', type: 'localizedStringOptionnel' }),
    defineField({ name: 'brief', title: 'Brief', type: 'localizedTextOptionnel' }),
    defineField({
      name: 'explication',
      title: 'Explication technique',
      type: 'localizedTextOptionnel',
    }),
    defineField({ name: 'paysage', title: 'Format paysage', type: 'boolean', initialValue: false }),
    defineField({
      name: 'calque',
      title: 'Calque (wireframe affiché en survol)',
      type: 'image',
    }),
  ],
  preview: {
    select: { media: 'image', titre: 'alt.fr' },
    prepare: ({ media, titre }) => ({ media, title: titre ?? 'Image décorative' }),
  },
})
