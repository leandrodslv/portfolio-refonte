import type { Variantes } from './kit-types'

const variantes: Variantes = {
  repos: (t) => ({
    props: { id: 'champ', label: t('etiquetteChamp'), errorPrefix: t('prefixeErreur') },
  }),
  aide: (t) => ({
    props: {
      id: 'champ',
      label: t('etiquetteChamp'),
      help: t('aide'),
      errorPrefix: t('prefixeErreur'),
    },
  }),
  obligatoire: (t) => ({
    props: {
      id: 'champ',
      label: t('etiquetteChamp'),
      required: true,
      requiredMark: t('marqueObligatoire'),
      errorPrefix: t('prefixeErreur'),
    },
  }),
  email: (t) => ({
    props: {
      id: 'champ',
      type: 'email',
      label: t('etiquetteChamp'),
      errorPrefix: t('prefixeErreur'),
    },
  }),
  zoneDeTexte: (t) => ({
    props: {
      id: 'champ',
      multiline: true,
      label: t('etiquetteChamp'),
      errorPrefix: t('prefixeErreur'),
    },
  }),
  erreur: (t) => ({
    props: {
      id: 'champ',
      label: t('etiquetteChamp'),
      help: t('aide'),
      error: t('erreur'),
      errorPrefix: t('prefixeErreur'),
    },
  }),
  desactive: (t) => ({
    props: {
      id: 'champ',
      disabled: true,
      label: t('etiquetteChamp'),
      help: t('aide'),
      errorPrefix: t('prefixeErreur'),
    },
  }),
  texteLong: (t) => ({
    props: {
      id: 'champ',
      label: t.long('etiquetteChamp'),
      help: t.long('aide'),
      error: t.long('erreur'),
      errorPrefix: t('prefixeErreur'),
    },
  }),
}

export default variantes
