const fs = require('node:fs');
const path = require('node:path');
// Match CRA's build-time environment when rendering source on the server.
process.env.NODE_ENV = 'production';
require('react-scripts/config/env');
require('./register-source.cjs');
const React = require('react');
const { renderToString } = require('react-dom/server');
const App = require('../src/App').default;
const PayrollPage = require('../src/features/bustapaga/PayrollCheckerPage').default;
const { routes, getMetadata, getStructuredData, serializeJson, getMetaEntries } = require('../src/seo/metadata');
const buildDirectory = path.resolve(__dirname, '../build');
const shell = fs.readFileSync(path.join(buildDirectory, 'index.html'), 'utf8');
const escape = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function head(meta) {
  const tags = [`<title>${escape(meta.title)}</title>`];
  getMetaEntries(meta).forEach(([attribute, key, value]) => tags.push(`<meta ${attribute}="${key}" content="${escape(value)}"/>`));
  if (meta.canonical) tags.push(`<link rel="canonical" href="${escape(meta.canonical)}"/>`);
  const data = getStructuredData(meta);
  if (data) tags.push(`<script id="site-schema" type="application/ld+json">${serializeJson(data)}</script>`);
  return tags.join('');
}

for (const route of [...Object.keys(routes), '/404']) {
  const meta = getMetadata(route);
  const content = renderToString(React.createElement(App, {
    location: route,
    payrollPage: route === '/bustapaga' ? React.createElement(PayrollPage) : undefined,
  }));
  if ((content.match(/<h1(?:\s|>)/g) || []).length !== 1) throw new Error(`Expected one H1: ${route}`);
  const html = shell.replace(/<title>.*?<\/title>/s, head(meta)).replace('<div id="root"></div>', `<div id="root">${content}</div>`);
  if (!html.includes(content)) throw new Error('Missing root placeholder in build shell');
  const destination = path.join(buildDirectory, route === '/' ? 'index.html' : `${route.slice(1)}.html`);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, html);
}
console.log(`Prerendered ${Object.keys(routes).length} pages and 404.html.`);
