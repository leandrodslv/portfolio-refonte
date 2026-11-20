import { defineField, defineType } from 'sanity'

export const lien = defineType({
  name: 'lien',
  title: 'Lien',
  type: 'object',
  fields: [
    defineField({ name: 'libelle', title: 'Libellé', type: 'localizedString' }),
    defineField({
      name: 'url',
      title: 'Adresse',
      type: 'url',
      validation: (regle) => regle.required().uri({ scheme: ['https'] }),
    }),
  ],
  preview: {
    select: { titre: 'libelle.fr', sous: 'url' },
    prepare: ({ titre, sous }) => ({ title: titre, subtitle: sous }),
  },
})
