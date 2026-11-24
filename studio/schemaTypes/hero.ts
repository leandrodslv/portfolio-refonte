import { defineField } from 'sanity'
import { creerSingleton } from './singleton'

export const hero = creerSingleton({
  name: 'hero',
  title: 'Hero',
  fields: [
    defineField({ name: 'badge', title: 'Badge', type: 'localizedString' }),
    defineField({ name: 'titreLigne1', title: 'Titre, ligne 1', type: 'localizedString' }),
    defineField({ name: 'titreLigne2', title: 'Titre, ligne 2', type: 'localizedString' }),
    defineField({ name: 'titreLigne3', title: 'Titre, ligne 3', type: 'localizedString' }),
    defineField({ name: 'sousTitre', title: 'Sous-titre', type: 'localizedText' }),
    defineField({ name: 'boutonPrincipal', title: 'Bouton principal', type: 'localizedString' }),
    defineField({ name: 'boutonSecondaire', title: 'Bouton secondaire', type: 'localizedString' }),
    defineField({
      name: 'altVisuelPop',
      title: 'Texte alternatif du visuel, Thème Pop',
      type: 'localizedString',
    }),
    defineField({
      name: 'altVisuelTerminal',
      title: 'Texte alternatif du visuel, Thème Terminal',
      type: 'localizedString',
    }),
    defineField({
      name: 'altVisuelWireframe',
      title: 'Texte alternatif du visuel, Thème Wireframe',
      type: 'localizedString',
    }),
  ],
})
