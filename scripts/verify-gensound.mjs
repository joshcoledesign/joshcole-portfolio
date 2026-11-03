import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium, firefox } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const base = process.env.GENSOUND_BASE_URL || 'http://127.0.0.1:3108';
const output = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../docs');
const results = [];
function wav() {
  const rate = 44100, samples = rate * 2, bytes = Buffer.alloc(44 + samples * 2);
  bytes.write('RIFF'); bytes.writeUInt32LE(bytes.length - 8, 4); bytes.write('WAVEfmt ', 8);
  bytes.writeUInt32LE(16, 16); bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(1, 22);
  bytes.writeUInt32LE(rate, 24); bytes.writeUInt32LE(rate * 2, 28); bytes.writeUInt16LE(2, 32);
  bytes.writeUInt16LE(16, 34); bytes.write('data', 36); bytes.writeUInt32LE(samples * 2, 40);
  for (let i = 0; i < samples; i++) bytes.writeInt16LE(Math.round(Math.sin(2 * Math.PI * 440 * i / rate) * 12000), 44 + i * 2);
  return bytes;
}
async function pixels(frame) {
  await frame.locator('#rings').evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  return frame.locator('#rings').evaluate(canvas => {
    const data = canvas.getContext('2d').getImageData(0, 0, 500, 500).data;
    let sum = 0, colored = 0;
    for (let i = 0; i < data.length; i += 4) { sum = (sum + data[i] * 3 + data[i + 1] * 5 + data[i + 2] * 7) >>> 0; if (data[i] || data[i + 1] || data[i + 2]) colored++; }
    return { sum, colored };
  });
}
(async () => {
  for (const [name, engine] of [['chromium', chromium], ['firefox', firefox]]) {
    const browser = await engine.launch({ headless: true });
    try {
      for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
        const context = await browser.newContext({ viewport });
        const page = await context.newPage();
        const errors = [], requests = [], failures = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('request', r => requests.push({ method: r.method(), url: r.url(), type: r.resourceType() }));
        page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) failures.push({ url: r.url(), status: r.status() }); });
        assert.equal((await page.goto(`${base}/experiments/gensound`)).status(), 200);
        const frame = page.frameLocator('iframe');
        await frame.locator('#stats').filter({ hasText: '250,000 windows' }).waitFor();
        assert.match(await page.title(), /genSound/);
        assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://joshcolecreative.com/experiments/gensound');
        assert.match(await page.locator('main > p').first().innerText(), /Kevin MacLeod/);
        const checks = [];
        for (const track of ['beethoven-symphony-8-finale', 'chopin-nocturne-op9-no2', 'macleod-hitman']) {
          await frame.locator('#track').selectOption(track);
          await frame.locator('#stats').filter({ hasText: `${track} ·` }).waitFor();
          const rendered = await pixels(frame); assert.ok(rendered.colored > 10000);
          checks.push({ track, ...rendered });
        }
        assert.equal(new Set(checks.map(x => x.sum)).size, 3);
        const before = await pixels(frame);
        await frame.locator('#presets button').last().click();
        assert.notEqual((await pixels(frame)).sum, before.sum);
        await frame.locator('#add-stop').click();
        assert.ok(await frame.locator('#stops input').count() >= 2);
        await frame.locator('#blend-smooth').click();
        assert.equal(await frame.locator('#blend-smooth').getAttribute('aria-pressed'), 'true');
        await frame.locator('#copy').click();
        await frame.locator('#copy').filter({ hasText: /Copied|Selected/ }).waitFor();
        const fullscreen = [];
        for (const layout of ['rings', 'hilbert']) {
          await frame.locator(`[data-view="${layout}"]`).click();
          await frame.locator('#viewer').waitFor({ state: 'visible' });
          fullscreen.push(await frame.locator('#viewer').evaluate(async el => {
            const doc = el.ownerDocument;
            if (doc.fullscreenElement !== el) await new Promise(resolve => {
              const done = () => { doc.removeEventListener('fullscreenchange', done); resolve(); };
              doc.addEventListener('fullscreenchange', done, { once: true });
              setTimeout(done, 1500);
            });
            return { layout: el.querySelector('span').textContent, native: doc.fullscreenElement === el };
          }));
          await frame.locator('#viewer-close').click();
          await frame.locator('#viewer').waitFor({ state: 'hidden' });
        }
        if (name === 'chromium') {
          await frame.locator('#track').selectOption('chopin-nocturne-op9-no2');
          await frame.locator('#stats').filter({ hasText: 'chopin-nocturne-op9-no2 ·' }).waitFor();
          await frame.locator('#presets button').first().click();
          await pixels(frame);
          await page.screenshot({ path: `${output}/gensound-${viewport.width}.png`, fullPage: true });
        }
        const requestStart = requests.length;
        await frame.locator('#file').setInputFiles({ name: 'local-tone.wav', mimeType: 'audio/wav', buffer: wav() });
        await frame.locator('#upload-status').filter({ hasText: 'Done. local-tone was analyzed' }).waitFor({ timeout: 60000 });
        assert.equal(await frame.locator('#track').inputValue(), 'file:local-tone');
        assert.ok((await pixels(frame)).colored > 10000);
        const analysisRequests = requests.slice(requestStart).filter(r => r.url.startsWith(`${base}/experiments/gensound/`));
        assert.ok(analysisRequests.some(r => r.url.endsWith('/analyzer.js')));
        assert.ok(analysisRequests.every(r => r.method === 'GET' && r.url.endsWith('/analyzer.js')));
        await frame.locator('#file').setInputFiles({ name: 'broken.wav', mimeType: 'audio/wav', buffer: Buffer.from('not audio') });
        await frame.locator('#upload-status').filter({ hasText: 'could not read broken.wav' }).waitFor();
        assert.equal(await frame.locator('#file').isEnabled(), true);
        const layout = await page.locator('iframe').evaluate(el => ({ outerOverflow: document.documentElement.scrollWidth > innerWidth, frameWidth: el.clientWidth, innerOverflow: el.contentDocument.documentElement.scrollWidth > el.clientWidth, contentHeight: el.contentDocument.querySelector('.app').offsetHeight, height: el.clientHeight }));
        assert.equal(layout.outerOverflow, false, JSON.stringify(layout));
        assert.equal(layout.innerOverflow, false, JSON.stringify(layout));
        assert.ok(layout.height >= layout.contentHeight);
        await page.setViewportSize({ width: 390, height: 844 });
        await frame.locator('.app').evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        const phoneHeight = await page.locator('iframe').evaluate(el => el.clientHeight);
        await page.setViewportSize({ width: 1440, height: 900 });
        await frame.locator('.app').evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        const desktopHeight = await page.locator('iframe').evaluate(el => el.clientHeight);
        assert.ok(phoneHeight > desktopHeight, `${phoneHeight} should exceed ${desktopHeight}`);
        const appFailures = failures.filter(r => !r.url.endsWith('/_vercel/insights/script.js'));
        assert.deepEqual(appFailures, []); assert.deepEqual(errors, []);
        results.push({ engine: name, viewport, examples: checks, localWavAnalysis: 'passed', analysisRequests, invalidAudioRecovery: 'passed', presetsPaletteBlendCopy: 'passed', fullScreenBothLayouts: fullscreen, resize: { phoneHeight, desktopHeight }, layout, errors, failures });
        console.log(`${name} ${viewport.width}: passed`);
        await context.close();
      }
    } finally { await browser.close(); }
  }
  const home = await fetch(base).then(r => r.text()); assert.ok(home.includes('href="/experiments/gensound"'));
  const sitemap = await fetch(`${base}/sitemap.xml`).then(r => r.text()); assert.ok(sitemap.includes('/experiments/gensound'));
  const verifiedAt = new Date().toISOString();
  const snapshot = JSON.parse(await fs.readFile(path.resolve(output, '../public/experiments/gensound/snapshot.json'), 'utf8'));
  await fs.writeFile(`${output}/gensound-verification-${verifiedAt.slice(0, 10)}.json`, JSON.stringify({ verifiedAt, sourceRevision: snapshot.sourceRevision, baseUrl: base, results, homepageLink: 'passed', sitemap: 'passed', safari: 'Not tested: Safari and WebKit runtime unavailable on this Windows machine.', limitations: ['Phone widths are desktop-browser viewport tests, not physical-device tests.', 'WAV tested; other upload codecs not tested.'] }, null, 2) + '\n');
})().catch(e => { console.error(e); process.exitCode = 1; });
