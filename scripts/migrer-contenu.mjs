import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import console from 'node:console'
import { createServer } from 'vite'

const racine = resolve(import.meta.dirname, '..')
const racinePublic = resolve(racine, 'ancien-portfolio', 'public')
const sortie = resolve(racine, 'migration-sortie', 'contenu.ndjson')

const serveur = await createServer({
  root: racine,
  appType: 'custom',
  server: { middlewareMode: true },
  logLevel: 'error',
})

try {
  const { construireDocuments, versNdjson, fichiersReferences } = await serveur.ssrLoadModule(
    '/src/migration/sortie.ts',
  )
  const documents = construireDocuments(racinePublic)
  mkdirSync(resolve(sortie, '..'), { recursive: true })
  writeFileSync(sortie, versNdjson(documents))
  console.log(
    `${documents.length} documents, ${fichiersReferences(documents).length} images : ${sortie}`,
  )
} finally {
  await serveur.close()
}
process.exit(0)
