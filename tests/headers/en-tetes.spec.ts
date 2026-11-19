import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

type Regle = { has?: unknown; headers: { key: string; value: string }[] }

const { headers: regles } = JSON.parse(
  readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'),
) as { headers: Regle[] }

const requis = [
  'Content-Security-Policy',
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'Referrer-Policy',
  'Permissions-Policy',
]

for (const nom of requis) {
  test(`${nom} est servi tel que déclaré dans vercel.json`, async ({ request }) => {
    const declare = regles
      .filter((regle) => !regle.has)
      .flatMap((regle) => regle.headers)
      .find((entete) => entete.key === nom)
    expect(declare, `${nom} absent de vercel.json`).toBeDefined()
    const reponse = await request.get('/')
    expect(reponse.headers()[nom.toLowerCase()]).toBe(declare?.value)
  })
}
