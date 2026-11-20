import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'
import { SINGLETONS, structure } from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
if (!projectId) {
  throw new Error('SANITY_STUDIO_PROJECT_ID manquant. Voir docs/exploitation.md.')
}

const typesSingleton = new Set<string>(SINGLETONS.map(({ type }) => type))

export default defineConfig({
  name: 'portfolio',
  title: 'Portfolio Léandro Da Silva',
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'dev',
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !typesSingleton.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      typesSingleton.has(schemaType)
        ? actions.filter(({ action }) => action !== 'duplicate' && action !== 'delete')
        : actions,
  },
})
