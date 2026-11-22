import type { Meta, StoryObj } from '@storybook/preact-vite'
import rendus from './FieldMessage.astro?variants'
import { casCommuns, histoire } from './stories-kit'

const meta = { title: 'Kit UI/FieldMessage' } satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const cas = casCommuns(rendus, 'aide', 'texteLong')

export const Aide: Story = histoire(rendus, 'aide')
export const Erreur: Story = histoire(rendus, 'erreur')
export const TexteLong: Story = histoire(rendus, 'texteLong')
export const Bureau: Story = cas.bureau
export const Tablette: Story = cas.tablette
export const TexteLong200: Story = cas.zoom200
export const ContrasteRenforce: Story = cas.contrasteRenforce
export const CouleursForcees: Story = cas.couleursForcees
