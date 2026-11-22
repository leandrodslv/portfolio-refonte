import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 320, height: 640 }, hasTouch: true })

const BALISES = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

test('la Page d’accueil se reflue à 320 px sans défilement horizontal (WCAG 1.4.10)', async ({
  page,
}) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const { defilement, visible } = await page.evaluate(() => ({
    defilement: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    visible: window.innerWidth,
  }))
  expect(visible).toBe(320)
  expect(defilement).toBeLessThanOrEqual(0)
})

test('la Page d’accueil laisse le zoom du navigateur actif (WCAG 1.4.4)', async ({ page }) => {
  await page.goto('/')
  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content')
  expect(viewport).not.toMatch(/user-scalable\s*=\s*(no|0)/)
  expect(viewport).not.toMatch(/maximum-scale\s*=\s*1(\.0+)?\b/)
})

test('la Page d’accueil n’a aucune violation axe à 320 px, cibles tactiles comprises', async ({
  page,
}) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const { violations } = await new AxeBuilder({ page }).withTags(BALISES).analyze()
  const resume = violations.map(
    (violation) =>
      `${violation.id} (${violation.impact}) : ${violation.nodes.map((noeud) => noeud.target.join(' ')).join(', ')}`,
  )
  expect(resume, resume.join('\n')).toEqual([])
})
