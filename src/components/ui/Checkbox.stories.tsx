import type { Meta, StoryObj } from '@storybook/preact-vite'
import rendus from './Checkbox.astro?variants'
import { casCommuns, histoire, interaction } from './stories-kit'

const meta = { title: 'Kit UI/Checkbox' } satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const cas = casCommuns(rendus, 'repos', 'texteLong')
const etats = interaction(rendus, 'repos', 'checkbox')

export const Repos: Story = histoire(rendus, 'repos')
export const Cochee: Story = histoire(rendus, 'cochee')
export const Aide: Story = histoire(rendus, 'aide')
export const Erreur: Story = histoire(rendus, 'erreur')
export const Desactivee: Story = histoire(rendus, 'desactivee')
export const TexteLong: Story = histoire(rendus, 'texteLong')
export const Bureau: Story = cas.bureau
export const Tablette: Story = cas.tablette
export const TexteLong200: Story = cas.zoom200
export const ContrasteRenforce: Story = cas.contrasteRenforce
export const CouleursForcees: Story = cas.couleursForcees
export const Survol: Story = etats.survol
export const Focus: Story = etats.focus
