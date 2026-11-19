import { brotliCompressSync } from 'node:zlib'
import { expect, test } from '@playwright/test'

const BUDGET_OCTETS = 70 * 1024

test('le JavaScript transféré (brotli) de la Page d’accueil reste sous 70 Ko', async ({ page }) => {
  const tailles: number[] = []
  page.on('response', async (reponse) => {
    if (reponse.request().resourceType() !== 'script') return
    tailles.push(brotliCompressSync(await reponse.body()).length)
  })
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.getByRole('button', { name: /compteur/i })).toBeVisible()
  const total = tailles.reduce((somme, taille) => somme + taille, 0)
  expect(tailles.length).toBeGreaterThan(0)
  console.log(`JS brotli : ${(total / 1024).toFixed(1)} Ko sur ${tailles.length} fichiers`)
  expect(total).toBeLessThan(BUDGET_OCTETS)
})
