import { useEffect, useState } from 'react'

type Props = {
  label: string
}

export function Compteur({ label }: Props) {
  const [valeur, setValeur] = useState(0)
  const [hydrate, setHydrate] = useState(false)

  useEffect(() => setHydrate(true), [])

  return (
    <button
      type="button"
      data-hydrate={hydrate}
      className="border-(length:--border-thick) border-line bg-action px-4 py-2 text-action-ink shadow-card"
      onClick={() => setValeur((v) => v + 1)}
    >
      {label} {valeur}
    </button>
  )
}
