import type { Meta, StoryObj } from '@storybook/preact-vite'
import rendus from './Card.astro?variants'
import { casCommuns, histoire } from './stories-kit'

// Écart de contraste Terminal conservé par fidélité, consigné dans docs/ajustements-visuels.md (FR-23).
const meta = {
  title: 'Kit UI/Card',
  parameters: { a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const cas = casCommuns(rendus, 'projet', 'texteLong')

export const Projet: Story = histoire(rendus, 'projet')
export const Service: Story = histoire(rendus, 'service')
export const Accent: Story = histoire(rendus, 'accent')
export const ServiceBleue: Story = histoire(rendus, 'serviceBleue')
export const SansMedia: Story = histoire(rendus, 'sansMedia')
export const TexteLong: Story = histoire(rendus, 'texteLong')
export const Bureau: Story = cas.bureau
export const Tablette: Story = cas.tablette
export const TexteLong200: Story = cas.zoom200
export const ContrasteRenforce: Story = cas.contrasteRenforce
export const CouleursForcees: Story = cas.couleursForcees
