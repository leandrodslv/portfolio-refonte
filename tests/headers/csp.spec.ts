import { expect, test } from '@playwright/test'

test('la CSP déclare script-src self sans unsafe-inline (AD-11)', async ({ page }) => {
  await page.goto('/')
  const csp = await page
    .locator('meta[http-equiv="content-security-policy"]')
    .getAttribute('content')
  expect(csp).toContain("script-src 'self'")
  expect(csp).not.toContain("'unsafe-inline'")
  expect(csp).not.toContain("'unsafe-eval'")
})

test('la Page d’accueil s’hydrate sans violation CSP', async ({ page }) => {
  const violations: string[] = []
  await page.exposeFunction('signalerViolation', (directive: string) => violations.push(directive))
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (evenement) => {
      void (window as unknown as { signalerViolation: (d: string) => void }).signalerViolation(
        evenement.violatedDirective,
      )
    })
  })
  page.on('console', (message) => {
    if (/content security policy/i.test(message.text())) violations.push(message.text())
  })
  const reponse = await page.goto('/', { waitUntil: 'networkidle' })
  expect(reponse?.headers()['content-security-policy']).toContain("frame-ancestors 'none'")
  const bouton = page.getByRole('button', { name: /compteur/i })
  await expect(bouton).toHaveAttribute('data-hydrate', 'true')
  await bouton.click()
  await expect(bouton).toContainText('1')
  expect(violations).toEqual([])
})
