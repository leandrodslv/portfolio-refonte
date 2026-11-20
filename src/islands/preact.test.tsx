import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { renderToString } from 'preact-render-to-string'
import * as compat from 'preact/compat'
import * as react from 'react'
import { preactAlias } from '../../config/preact-alias.mjs'
import { Compteur } from './Compteur'
import { StatusMessage } from './StatusMessage'

const lire = (chemin: string) => readFileSync(new URL(`../../${chemin}`, import.meta.url), 'utf8')

describe('alias Preact partagé', () => {
  it('résout react vers preact/compat dans les tests', () => {
    expect(react.useState).toBe(compat.useState)
  })

  it('déclare react et react-dom vers preact/compat dans la source unique', () => {
    expect(preactAlias).toEqual({ react: 'preact/compat', 'react-dom': 'preact/compat' })
  })

  it('aligne tsconfig.json sur la source unique', () => {
    const tsconfig = JSON.parse(lire('tsconfig.json')) as {
      compilerOptions: { jsxImportSource: string; paths: Record<string, string[]> }
    }
    expect(tsconfig.compilerOptions.jsxImportSource).toBe('preact')
    for (const nom of Object.keys(preactAlias)) {
      expect(tsconfig.compilerOptions.paths[nom]).toEqual(['./node_modules/preact/compat'])
    }
  })

  it('branche Storybook sur Preact et sur la source unique', () => {
    const main = lire('.storybook/main.ts')
    expect(main).toContain("framework: '@storybook/preact-vite'")
    expect(main).toContain('preactAlias')
    expect(main).not.toContain('@storybook/react-vite')
  })

  it('rend Compteur et StatusMessage avec Preact', () => {
    expect(renderToString(<Compteur label="Clics" />)).toContain('Clics 0')
    expect(renderToString(<StatusMessage kind="error">Échec</StatusMessage>)).toContain(
      'role="alert"',
    )
  })
})
