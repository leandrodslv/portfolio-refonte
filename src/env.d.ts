/// <reference types="astro/client" />

declare module '*.astro?html' {
  const html: string
  export default html
}

declare module '*.astro?variants' {
  const rendus: Record<string, { fr: string; en: string }>
  export default rendus
}
