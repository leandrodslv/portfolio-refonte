import type { Meta, StoryObj } from '@storybook/preact-vite'
import rendus from './Tag.astro?variants'
import { casCommuns, histoire } from './stories-kit'

const meta = { title: 'Kit UI/Tag' } satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const cas = casCommuns(rendus, 'defaut', 'texteLong')

export const Defaut: Story = histoire(rendus, 'defaut')
export const TexteLong: Story = histoire(rendus, 'texteLong')
export const Bureau: Story = cas.bureau
export const Tablette: Story = cas.tablette
export const TexteLong200: Story = cas.zoom200
export const ContrasteRenforce: Story = cas.contrasteRenforce
export const CouleursForcees: Story = cas.couleursForcees
