import { defineField, defineType } from 'sanity'
import { SlugVerrouille } from '../components/SlugVerrouille'
import { ACCENTS, GABARITS, slugifier, validerOrdre, validerSlug } from '../lib/validationProjet'

export function creerProject(verrouSlug: boolean) {
  return defineType({
    name: 'project',
    title: 'Projet',
    type: 'document',
    orderings: [
      { title: 'Ordre d’affichage', name: 'ordre', by: [{ field: 'ordre', direction: 'asc' }] },
    ],
    fields: [
      defineField({ name: 'titre', title: 'Titre', type: 'localizedString' }),
      defineField({
        name: 'slug',
        title: 'Slug (adresse du Projet)',
        type: 'slug',
        description: verrouSlug
          ? 'Verrouillé dès la publication dans l’espace production.'
          : 'Modifiable ici ; verrouillé après la publication dans l’espace production.',
        options: { source: 'titre.fr', slugify: slugifier },
        components: verrouSlug ? { input: SlugVerrouille } : undefined,
        validation: (regle) => regle.required().custom(validerSlug),
      }),
      defineField({
        name: 'template',
        title: 'Gabarit',
        type: 'string',
        options: { list: [...GABARITS], layout: 'radio' },
        initialValue: 'standard',
        validation: (regle) => regle.required(),
      }),
      defineField({
        name: 'titreCarte',
        title: 'Titre de la carte',
        type: 'localizedStringOptionnel',
      }),
      defineField({ name: 'categorie', title: 'Catégorie', type: 'localizedString' }),
      defineField({ name: 'description', title: 'Description courte', type: 'localizedText' }),
      defineField({
        name: 'descriptionDetaillee',
        title: 'Description détaillée (Projets sans défi ni concept)',
        type: 'localizedTextOptionnel',
      }),
      defineField({ name: 'defi', title: 'Le défi', type: 'localizedTextOptionnel' }),
      defineField({ name: 'concept', title: 'Le concept', type: 'localizedTextOptionnel' }),
      defineField({
        name: 'etiquettes',
        title: 'Étiquettes',
        type: 'array',
        of: [{ type: 'localizedString' }],
        validation: (regle) => regle.min(1),
      }),
      defineField({ name: 'liens', title: 'Liens', type: 'array', of: [{ type: 'lien' }] }),
      defineField({ name: 'couverture', title: 'Image de couverture', type: 'imageInformative' }),
      defineField({
        name: 'galerie',
        title: 'Galerie',
        type: 'array',
        of: [{ type: 'imageInformative' }],
      }),
      defineField({
        name: 'sousProjets',
        title: 'Sous-projets',
        type: 'array',
        of: [{ type: 'sousProjet' }],
      }),
      defineField({
        name: 'accent',
        title: 'Couleur d’accent (token)',
        type: 'string',
        options: { list: [...ACCENTS] },
        validation: (regle) => regle.required(),
      }),
      defineField({
        name: 'ordre',
        title: 'Ordre d’affichage',
        type: 'number',
        validation: (regle) => regle.custom(validerOrdre),
      }),
    ],
    preview: {
      select: { titre: 'titre.fr', media: 'couverture.image', sous: 'template' },
      prepare: ({ titre, media, sous }) => ({ title: titre, media, subtitle: sous }),
    },
  })
}
