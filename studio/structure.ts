import type { StructureResolver } from 'sanity/structure'

export const SINGLETONS = [
  { type: 'siteSettings', titre: 'Paramètres du Site' },
  { type: 'uiStrings', titre: 'Textes d’interface' },
  { type: 'hero', titre: 'Hero' },
  { type: 'sectionProjets', titre: 'Section Projets (en-tête)' },
  { type: 'sectionParcours', titre: 'Section Parcours' },
  { type: 'sectionCompetences', titre: 'Section Compétences' },
  { type: 'sectionServices', titre: 'Section Services' },
  { type: 'sectionAPropos', titre: 'Section À propos' },
  { type: 'sectionContact', titre: 'Section Contact (en-tête)' },
  { type: 'footer', titre: 'Pied de page' },
] as const

export const structure: StructureResolver = (constructeur) =>
  constructeur
    .list()
    .title('Contenu')
    .items([
      ...SINGLETONS.map(({ type, titre }) =>
        constructeur
          .listItem()
          .title(titre)
          .id(type)
          .child(constructeur.document().schemaType(type).documentId(type)),
      ),
      constructeur
        .listItem()
        .title('Projets')
        .id('project')
        .child(
          constructeur
            .documentTypeList('project')
            .title('Projets')
            .defaultOrdering([{ field: 'ordre', direction: 'asc' }]),
        ),
    ])
