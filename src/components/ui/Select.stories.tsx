import type { Meta, StoryObj } from '@storybook/preact-vite'
import rendus from './Select.astro?variants'
import { casCommuns, histoire, interaction } from './stories-kit'

// Écart de contraste Terminal conservé par fidélité, consigné dans docs/ajustements-visuels.md (FR-23).
const meta = {
  title: 'Kit UI/Select',
  parameters: { a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const cas = casCommuns(rendus, 'ferme', 'texteLong')
const etats = interaction(rendus, 'ferme', 'button')

export const Ligne: Story = histoire(rendus, 'ligne')
export const Ferme: Story = histoire(rendus, 'ferme')
export const Ouvert: Story = histoire(rendus, 'ouvert')
export const PleineLargeur: Story = histoire(rendus, 'pleineLargeur')
export const Incruste: Story = histoire(rendus, 'incruste')
export const TexteLong: Story = histoire(rendus, 'texteLong')
export const Bureau: Story = cas.bureau
export const Tablette: Story = cas.tablette
export const TexteLong200: Story = cas.zoom200
export const ContrasteRenforce: Story = cas.contrasteRenforce
export const CouleursForcees: Story = cas.couleursForcees
export const Survol: Story = etats.survol
export const Focus: Story = etats.focus
