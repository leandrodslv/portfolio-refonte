import type { Meta, StoryObj } from '@storybook/preact-vite'
import rendus from './Link.astro?variants'
import { casCommuns, histoire, interaction } from './stories-kit'

const meta = { title: 'Kit UI/Link' } satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const cas = casCommuns(rendus, 'navigation', 'texteLong')
const etats = interaction(rendus, 'navigation', 'link')

export const Navigation: Story = histoire(rendus, 'navigation')
export const Pied: Story = histoire(rendus, 'pied')
export const Texte: Story = histoire(rendus, 'texte')
export const Externe: Story = histoire(rendus, 'externe')
export const Telechargement: Story = histoire(rendus, 'telechargement')
export const TexteLong: Story = histoire(rendus, 'texteLong')
export const Bureau: Story = cas.bureau
export const Tablette: Story = cas.tablette
export const TexteLong200: Story = cas.zoom200
export const ContrasteRenforce: Story = cas.contrasteRenforce
export const CouleursForcees: Story = cas.couleursForcees
export const Survol: Story = etats.survol
export const Focus: Story = etats.focus
