import type { Meta, StoryObj } from '@storybook/preact-vite'
import rendus from './Button.astro?variants'
import { casCommuns, histoire, interaction } from './stories-kit'

// Écart de contraste Terminal conservé par fidélité, consigné dans docs/ajustements-visuels.md (FR-23).
const meta = {
  title: 'Kit UI/Button',
  parameters: { a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const cas = casCommuns(rendus, 'primaire', 'texteLong')
const etats = interaction(rendus, 'primaire', 'button')

export const Primaire: Story = histoire(rendus, 'primaire')
export const Secondaire: Story = histoire(rendus, 'secondaire')
export const Basculeur: Story = histoire(rendus, 'basculeur')
export const CompactSecondaire: Story = histoire(rendus, 'compactSecondaire')
export const Compact: Story = histoire(rendus, 'compact')
export const PleineLargeur: Story = histoire(rendus, 'pleineLargeur')
export const Lien: Story = histoire(rendus, 'lien')
export const Desactive: Story = histoire(rendus, 'desactive')
export const TexteLong: Story = histoire(rendus, 'texteLong')
export const Bureau: Story = cas.bureau
export const Tablette: Story = cas.tablette
export const TexteLong200: Story = cas.zoom200
export const ContrasteRenforce: Story = cas.contrasteRenforce
export const CouleursForcees: Story = cas.couleursForcees
export const Survol: Story = etats.survol
export const Focus: Story = etats.focus
