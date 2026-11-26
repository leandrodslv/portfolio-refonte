import type { Meta, StoryObj } from '@storybook/preact-vite'
import tokensCss from '../../design-system/tokens.css?raw'
import { textesFondations } from '../fixtures/ui-strings'
import { Fondations } from './Fondations'

const meta = {
  title: 'Fondations/Tokens',
  component: Fondations,
  args: { css: tokensCss, textes: textesFondations.fr },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Fondations>

export default meta
type Story = StoryObj<typeof meta>

export const Francais: Story = {}

export const Anglais: Story = {
  args: { textes: textesFondations.en },
  globals: { locale: 'en' },
}

export const Bureau: Story = {
  globals: { viewport: { value: 'bureau', isRotated: false } },
}
