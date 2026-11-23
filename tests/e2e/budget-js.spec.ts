import { brotliCompressSync, constants } from 'node:zlib'
import { expect, test } from '@playwright/test'

const BUDGET_KO = 70
const BUDGET_OCTETS = BUDGET_KO * 1024
const QUALITE_BROTLI = 4

test('le JavaScript transféré (brotli) de la Page d’accueil reste sous 70 Ko @budget', async ({
  page,
}) => {
  const tailles: number[] = []
  page.on('response', async (reponse) => {
    if (reponse.request().resourceType() !== 'script') return
    tailles.push(
      brotliCompressSync(await reponse.body(), {
        params: { [constants.BROTLI_PARAM_QUALITY]: QUALITE_BROTLI },
      }).length,
    )
  })
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.getByRole('navigation')).toBeVisible()
  const enLigne = await page.evaluate(() =>
    [...document.scripts].filter((script) => !script.src).map((script) => script.textContent ?? ''),
  )
  for (const code of enLigne) {
    tailles.push(
      brotliCompressSync(Buffer.from(code), {
        params: { [constants.BROTLI_PARAM_QUALITY]: QUALITE_BROTLI },
      }).length,
    )
  }
  const total = tailles.reduce((somme, taille) => somme + taille, 0)
  expect(tailles.length).toBeGreaterThan(0)
  const poids = `JS initial : ${(total / 1024).toFixed(1)} Ko, budget ${BUDGET_KO} Ko`
  console.log(`${poids} (${tailles.length} fichiers)`)
  expect(total, poids).toBeLessThan(BUDGET_OCTETS)
})
