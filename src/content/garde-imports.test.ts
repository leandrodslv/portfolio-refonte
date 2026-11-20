import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'

async function messages(chemin: string) {
  const eslint = new ESLint()
  const [resultat] = await eslint.lintText(
    "import { createClient } from '@sanity/client'\nvoid createClient\n",
    {
      filePath: chemin,
    },
  )
  return resultat?.messages.map((message) => message.ruleId) ?? []
}

describe('import du client Sanity', () => {
  it('hors src/content/ : no-restricted-imports échoue', async () => {
    expect(await messages('src/lib/intrus.ts')).toContain('no-restricted-imports')
  })

  it('dans src/content/ : autorisé', async () => {
    expect(await messages('src/content/lecture.ts')).not.toContain('no-restricted-imports')
  })
})
