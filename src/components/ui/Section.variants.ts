import type { Variantes } from './kit-types'

const variantes: Variantes = {
  surface: (t) => ({
    props: { labelledby: 'titre-section' },
    slots: { default: `<h2 id="titre-section">${t('titre')}</h2><p>${t('carteTexte')}</p>` },
  }),
  carte: (t) => ({
    props: { tone: 'card', labelledby: 'titre-section' },
    slots: { default: `<h2 id="titre-section">${t('titre')}</h2><p>${t('carteTexte')}</p>` },
  }),
  etroite: (t) => ({
    props: { width: '5xl', gutter: 'narrow', spacing: 'tight-top', labelledby: 'titre-section' },
    slots: { default: `<h2 id="titre-section">${t('titre')}</h2><p>${t('carteTexte')}</p>` },
  }),
  texteLong: (t) => ({
    props: { labelledby: 'titre-section' },
    slots: {
      default: `<h2 id="titre-section">${t.long('titre')}</h2><p>${t.long('carteTexte')}</p>`,
    },
  }),
}

export default variantes
