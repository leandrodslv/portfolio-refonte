import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'static',
  site: 'https://leandro-dasilva.com',
  adapter: vercel(),
  integrations: [react(), sitemap()],
  security: { csp: true },
  vite: { plugins: [tailwindcss()] },
})
