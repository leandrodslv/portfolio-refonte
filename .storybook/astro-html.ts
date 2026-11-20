import { getViteConfig } from 'astro/config'
import { createServer, type Plugin, type ViteDevServer } from 'vite'

const PREFIXE = '\0astro-html:'
const SUFFIXE = '?html'

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

export function astroHtml(): Plugin {
  return {
    name: 'astro-html',
    enforce: 'pre',
    async resolveId(source, importer) {
      if (!source.endsWith('.astro' + SUFFIXE)) return null
      const chemin = source.slice(0, -SUFFIXE.length)
      const resolu = await this.resolve(chemin, importer, { skipSelf: true })
      if (!resolu) throw new Error(`Composant Astro introuvable : ${chemin}`)
      return PREFIXE + resolu.id
    },
    async load(id) {
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
