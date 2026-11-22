import type { Variantes } from './kit-types'

const variantes: Variantes = {
  defaut: (t) => ({ slots: { default: t('autocollant') } }),
  texteLong: (t) => ({ slots: { default: t.long('autocollant') } }),
}

export default variantes
