import type { Textes } from '../../fixtures/kit-strings'

export interface Cas {
  props?: Record<string, unknown>
  slots?: Record<string, string>
}

export type Variantes = Record<string, (t: Textes) => Cas>
