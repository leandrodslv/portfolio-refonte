import { expect, test } from '@playwright/test'

test('un build sans VERCEL_ENV est noindex : balise et robots.txt', async ({ page, request }) => {
  await page.goto('/')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
  const reponse = await request.get('/robots.txt')
  expect(reponse.headers()['content-type']).toContain('text/plain')
  expect(await reponse.text()).toContain('Disallow: /')
})
