import type { Variantes } from './kit-types'

const variantes: Variantes = {
  ligne: (t) => ({ props: { variant: 'row' }, slots: { default: t('selecteur') } }),
  ferme: (t) => ({ slots: { default: t('selecteur') } }),
  ouvert: (t) => ({ props: { expanded: true }, slots: { default: t('selecteur') } }),
  pleineLargeur: (t) => ({ props: { fullWidth: true }, slots: { default: t('selecteur') } }),
  incruste: (t) => ({ props: { embedded: true }, slots: { default: t('selecteur') } }),
  texteLong: (t) => ({ slots: { default: t.long('selecteur') } }),
}

export default variantes
