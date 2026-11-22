import type { Variantes } from './kit-types'

const variantes: Variantes = {
  navigation: (t) => ({
    props: { href: '#projets', variant: 'navigation' },
    slots: { default: t('lien') },
  }),
  pied: (t) => ({ props: { href: '#projets', variant: 'footer' }, slots: { default: t('lien') } }),
  texte: (t) => ({ props: { href: '#projets' }, slots: { default: t('lien') } }),
  externe: (t) => ({
    props: { href: 'https://example.org', external: true, announce: t('annonceExterne') },
    slots: { default: t('lien') },
  }),
  telechargement: (t) => ({
    props: { href: '/cv.pdf', download: true, announce: t('annonceTelechargement') },
    slots: { default: t('lien') },
  }),
  texteLong: (t) => ({ props: { href: '#projets' }, slots: { default: t.long('lien') } }),
}

export default variantes
