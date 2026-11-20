import { construireDocuments, type DocumentImport } from './construire'

export function versNdjson(documents: readonly DocumentImport[]): string {
  return documents.map((document) => JSON.stringify(document)).join('\n') + '\n'
}

export function fichiersReferences(documents: readonly DocumentImport[]): string[] {
  const trouves = new Set<string>()
  const parcourir = (valeur: unknown): void => {
    if (Array.isArray(valeur)) {
      valeur.forEach(parcourir)
    } else if (typeof valeur === 'object' && valeur !== null) {
      for (const [cle, element] of Object.entries(valeur)) {
        if (cle === '_sanityAsset' && typeof element === 'string') {
          trouves.add(decodeURIComponent(new URL(element.replace(/^image@/, '')).pathname))
        } else {
          parcourir(element)
        }
      }
    }
  }
  documents.forEach(parcourir)
  return [...trouves].sort()
}

export { construireDocuments }
