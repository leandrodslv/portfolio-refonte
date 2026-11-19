export type Locale = 'fr' | 'en'

const PROJECTS_SEGMENT: Record<Locale, string> = { fr: 'projets', en: 'projects' }

export function localizedPath(locale: Locale, slug?: string): string {
  const prefix = locale === 'en' ? '/en' : ''
  if (!slug) return `${prefix}/`
  return `${prefix}/${PROJECTS_SEGMENT[locale]}/${slug}`
}
