import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { creerSchemaTypes } from './schemaTypes'
import { SINGLETONS, structure } from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
if (!projectId) {
  throw new Error('SANITY_STUDIO_PROJECT_ID manquant. Voir docs/exploitation.md.')
}

const typesSingleton = new Set<string>(SINGLETONS.map(({ type }) => type))

const espace = (nom: 'dev' | 'production') =>
  defineConfig({
    name: nom,
    title: `Portfolio Léandro Da Silva (${nom})`,
    basePath: `/${nom}`,
    projectId,
    dataset: nom,
    plugins: [structureTool({ structure })],
    schema: {
      types: creerSchemaTypes({ verrouSlug: nom === 'production' }),
      templates: (templates) =>
        templates.filter(({ schemaType }) => !typesSingleton.has(schemaType)),
    },
    document: {
      actions: (actions, { schemaType }) =>
        typesSingleton.has(schemaType)
          ? actions.filter(({ action }) => action !== 'duplicate' && action !== 'delete')
          : actions,
    },
  })

export default [espace('dev'), espace('production')]
