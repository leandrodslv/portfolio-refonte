export type Palier = 'sanity' | 'contact'

interface VariableDeclaree {
  nom: string
  palier: Palier
}

export const REGISTRE: readonly VariableDeclaree[] = [
  { nom: 'SANITY_PROJECT_ID', palier: 'sanity' },
  { nom: 'SANITY_DATASET', palier: 'sanity' },
  { nom: 'SANITY_READ_TOKEN', palier: 'sanity' },
  { nom: 'RESEND_API_KEY', palier: 'contact' },
  { nom: 'ALTCHA_HMAC_KEY', palier: 'contact' },
  { nom: 'ALTCHA_HMAC_KEY_SECRET', palier: 'contact' },
]

// Chaque story active son palier : contact en épopée 4.
export const PALIERS_ACTIFS: readonly Palier[] = ['sanity']

export type Environnement = Readonly<Record<string, string | undefined>>

export function variablesManquantes(
  env: Environnement,
  paliers: readonly Palier[] = PALIERS_ACTIFS,
): string[] {
  return REGISTRE.filter(
    ({ nom, palier }) => paliers.includes(palier) && (env[nom] ?? '').trim() === '',
  ).map(({ nom }) => nom)
}

export function verifierVariables(
  env: Environnement,
  paliers: readonly Palier[] = PALIERS_ACTIFS,
): void {
  const manquantes = variablesManquantes(env, paliers)
  if (manquantes.length > 0) {
    throw new Error(
      `Variables d'environnement manquantes ou vides : ${manquantes.join(', ')}. Voir docs/exploitation.md.`,
    )
  }
}
