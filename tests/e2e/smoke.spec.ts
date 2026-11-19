import { expect, test } from '@playwright/test'

test('la Page d’accueil s’affiche avec son contenu', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Léandro Da Silva' })).toBeVisible()
})

test.describe('sans JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('le texte est présent dans le HTML (FR-4)', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Léandro Da Silva')
  })
})
