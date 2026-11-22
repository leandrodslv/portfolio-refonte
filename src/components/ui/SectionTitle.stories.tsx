import type { Meta, StoryObj } from '@storybook/preact-vite'
import rendus from './SectionTitle.astro?variants'
import { casCommuns, histoire } from './stories-kit'

const meta = { title: 'Kit UI/SectionTitle' } satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const cas = casCommuns(rendus, 'simple', 'texteLong')

export const Simple: Story = histoire(rendus, 'simple')
export const EnRelief: Story = histoire(rendus, 'enRelief')
export const AvecSousTitre: Story = histoire(rendus, 'avecSousTitre')
export const Compact: Story = histoire(rendus, 'compact')
export const Niveau1: Story = histoire(rendus, 'niveau1')
export const TexteLong: Story = histoire(rendus, 'texteLong')
export const Bureau: Story = cas.bureau
export const Tablette: Story = cas.tablette
export const TexteLong200: Story = cas.zoom200
export const ContrasteRenforce: Story = cas.contrasteRenforce
export const CouleursForcees: Story = cas.couleursForcees
