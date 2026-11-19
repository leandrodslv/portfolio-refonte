import { brotliCompressSync, constants } from 'node:zlib'
import { expect, test } from '@playwright/test'

const BUDGET_OCTETS = 70 * 1024
const QUALITE_BROTLI = 4

test('le JavaScript transféré (brotli) de la Page d’accueil reste sous 70 Ko', async ({ page }) => {
  const tailles: number[] = []
  const adresses: string[] = []
  page.on('response', async (reponse) => {
    if (reponse.request().resourceType() !== 'script') return
    adresses.push(reponse.url())
    tailles.push(
      brotliCompressSync(await reponse.body(), {
        params: { [constants.BROTLI_PARAM_QUALITY]: QUALITE_BROTLI },
      }).length,
    )
  })
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.getByRole('button', { name: /compteur/i })).toBeVisible()
  const total = tailles.reduce((somme, taille) => somme + taille, 0)
  expect(tailles.length).toBeGreaterThan(0)
  console.log(`JS brotli : ${(total / 1024).toFixed(1)} Ko sur ${tailles.length} fichiers`)
  expect(total).toBeLessThan(BUDGET_OCTETS)
  expect(adresses.some((adresse) => /\/compat\.[^/]+\.js$/.test(adresse))).toBe(true)
})
