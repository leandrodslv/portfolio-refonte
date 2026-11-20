import { defineField, defineType } from 'sanity'
import { validerChampLocaliseOptionnel } from '../lib/champLocalise'

export const localizedStringOptionnel = defineType({
  name: 'localizedStringOptionnel',
  title: 'Texte court FR / EN (facultatif)',
  type: 'object',
  fields: [
    defineField({ name: 'fr', title: 'Français', type: 'string' }),
    defineField({ name: 'en', title: 'English', type: 'string' }),
  ],
  validation: (regle) => regle.custom(validerChampLocaliseOptionnel),
})
