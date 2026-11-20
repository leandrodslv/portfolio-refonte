import type { StructureResolver } from 'sanity/structure'

export const SINGLETONS = [
  { type: 'siteSettings', titre: 'Paramètres du Site' },
  { type: 'uiStrings', titre: 'Textes d’interface' },
] as const

export const structure: StructureResolver = (constructeur) =>
  constructeur
    .list()
    .title('Contenu')
    .items(
      SINGLETONS.map(({ type, titre }) =>
        constructeur
          .listItem()
          .title(titre)
          .id(type)
          .child(constructeur.document().schemaType(type).documentId(type)),
      ),
    )
