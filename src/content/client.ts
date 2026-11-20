import { createClient, type SanityClient } from '@sanity/client'
import { verifierVariables, type Environnement } from '../lib/variables'

const VERSION_API = '2026-11-01'

export interface Connexion {
  projectId: string
  dataset: string
  client: SanityClient
}

export function creerConnexion(
  env: Environnement,
  fabrique: typeof createClient = createClient,
): Connexion {
  verifierVariables(env, ['sanity'])
  const projectId = env.SANITY_PROJECT_ID ?? ''
  const dataset = env.SANITY_DATASET ?? ''
  const client = fabrique({
    projectId,
    dataset,
    token: env.SANITY_READ_TOKEN,
    apiVersion: VERSION_API,
    useCdn: false,
    perspective: 'published',
  })
  return { projectId, dataset, client }
}
