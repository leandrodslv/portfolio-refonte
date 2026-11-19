import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import process from 'node:process'
import { URL } from 'node:url'
import sirv from 'sirv'

const port = Number(process.env.PORT ?? 4321)
const { headers: regles } = JSON.parse(
  readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'),
)
const entetes = regles.flatMap((regle) => regle.headers)
const statique = sirv('dist', { dev: true })

createServer((requete, reponse) => {
  for (const { key, value } of entetes) reponse.setHeader(key, value)
  statique(requete, reponse)
}).listen(port)
