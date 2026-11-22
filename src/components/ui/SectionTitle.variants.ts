import type { Variantes } from './kit-types'

const variantes: Variantes = {
  simple: (t) => ({ slots: { default: t('titre') } }),
  enRelief: (t) => ({ slots: { default: `${t('titre')} `, highlight: t('surbrillance') } }),
  avecSousTitre: (t) => ({ slots: { default: t('titre'), subtitle: t('sousTitre') } }),
  compact: (t) => ({ props: { mobileSize: 'compact' }, slots: { default: t('titre') } }),
  niveau1: (t) => ({ props: { level: 1 }, slots: { default: t('titre') } }),
  texteLong: (t) => ({
    slots: {
      default: t.long('titre'),
      highlight: t.long('surbrillance'),
      subtitle: t.long('sousTitre'),
    },
  }),
}

export default variantes
