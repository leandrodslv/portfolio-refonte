import type { AstroIntegration } from 'astro'
import { verifierVariables } from '../lib/variables'

export function verifierVariablesIntegration(): AstroIntegration {
  return {
    name: 'verifier-variables',
    hooks: {
      'astro:build:start': () => verifierVariables(process.env),
    },
  }
}
