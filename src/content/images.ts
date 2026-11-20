import type { Contexte } from './localiser'
import { ErreurContenu } from './localiser'

export interface SourceImage {
  source: string
  largeur: number
  hauteur: number
}

const REFERENCE = /^image-([A-Za-z0-9]+)-(\d+)x(\d+)-([a-z0-9]+)$/

export function sourceImage(
  reference: string | undefined,
  projectId: string,
  dataset: string,
  contexte: Contexte,
  champ: string,
): SourceImage {
  const trouve = reference === undefined ? null : REFERENCE.exec(reference)
  if (trouve === null) {
    throw new ErreurContenu(contexte, champ, 'image absente ou référence illisible')
  }
  const [, identifiant, largeur, hauteur, extension] = trouve
  return {
    source: `https://cdn.sanity.io/images/${projectId}/${dataset}/${identifiant}-${largeur}x${hauteur}.${extension}`,
    largeur: Number(largeur),
    hauteur: Number(hauteur),
  }
}
