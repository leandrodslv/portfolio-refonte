import { useEditState, useFormValue } from 'sanity'
import type { SlugInputProps } from 'sanity'
import { idPublie } from '../lib/validationProjet'

export function SlugVerrouille(props: SlugInputProps) {
  const id = idPublie(useFormValue(['_id']))
  const { published } = useEditState(id, 'project')
  return props.renderDefault({ ...props, readOnly: props.readOnly || published !== null })
}
