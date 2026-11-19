import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('la Page d’accueil n’a aucune violation axe (WCAG 2.0 à 2.2, A et AA)', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  const resume = violations.map(
    (violation) =>
      `${violation.id} (${violation.impact}) : ${violation.nodes.map((noeud) => noeud.target.join(' ')).join(', ')}`,
  )
  expect(resume, resume.join('\n')).toEqual([])
})
