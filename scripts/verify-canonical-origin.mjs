import assert from 'node:assert/strict';
import fs from 'node:fs';

const expectedOrigin = 'https://www.joshcolecreative.com';
const config = JSON.parse(fs.readFileSync(new URL('../src/data/site-origin.json', import.meta.url), 'utf8'));
assert.equal(config.origin, expectedOrigin, 'Match the existing Vercel canonical host');
const base = process.argv[2];
assert.ok(base, 'Usage: node scripts/verify-canonical-origin.mjs <server-origin>');
const origin = new URL(base).origin;
const get = async pathname => {
  const response = await fetch(new URL(pathname, origin), {redirect: 'manual', signal: AbortSignal.timeout(20000)});
  assert.equal(response.status, 200, `${pathname}: must serve directly, not redirect`);
  assert.ok(!/noindex/i.test(response.headers.get('x-robots-tag') ?? ''), `${pathname}: X-Robots-Tag`);
  return response;
};
const xml = await (await get('/sitemap.xml')).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.ok(urls.length >= 20, 'Current public pages must remain in the sitemap');
assert.equal(new Set(urls).size, urls.length, 'No duplicate sitemap entries');
const results = [];
for (const address of urls) {
  const url = new URL(address);
  assert.equal(url.origin, expectedOrigin, `${url.pathname}: sitemap origin`);
  const html = await (await get(url.pathname)).text();
  const canonicals = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)].map(match => match[0].match(/href="([^"]+)"/)?.[1]);
  // The standalone resume historically has no canonical tag; preserve that behavior.
  assert.deepEqual(canonicals, url.pathname === "/resume" ? [] : [address], `${url.pathname}: exact self canonical`);
  assert.ok(!/<meta\b(?=[^>]*name="robots")(?=[^>]*content="[^"]*noindex)[^>]*>/i.test(html), `${url.pathname}: robots meta`);
  for (const meta of html.matchAll(/<meta\b[^>]*>/g)) {
    if (/(?:property|name)="(?:og:url|og:image|twitter:image)"/.test(meta[0])) {
      const value = meta[0].match(/content="([^"]+)"/)?.[1];
      assert.ok(value, `${url.pathname}: empty metadata`);
      assert.equal(new URL(value).origin, expectedOrigin, `${url.pathname}: share metadata origin`);
    }
  }
  results.push(url.pathname);
}
const robots = await (await get('/robots.txt')).text();
assert.ok(robots.includes(`Sitemap: ${expectedOrigin}/sitemap.xml`), 'Robots advertises canonical sitemap');
assert.ok(!robots.includes('https://joshcolecreative.com'), 'No apex sitemap reference');
if (origin === expectedOrigin) {
  for (const pathname of ['/', '/experiments/premise']) {
    const apex = await fetch(`https://joshcolecreative.com${pathname}`, {redirect: 'manual', signal: AbortSignal.timeout(20000)});
    assert.equal(apex.status, 308, 'Keep existing apex redirect policy');
    assert.equal(apex.headers.get('location'), expectedOrigin + pathname);
  }
}
console.log(JSON.stringify({result: 'passed', origin, canonicalOrigin: expectedOrigin, routes: results}));
