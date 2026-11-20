import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'dev',
  },
  typegen: {
    path: './**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../src/content/types.ts',
  },
})
