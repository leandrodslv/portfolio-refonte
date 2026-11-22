import { getViteConfig } from 'astro/config'
import { createServer, type Plugin, type ViteDevServer } from 'vite'
import type { Variantes } from '../src/components/ui/kit-types'
import type { Textes } from '../src/fixtures/kit-strings'

const PREFIXE = '\0astro-html:'
const SUFFIXE = '?html'
const SUFFIXE_VARIANTES = '?variants'
const PREFIXE_VARIANTES = '\0astro-variants:'
const LOCALES = ['fr', 'en'] as const

let serveur: Promise<ViteDevServer> | undefined

async function creer(): Promise<ViteDevServer> {
  const config = await getViteConfig({ server: { middlewareMode: true }, appType: 'custom' })({
    command: 'serve',
    mode: 'development',
  })
  return createServer({ ...config, configFile: false, root: process.cwd() })
}

export async function fermerRendu(): Promise<void> {
  const courant = serveur
  serveur = undefined
  if (courant) await (await courant).close().catch(() => undefined)
}

export async function rendreAstro(fichier: string): Promise<string> {
  serveur ??= creer()
  const vite = await serveur
  const { experimental_AstroContainer: AstroContainer } =
    await vite.ssrLoadModule('astro/container')
  const module = await vite.ssrLoadModule(fichier)
  const conteneur = await AstroContainer.create()
  return conteneur.renderToString(module.default)
}

async function collecterStyles(
  vite: ViteDevServer,
  fichier: string,
  vus = new Set<string>(),
): Promise<string> {
  const racine = vite.moduleGraph.getModuleById(fichier)
  if (!racine || vus.has(racine.id ?? fichier)) return ''
  vus.add(racine.id ?? fichier)
  let css = ''
  for (const module of racine.importedModules) {
    if (module.url.includes('type=style')) {
      const resultat = await vite.transformRequest(module.url + '&inline')
      css += resultat?.code ?? ''
    } else if (module.file?.endsWith('.astro') && !module.url.includes('/node_modules/')) {
      css += await collecterStyles(vite, module.file, vus)
    }
  }
  return css
}

type Rendu = Record<(typeof LOCALES)[number], string>

export async function rendreVariantes(fichier: string): Promise<Record<string, Rendu>> {
  serveur ??= creer()
  const vite = await serveur
  const { experimental_AstroContainer: AstroContainer } =
    await vite.ssrLoadModule('astro/container')
  const composant = await vite.ssrLoadModule(fichier)
  const frere = fichier.replace(/\.astro$/, '.variants.ts')
  let definition: Record<string, unknown>
  try {
    definition = await vite.ssrLoadModule(frere)
  } catch (cause) {
    throw new Error(`Fichier de variantes introuvable ou invalide : ${frere}`, { cause })
  }
  const variantes: Variantes = definition['default']
  if (typeof variantes !== 'object' || variantes === null) {
    throw new Error(`Export par défaut absent : ${frere}`)
  }
  const fixture = await vite.ssrLoadModule('/src/fixtures/kit-strings.ts')
  const fabrique: (locale: (typeof LOCALES)[number]) => Textes = fixture['default']
  const conteneur = await AstroContainer.create()
  const styles = await collecterStyles(vite, fichier)
  const rendus: Record<string, Rendu> = {}
  for (const [nom, cas] of Object.entries(variantes)) {
    const [fr, en] = await Promise.all(
      LOCALES.map(async (locale) => {
        const html = await conteneur.renderToString(composant.default, cas(fabrique(locale)))
        return `<style>${styles}</style>${html}`
      }),
    )
    rendus[nom] = { fr: fr ?? '', en: en ?? '' }
  }
  return rendus
}

export function astroHtml(): Plugin {
  return {
    name: 'astro-html',
    enforce: 'pre',
    async resolveId(source, importer) {
      if (source.endsWith('.astro' + SUFFIXE_VARIANTES)) {
        const chemin = source.slice(0, -SUFFIXE_VARIANTES.length)
        const resolu = await this.resolve(chemin, importer, { skipSelf: true })
        if (!resolu) throw new Error(`Composant Astro introuvable : ${chemin}`)
        return PREFIXE_VARIANTES + resolu.id
      }
      if (!source.endsWith('.astro' + SUFFIXE)) return null
      const chemin = source.slice(0, -SUFFIXE.length)
      const resolu = await this.resolve(chemin, importer, { skipSelf: true })
      if (!resolu) throw new Error(`Composant Astro introuvable : ${chemin}`)
      return PREFIXE + resolu.id
    },
    async load(id) {
      if (id.startsWith(PREFIXE_VARIANTES)) {
        const fichier = id.slice(PREFIXE_VARIANTES.length)
        this.addWatchFile(fichier)
        this.addWatchFile(fichier.replace(/\.astro$/, '.variants.ts'))
        this.addWatchFile(`${process.cwd()}/src/fixtures/kit-strings.ts`)
        const rendus = await rendreVariantes(fichier)
        return `export default ${JSON.stringify(rendus)}`
      }
      if (!id.startsWith(PREFIXE)) return null
      const html = await rendreAstro(id.slice(PREFIXE.length))
      return `export default ${JSON.stringify(html)}`
    },
    closeBundle: fermerRendu,
    configureServer(vite) {
      vite.httpServer?.once('close', () => void fermerRendu())
    },
  }
}
