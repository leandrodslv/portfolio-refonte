import type { Variantes } from './kit-types'

const variantes: Variantes = {
  projet: (t) => ({
    slots: {
      media: '<div></div>',
      default: `<h3>${t('carteTitre')}</h3><p>${t('carteTexte')}</p>`,
    },
  }),
  service: (t) => ({
    props: { variant: 'service', accent: 1 },
    slots: { default: `<h3>${t('carteTitre')}</h3><p>${t('carteTexte')}</p>` },
  }),
  accent: (t) => ({
    props: { accent: 3 },
    slots: {
      media: '<div></div>',
      default: `<h3>${t('carteTitre')}</h3><p>${t('carteTexte')}</p>`,
    },
  }),
  serviceBleue: (t) => ({
    props: { variant: 'service', accent: 2 },
    slots: { default: `<h3>${t('carteTitre')}</h3><p>${t('carteTexte')}</p>` },
  }),
  sansMedia: (t) => ({
    slots: { default: `<h3>${t('carteTitre')}</h3><p>${t('carteTexte')}</p>` },
  }),
  texteLong: (t) => ({
    slots: {
      media: '<div></div>',
      default: `<h3>${t.long('carteTitre')}</h3><p>${t.long('carteTexte')}</p>`,
    },
  }),
}

export default variantes
