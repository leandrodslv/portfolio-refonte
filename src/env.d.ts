/// <reference types="astro/client" />

declare module '*.astro?html' {
  const html: string
  export default html
}
