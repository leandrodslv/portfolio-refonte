import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { verifierVariablesIntegration } from './src/integrations/verifier-variables'

export default defineConfig({
  output: 'static',
  site: 'https://leandro-dasilva.com',
  adapter: vercel(),
  integrations: [
    react(),
    sitemap({ filter: (page) => !page.includes('essai-contenu') }),
    verifierVariablesIntegration(),
  ],
  image: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }] },
  security: { csp: true },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        react: 'preact/compat',
        'react-dom': 'preact/compat',
      },
    },
  },
})
