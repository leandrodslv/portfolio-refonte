import { defineField } from 'sanity'
import { creerSingleton } from './singleton'

export const footer = creerSingleton({
  name: 'footer',
  title: 'Pied de page',
  fields: [
    defineField({ name: 'copyright', title: 'Copyright', type: 'localizedString' }),
    defineField({ name: 'indiceKonami', title: 'Indice du Mode fête', type: 'localizedString' }),
    defineField({ name: 'bio', title: 'Bio', type: 'localizedText' }),
    defineField({ name: 'colonneSite', title: 'Colonne « Site Web »', type: 'localizedString' }),
    defineField({ name: 'colonneReseaux', title: 'Colonne « Réseaux »', type: 'localizedString' }),
    defineField({ name: 'colonneContact', title: 'Colonne « Contact »', type: 'localizedString' }),
    defineField({ name: 'disponibilite', title: 'Disponibilité', type: 'localizedString' }),
    defineField({ name: 'signature', title: 'Signature', type: 'localizedString' }),
  ],
})
