import documentTemplate from './compiled-document.json';
import routes from './routes.json';

export const portfolioRoutes = routes;
const escape = (value: string) => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');

/** The approved WebGL/DOM composition is delivered directly, without an iframe or hydration race. */
export function renderPortfolio(view: string): string | null {
  const route = routes.find((item) => item.view === view);
  if (!route || route.native) return null;
  let html = documentTemplate
    .replaceAll('__PAGE_TITLE__', escape(route.title))
    .replaceAll('__PAGE_DESCRIPTION__', escape(route.description))
    .replaceAll('__PAGE_URL__', `https://joshcolecreative.com${route.path}`);
  const setHidden = (tag: string, hidden: boolean) => {
    const visibleTag = tag.replace(/\s+hidden(?=[\s>])/g, '');
    return hidden ? visibleTag.replace(/>$/, ' hidden>') : visibleTag;
  };
  html = html.replace(/<div class="rh-site"[^>]*>/, (tag) => setHidden(tag, view !== 'home'));
  html = html.replace(/<section class="rd-shell"[^>]*>/, (tag) => setHidden(tag, route.type !== 'experiment'));
  html = html.replace(/<main\b[^>]*data-detail="([^"]+)"[^>]*>/g, (tag, name: string) => setHidden(tag, name !== view));
  const caseIds: Record<string, string> = {gprs:'gprs-below-the-surface',einstein:'einstein-case-study'};
  for (const item of routes.filter((item) => item.type === 'case')) {
    const id = caseIds[item.view] ?? `${item.view}-case-study`;
    html = html.replace(new RegExp(`<(?:(?:section)|(?:div))\\b[^>]*id="${id}"[^>]*>`), (tag) => setHidden(tag, item.view !== view));
  }
  if (process.env.VERCEL_ENV === 'production') html = html.replace('</body>', '<script defer src="/_vercel/insights/script.js"></script></body>');
  return html;
}
