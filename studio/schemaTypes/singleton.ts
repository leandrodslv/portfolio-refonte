import { defineType } from 'sanity'
import type { FieldDefinition } from 'sanity'

interface DefinitionSingleton {
  name: string
  title: string
  fields: FieldDefinition[]
}

export function creerSingleton({ name, title, fields }: DefinitionSingleton) {
  return defineType({
    name,
    title,
    type: 'document',
    fields,
    preview: { prepare: () => ({ title }) },
  })
}
