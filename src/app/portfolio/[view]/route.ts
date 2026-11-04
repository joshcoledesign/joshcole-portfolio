import { renderPortfolio } from '@/portfolio/render';

export async function GET(_request: Request, context: { params: Promise<{view: string}> }) {
  const {view} = await context.params;
  const html = renderPortfolio(view);
  if (!html) return new Response('Not found', {status:404});
  return new Response(html, {headers:{
    'Content-Type':'text/html; charset=utf-8',
    'Cache-Control':'public, max-age=0, must-revalidate',
    'X-Content-Type-Options':'nosniff',
    'Referrer-Policy':'strict-origin-when-cross-origin',
    'Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; frame-src 'self'; worker-src 'self' blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'",
  }});
}
