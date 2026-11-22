import type { Meta, StoryObj } from '@storybook/preact-vite'
import rendus from './Field.astro?variants'
import { casCommuns, histoire, interaction } from './stories-kit'

const meta = { title: 'Kit UI/Field' } satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const cas = casCommuns(rendus, 'repos', 'texteLong')
const etats = interaction(rendus, 'repos', 'textbox')

export const Repos: Story = histoire(rendus, 'repos')
export const Aide: Story = histoire(rendus, 'aide')
export const Obligatoire: Story = histoire(rendus, 'obligatoire')
export const Email: Story = histoire(rendus, 'email')
export const ZoneDeTexte: Story = histoire(rendus, 'zoneDeTexte')
export const Erreur: Story = histoire(rendus, 'erreur')
export const Desactive: Story = histoire(rendus, 'desactive')
export const TexteLong: Story = histoire(rendus, 'texteLong')
export const Bureau: Story = cas.bureau
export const Tablette: Story = cas.tablette
export const TexteLong200: Story = cas.zoom200
export const ContrasteRenforce: Story = cas.contrasteRenforce
export const CouleursForcees: Story = cas.couleursForcees
export const Survol: Story = etats.survol
export const Focus: Story = etats.focus
