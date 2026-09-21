const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
require('./register-source.cjs');
const { routes, getMetadata, getMetaEntries, SITE_URL } = require('../src/seo/metadata');
const build = path.resolve(__dirname, '../build');
const sitemap = new JSDOM(fs.readFileSync(path.join(build, 'sitemap.xml'), 'utf8'), { contentType: 'application/xml' }).window.document;
const locations = [...sitemap.querySelectorAll('loc')].map(node => node.textContent);
assert.deepEqual(locations.sort(), Object.entries(routes).filter(([, entry]) => !entry.noindex).map(([route]) => SITE_URL + route).sort());
for (const route of [...Object.keys(routes), '/404']) {
  const filename = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
  const html = fs.readFileSync(path.join(build, filename), 'utf8');
  const { document } = new JSDOM(html, { url: SITE_URL + route }).window;
  const meta = getMetadata(route);
  assert.equal(document.title, meta.title, route);
  assert.equal(document.querySelectorAll('h1').length, 1, route);
  assert.ok(document.querySelector('main').textContent.trim().length > 50, route);
  for (const [attribute, key, value] of getMetaEntries(meta)) {
    const elements = document.querySelectorAll(`meta[${attribute}="${key}"]`);
    assert.equal(elements.length, 1, `${route}: ${key}`);
    assert.equal(elements[0].content, value, `${route}: ${key}`);
  }
  assert.equal(document.querySelector('link[rel="canonical"]')?.href || null, meta.canonical, route);
  assert.equal(document.querySelector('link[rel="manifest"]').getAttribute('href'), '/manifest.json');
  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) JSON.parse(script.textContent);
  for (const link of document.querySelectorAll('a[href^="/"]')) {
    const destination = new URL(link.href).pathname;
    assert.notEqual(destination.replace(/\/+$/, ''), '/bustapaga', `${route}: personal tool must not be linked publicly`);
    assert.ok(routes[destination] || fs.existsSync(path.join(build, destination)), `${route}: broken link ${destination}`);
  }
  for (const image of document.querySelectorAll('img[src^="/"]')) {
    assert.ok(fs.existsSync(path.join(build, image.getAttribute('src'))), `${route}: missing image`);
    assert.ok(image.hasAttribute('alt'), `${route}: missing alt`);
  }
  assert.ok(!html.includes('Devi abilitare JavaScript'), route);
}
const redirects = fs.readFileSync(path.join(build, '_redirects'), 'utf8');
assert.ok(!/^\/\*\s+\/index.html\s+200/m.test(redirects), 'SPA fallback must not mask 404s');
assert.match(redirects, /^\/iot \/servizi 301!$/m);
assert.ok(!locations.some(url => url.endsWith('/iot') || url.includes('/templates/') || url.endsWith('/bustapaga')));
assert.ok(fs.existsSync(path.join(build, '404.html')));
console.log(`SEO checks passed: ${Object.keys(routes).length} documents, 404, metadata, sitemap, links and local images.`);
