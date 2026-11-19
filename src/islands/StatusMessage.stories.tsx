import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusMessage } from './StatusMessage'

const meta = {
  title: 'Islands/StatusMessage',
  component: StatusMessage,
} satisfies Meta<typeof StatusMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Succes: Story = { args: { kind: 'success', children: 'Message envoyé.' } }
export const Erreur: Story = {
  args: { kind: 'error', children: 'Le message n’a pas pu être envoyé.' },
}
