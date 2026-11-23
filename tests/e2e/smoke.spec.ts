import { expect, test } from '@playwright/test'

test('la Page d’accueil s’affiche avec son contenu', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('#work').getByRole('listitem').first()).toBeVisible()
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
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Léandro Da Silva/i)
    await expect(page.locator('#work').getByRole('listitem').first()).toBeVisible()
  })
})

test('le lien d’évitement mène au contenu et chaque lien du menu atteint sa Section', async ({
  page,
}) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const evitement = page.locator('a[href="#contenu"]')
  await expect(evitement).toBeFocused()
  await expect(evitement).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#contenu$/)
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('main')).toBeVisible()
  const liens = page.getByRole('navigation').getByRole('link')
  expect(await liens.count()).toBe(4)
  for (const href of ['#work', '#journey', '#skills', '#contact']) {
    const lien = page.locator(`nav a[href$="${href}"]`)
    await lien.click()
    await expect(page.locator(href)).toBeInViewport()
  }
})

test('sur mobile, le menu s’ouvre et se ferme avec Échap, le focus revient au bouton', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  const bouton = page.getByRole('button', { name: /menu/i })
  await bouton.focus()
  await page.keyboard.press('Enter')
  await expect(bouton).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('navigation').getByRole('link').first()).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(bouton).toHaveAttribute('aria-expanded', 'false')
  await expect(bouton).toBeFocused()
})
