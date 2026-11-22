import type { Variantes } from './kit-types'

const variantes: Variantes = {
  categorie: (t) => ({ slots: { default: t('categorie') } }),
  accroche: (t) => ({ props: { variant: 'hook' }, slots: { default: t('accroche') } }),
  texteLong: (t) => ({ slots: { default: t.long('categorie') } }),
}

export default variantes
