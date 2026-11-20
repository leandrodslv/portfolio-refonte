import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import console from 'node:console'
import { createServer } from 'vite'

const racine = resolve(import.meta.dirname, '..')
const cible = resolve(racine, 'src', 'migration', 'ancien.json')
const verifier = process.argv.includes('--verifier')

const serveur = await createServer({
  root: racine,
  appType: 'custom',
  server: { middlewareMode: true },
  logLevel: 'error',
})

let code = 0
try {
  const { getSafeTranslation } = await serveur.ssrLoadModule(
    '/ancien-portfolio/src/data/content.js',
  )
  const { lireLangue, lireIndex } = await serveur.ssrLoadModule('/src/migration/ancien.ts')
  const html = readFileSync(resolve(racine, 'ancien-portfolio', 'index.html'), 'utf8')
  const extraction = {
    fr: lireLangue('fr', getSafeTranslation('fr')),
    en: lireLangue('en', getSafeTranslation('en')),
    index: lireIndex(html),
  }
  const contenu = JSON.stringify(extraction, null, 2) + '\n'
  if (verifier) {
    const actuel = readFileSync(cible, 'utf8')
    if (JSON.stringify(JSON.parse(actuel)) !== JSON.stringify(extraction)) {
      console.error(
        'src/migration/ancien.json ne correspond plus à ancien-portfolio/. Lancer npm run extraire:ancien.',
      )
      code = 1
    }
  } else {
    writeFileSync(cible, contenu)
    console.log(`Extraction écrite : ${cible}`)
  }
} finally {
  await serveur.close()
}
process.exit(code)
