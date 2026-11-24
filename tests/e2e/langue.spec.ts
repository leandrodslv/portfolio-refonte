import { expect, test } from '@playwright/test'

const FR = 'https://leandro-dasilva.com/'
const EN = 'https://leandro-dasilva.com/en/'

test('le sélecteur mène de / à /en/ au clavier', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')
  const navigation = page.getByRole('navigation').first()
  const groupe = page.getByRole('group', { name: 'Langue' })
  await expect(groupe.getByRole('link', { name: 'FR' })).toHaveAttribute('aria-current', 'true')
  await navigation.getByRole('link', { name: 'Contact' }).focus()
  await page.keyboard.press('Tab')
  await expect(groupe.getByRole('link', { name: 'FR' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(groupe.getByRole('link', { name: 'EN' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/en\/$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(
    page.getByRole('group', { name: 'Language' }).getByRole('link', { name: 'EN' }),
  ).toHaveAttribute('aria-current', 'true')
})

for (const [chemin, canonical] of [
  ['/', FR],
  ['/en/', EN],
] as const) {
  test(`${chemin} déclare ses équivalents hreflang sans JavaScript`, async ({ browser }) => {
    const contexte = await browser.newContext({ javaScriptEnabled: false })
    const page = await contexte.newPage()
    await page.goto(chemin)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical)
    await expect(page.locator('link[hreflang="fr"]')).toHaveAttribute('href', FR)
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', EN)
    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', FR)
    await contexte.close()
  })
}

test('/ reste en français quel que soit Accept-Language', async ({ browser }) => {
  const contexte = await browser.newContext({
    locale: 'en-US',
    extraHTTPHeaders: { 'Accept-Language': 'en' },
  })
  const page = await contexte.newPage()
  await page.goto('/')
  await expect(page).toHaveURL(/\/$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr')
  await contexte.close()
})

test('le sitemap porte les alternates fr et en des deux accueils, sans essai-contenu', async ({
  request,
}) => {
  const reponse = await request.get('/sitemap-0.xml')
  expect(reponse.ok()).toBe(true)
  const xml = await reponse.text()
  expect(xml).not.toContain('essai-contenu')
  for (const adresse of [FR, EN]) {
    const bloc = xml.split('<url>').find((u) => u.includes(`<loc>${adresse}</loc>`))
    expect(bloc, adresse).toBeDefined()
    expect(bloc).toMatch(
      /<xhtml:link rel="alternate" hreflang="fr" href="https:\/\/leandro-dasilva\.com\/"/,
    )
    expect(bloc).toMatch(
      /<xhtml:link rel="alternate" hreflang="en" href="https:\/\/leandro-dasilva\.com\/en\/"/,
    )
  }
})
