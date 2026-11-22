import type { Variantes } from './kit-types'

const variantes: Variantes = {
  defaut: (t) => ({ slots: { default: t('etiquette') } }),
  texteLong: (t) => ({ slots: { default: t.long('etiquette') } }),
}

export default variantes
