import { defineField, defineType } from 'sanity'
import { validerChampLocaliseOptionnel } from '../lib/champLocalise'

export const localizedTextOptionnel = defineType({
  name: 'localizedTextOptionnel',
  title: 'Texte long FR / EN (facultatif)',
  type: 'object',
  fields: [
    defineField({ name: 'fr', title: 'Français', type: 'text', rows: 4 }),
    defineField({ name: 'en', title: 'English', type: 'text', rows: 4 }),
  ],
  validation: (regle) => regle.custom(validerChampLocaliseOptionnel),
})
