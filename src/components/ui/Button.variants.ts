import type { Variantes } from './kit-types'

const variantes: Variantes = {
  primaire: (t) => ({ slots: { default: t('action') } }),
  secondaire: (t) => ({ props: { variant: 'secondary' }, slots: { default: t('action') } }),
  basculeur: (t) => ({ props: { variant: 'toggle' }, slots: { default: t('selecteur') } }),
  compactSecondaire: (t) => ({
    props: { variant: 'secondary', size: 'compact' },
    slots: { default: t('action') },
  }),
  compact: (t) => ({ props: { size: 'compact' }, slots: { default: t('action') } }),
  pleineLargeur: (t) => ({ props: { fullWidth: true }, slots: { default: t('action') } }),
  lien: (t) => ({ props: { href: '#projets' }, slots: { default: t('action') } }),
  desactive: (t) => ({ props: { disabled: true }, slots: { default: t('action') } }),
  texteLong: (t) => ({ slots: { default: t.long('action') } }),
}

export default variantes
