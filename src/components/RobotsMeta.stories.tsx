import type { Meta, StoryObj } from '@storybook/preact-vite'
import html from './RobotsMeta.astro?html'

const meta = {
  title: 'Components/RobotsMeta',
  render: () => (
    <pre>
      <code>{html}</code>
    </pre>
  ),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const HorsProduction: Story = {}
