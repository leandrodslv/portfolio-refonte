import { expect, test } from '@playwright/test'

for (const chemin of ['/essai-contenu', '/en/essai-contenu']) {
  test(`la page d’essai ${chemin} n’expose aucune URL du CDN Sanity`, async ({ request }) => {
    const reponse = await request.get(chemin)
    expect(reponse.status()).toBe(200)
    const html = await reponse.text()
    expect(html).not.toContain('cdn.sanity.io')
    expect(html).toContain('noindex')
  })
}
