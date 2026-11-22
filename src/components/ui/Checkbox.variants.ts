import type { Variantes } from './kit-types'

const variantes: Variantes = {
  repos: (t) => ({ props: { id: 'case', label: t('caseLabel'), errorPrefix: t('prefixeErreur') } }),
  cochee: (t) => ({
    props: { id: 'case', checked: true, label: t('caseLabel'), errorPrefix: t('prefixeErreur') },
  }),
  aide: (t) => ({
    props: { id: 'case', label: t('caseLabel'), help: t('aide'), errorPrefix: t('prefixeErreur') },
  }),
  erreur: (t) => ({
    props: {
      id: 'case',
      label: t('caseLabel'),
      error: t('erreur'),
      errorPrefix: t('prefixeErreur'),
    },
  }),
  desactivee: (t) => ({
    props: { id: 'case', disabled: true, label: t('caseLabel'), errorPrefix: t('prefixeErreur') },
  }),
  texteLong: (t) => ({
    props: {
      id: 'case',
      label: t.long('caseLabel'),
      help: t.long('aide'),
      error: t.long('erreur'),
      errorPrefix: t('prefixeErreur'),
    },
  }),
}

export default variantes
