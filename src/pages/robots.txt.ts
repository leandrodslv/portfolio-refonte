import type { APIRoute } from 'astro'
import { contenuRobotsTxt } from '../lib/environnement'

export const GET: APIRoute = () =>
  new Response(contenuRobotsTxt(process.env.VERCEL_ENV), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
