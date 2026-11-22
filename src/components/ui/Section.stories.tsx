import type { Meta, StoryObj } from '@storybook/preact-vite'
import rendus from './Section.astro?variants'
import { casCommuns, histoire } from './stories-kit'

// La matrice répète six fois la même section nommée : l'unicité des repères n'a pas de sens ici.
const meta = {
  title: 'Kit UI/Section',
  parameters: { a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const cas = casCommuns(rendus, 'surface', 'texteLong')

export const Surface: Story = histoire(rendus, 'surface')
export const Carte: Story = histoire(rendus, 'carte')
export const Etroite: Story = histoire(rendus, 'etroite')
export const TexteLong: Story = histoire(rendus, 'texteLong')
export const Bureau: Story = cas.bureau
export const Tablette: Story = cas.tablette
export const TexteLong200: Story = cas.zoom200
export const ContrasteRenforce: Story = cas.contrasteRenforce
export const CouleursForcees: Story = {
  ...cas.couleursForcees,
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'landmark-unique', enabled: false },
          { id: 'color-contrast', enabled: false },
        ],
      },
    },
  },
}
