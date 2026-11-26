import type { Meta, StoryObj } from '@storybook/preact-vite'
import tokensCss from '../../design-system/tokens.css?raw'
import { textesFondations } from '../fixtures/ui-strings'
import { Fondations } from './Fondations'

const meta = {
  title: 'Fondations/Tokens',
  component: Fondations,
  args: { css: tokensCss, textes: textesFondations.fr },
  parameters: { layout: 'padded' },
  render: (args, { globals }) => (
    <Fondations {...args} textes={textesFondations[globals.locale === 'en' ? 'en' : 'fr']} />
  ),
} satisfies Meta<typeof Fondations>

export default meta
type Story = StoryObj<typeof meta>

export const Francais: Story = {}

export const Anglais: Story = {
  globals: { locale: 'en' },
}

export const Bureau: Story = {
  globals: { viewport: { value: 'bureau', isRotated: false } },
}
