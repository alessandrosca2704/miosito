const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const puppeteer = require('puppeteer');
const routes = require('../src/seo/routes.json');
const directory = path.resolve(__dirname, '../build');
const rules = fs.readFileSync(path.join(directory, '_redirects'), 'utf8').split('\n').filter(line => line && !line.startsWith('#')).map(line => line.split(/\s+/));
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.xml': 'application/xml' };
// Local static preview of generated files/rules, not an emulation of Netlify Forms or CDN.
const server = http.createServer((req, res) => {
  const requestPath = new URL(req.url, 'http://localhost').pathname;
  const normalized = requestPath.replace(/\/+$/, '') || '/';
  const rule = rules.find(([from]) => from === normalized);
  if (rule && rule[2].startsWith('301')) { res.writeHead(301, { Location: rule[1] }); res.end(); return; }
  let file = path.join(directory, rule ? rule[1] : normalized === '/' ? '/index.html' : normalized);
  if (!file.startsWith(directory + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.statusCode = 404; file = path.join(directory, '404.html');
  }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

(async () => {
  let browser;
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'site-seo-browser-'));
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'], userDataDir: profile });
    const page = await browser.newPage();
    const errors = [];
    const requests = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.url().startsWith(origin) || request.url().startsWith('data:')) {
        requests.push(request.url()); request.continue();
      } else request.abort();
    });
    await page.setViewport({ width: 1440, height: 900 });
    for (const route of [...Object.keys(routes), '/missing-seo-test']) {
      const response = await page.goto(origin + route, { waitUntil: 'networkidle0' });
      assert.equal(response.status(), routes[route] ? 200 : 404, route);
      await page.waitForFunction(() => document.querySelector('.sidemenu-overlay')?.parentElement === document.body);
      assert.equal(await page.$$eval('h1', elements => elements.length), 1, route);
      if (routes[route]) assert.equal(await page.title(), routes[route].title, route);
      assert.equal(await page.$$eval('.sidemenu-overlay', elements => elements.length), 1, `duplicate menu: ${route}`);
    }
    console.log('Direct-route checks completed; runtime errors:', errors);
    await page.goto(origin, { waitUntil: 'networkidle0' });
    await page.screenshot({path: '/tmp/seo-home-desktop.png'});
    // Move the CTA above the fixed contact bar before a real pointer click.
    await page.$eval('.home-hero__actions a[href="/contatti"]', element => element.scrollIntoView({block: 'center', behavior: 'instant'}));
    await page.locator('.home-hero__actions a[href="/contatti"]').click();
    await page.waitForFunction(title => document.title === title, {}, routes['/contatti'].title);
    assert.equal(await page.$eval('link[rel="canonical"]', element => element.href), 'https://www.alessandroscarimbolo.it/contatti');
    assert.equal(await page.$eval('form[name="contatti"]:not([hidden])', element => element.method), 'post');
    await page.goto(origin + '/templates/sme', { waitUntil: 'networkidle0' });
    await page.locator('.template-detail__cta-stack a[href="#contatto"]').click();
    await page.waitForFunction(() => !document.getElementById('contatto').hasAttribute('inert'));
    await page.locator('.template-detail__sticky-close').click();
    await page.locator('.template-demo-note a[href="/contatti"]').click();
    await page.waitForFunction(() => document.querySelector('meta[name="robots"]').content === 'index, follow');
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    for (const route of Object.keys(routes).filter(route => route !== '/bustapaga')) {
      await page.goto(origin + route, { waitUntil: 'networkidle0' });
      const size = await page.evaluate(() => ({ viewport: window.innerWidth, width: document.documentElement.scrollWidth }));
      assert.ok(size.width <= size.viewport + 1, `mobile overflow: ${route} ${JSON.stringify(size)}`);
    }
    await page.goto(origin, { waitUntil: 'networkidle0' });
    await page.screenshot({path: '/tmp/seo-home-mobile.png'});
    await page.click('.hamburger');
    await page.waitForFunction(() => !document.getElementById('site-menu').hasAttribute('inert'));
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => document.activeElement.classList.contains('hamburger'));
    console.log('Client navigation, template controls and mobile checks passed.');
    // With scripts disabled, actual commercial copy and navigation must remain present and visible.
    const noJs = await browser.newPage();
    await noJs.setJavaScriptEnabled(false);
    await noJs.setRequestInterception(true);
    noJs.on('request', request => request.url().startsWith(origin) ? request.continue() : request.abort());
    for (const route of Object.keys(routes).filter(route => !routes[route].noindex)) {
      await noJs.goto(origin + route, { waitUntil: 'load' });
      console.log('No-JS:', route);
      assert.equal(await noJs.$$eval('h1', elements => elements.length), 1);
      const opacity = await noJs.$eval('h1', element => {
        let result = 1;
        for (let parent = element; parent; parent = parent.parentElement) result *= Number(getComputedStyle(parent).opacity);
        return result;
      });
      assert.ok(opacity > 0, `invisible without JS: ${route}`);
      assert.ok((await noJs.$$eval('footer a', elements => elements.length)) >= 6);
    }
    await noJs.close();
    await page.bringToFront();
    console.log('No-JS checks passed; testing PDF extraction.');
    assert.ok(!requests.filter(url => url.endsWith('.js')).some(url => fs.readFileSync(path.join(directory, new URL(url).pathname), 'utf8').includes('WorkerMessageHandler')), 'PDF worker loaded before upload');
    await page.goto(origin + '/bustapaga', { waitUntil: 'networkidle0' });
    await page.click('.payroll-confirmation input');
    await page.click('.payroll-privacy-actions .payroll-primary-button');
    const objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 300] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    ];
    const stream = 'BT /F1 12 Tf 20 250 Td (Documento di prova SEO) Tj ET';
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
    const xref = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach(offset => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    const fixture = path.join(profile, 'sample.pdf');
    fs.writeFileSync(fixture, pdf);
    const upload = await page.$('input[type="file"]');
    await upload.uploadFile(fixture);
    await page.waitForFunction(() => [...document.querySelectorAll('.payroll-file-name')].some(element => element.textContent === 'sample.pdf'));
    await page.waitForFunction(() => !document.querySelector('input[type="file"]').disabled);
    assert.equal(await page.$$eval('.payroll-upload-card .payroll-error', elements => elements.length), 0, 'PDF extraction failed');
    assert.ok(requests.filter(url => url.endsWith('.js')).some(url => fs.readFileSync(path.join(directory, new URL(url).pathname), 'utf8').includes('WorkerMessageHandler')), 'PDF code was not loaded on demand');
    assert.deepEqual(errors, [], 'runtime/hydration errors');
    console.log('Browser checks passed: hydration, 15 routes, 404, client metadata, menu, template CTA, mobile width, no-JS content and successful local PDF extraction on demand.');
  } catch (error) {
    console.error('Browser check failed:', error);
    throw error;
  } finally {
    if (browser) await browser.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    fs.rmSync(profile, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
