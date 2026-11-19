export type EnvironnementVercel = string | undefined

export function estProduction(env: EnvironnementVercel): boolean {
  return env === 'production'
}

export function directiveRobots(env: EnvironnementVercel): string | null {
  return estProduction(env) ? null : 'noindex'
}

export function contenuRobotsTxt(env: EnvironnementVercel): string {
  return estProduction(env) ? 'User-agent: *\nAllow: /\n' : 'User-agent: *\nDisallow: /\n'
}
