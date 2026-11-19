import { expect, test } from '@playwright/test'

test('la Page d’accueil s’affiche avec son contenu', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Léandro Da Silva' })).toBeVisible()
})

test('le body applique le fond, la couleur et la police des tokens', async ({ page }) => {
  await page.goto('/')
  const { corps, attendu } = await page.evaluate(() => {
    const lire = (element: Element) => {
      const style = getComputedStyle(element)
      return {
        fond: style.backgroundColor,
        couleur: style.color,
        police: style.fontFamily,
      }
    }
    const sonde = document.createElement('div')
    sonde.style.backgroundColor = 'var(--bg)'
    sonde.style.color = 'var(--text)'
    sonde.style.fontFamily = 'var(--font)'
    document.body.append(sonde)
    const resultat = { corps: lire(document.body), attendu: lire(sonde) }
    sonde.remove()
    return resultat
  })
  expect(corps).toEqual(attendu)
})

test.describe('sans JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('le texte est présent dans le HTML (FR-4)', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Léandro Da Silva')
  })
})
