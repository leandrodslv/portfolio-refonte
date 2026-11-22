import type { Variantes } from './kit-types'

const variantes: Variantes = {
  aide: (t) => ({ props: { id: 'message', kind: 'help' }, slots: { default: t('aide') } }),
  erreur: (t) => ({
    props: { id: 'message', kind: 'error', prefix: t('prefixeErreur') },
    slots: { default: t('erreur') },
  }),
  texteLong: (t) => ({
    props: { id: 'message', kind: 'error', prefix: t('prefixeErreur') },
    slots: { default: t.long('erreur') },
  }),
}

export default variantes
