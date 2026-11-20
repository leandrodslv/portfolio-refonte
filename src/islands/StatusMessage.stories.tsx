import type { Meta, StoryObj } from '@storybook/preact-vite'
import { texte } from '../fixtures/ui-strings'
import { StatusMessage } from './StatusMessage'

const meta = {
  title: 'Islands/StatusMessage',
  component: StatusMessage,
} satisfies Meta<typeof StatusMessage>

export default meta
type Story = StoryObj<typeof meta>

export const SuccesFr: Story = { args: { kind: 'success', children: texte('fr', 'formSucces') } }
export const ErreurFr: Story = {
  args: { kind: 'error', children: texte('fr', 'formErreurEnvoi') },
}
export const SuccesEn: Story = {
  args: { kind: 'success', children: texte('en', 'formSucces') },
  globals: { locale: 'en' },
}
export const ErreurEn: Story = {
  args: { kind: 'error', children: texte('en', 'formErreurEnvoi') },
  globals: { locale: 'en' },
}
