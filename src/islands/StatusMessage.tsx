export type StatusKind = 'success' | 'error'

type Props = {
  kind: StatusKind
  children: string
}

export function StatusMessage({ kind, children }: Props) {
  return (
    <p role={kind === 'error' ? 'alert' : 'status'} data-kind={kind}>
      {children}
    </p>
  )
}
