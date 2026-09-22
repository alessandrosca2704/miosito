# Implementazione SEO

## Architettura

Il progetto resta React 19 / Create React App, con lo stesso design e routing client.
`npm run build` genera HTML per tutte le 15 pagine pubbliche e `404.html` usando
ReactDOMServer. Non richiede Chromium durante il deploy e non aggiunge dipendenze.
Il browser usa `hydrateRoot` per rendere interattivo l'HTML generato.

- `src/seo/routes.json`: registro dei metadati e della politica di indicizzazione.
- `src/seo/metadata.js`: dominio canonico, alias, campi head e JSON-LD condivisi.
- `scripts/seo-assets.cjs`: genera sitemap e regole Netlify prima della build.
- `scripts/prerender.cjs`: riusa i componenti React e genera documenti completi.
- `scripts/register-source.cjs`: usa la toolchain Babel già fornita da react-scripts
  per leggere JSX durante la generazione statica, ignorando gli import CSS.
- `src/hooks/useDocumentMeta.js`: mantiene lo stesso head durante i cambi pagina.

La route Busta paga viene caricata separatamente; il parser PDF e il relativo worker
sono scaricati solo dopo la selezione di un documento. La generazione statica usa il
componente iniziale dello strumento senza caricare il parser e senza documenti utente.

## URL e contenuti

Le URL canoniche restano HTTPS, www e senza slash finale (eccetto `/`). Le regole
Netlify riscrivono soltanto le route note verso i rispettivi file HTML. Il fallback
universale SPA è stato rimosso: le URL sconosciute ricevono la pagina 404 di Netlify,
mentre React mostra la stessa pagina nella navigazione client. Le richieste ai file
statici e alle funzioni Netlify non sono catturate da un fallback globale.

Netlify normalizza gli slash prima delle regole: non è presente una regola `/pagina/`
verso `/pagina`, che potrebbe creare un loop. Le varianti usano lo stesso canonical;
Pretty URLs è disabilitato nella configurazione per mantenere coerenti i link generati.
Le URL `.html` note sono reindirizzate alle rispettive URL pubbliche.

- `/iot` → `/servizi` con 301, come richiesto. La pagina eliminata dall'utente non è
  stata ripristinata. Servizi conserva una spiegazione IoT e il progetto resta nel portfolio.
- Mantenuti i redirect `/Servizi`, `/web-app`, `/portfolio/webapp`.
- Nuove pagine `/sviluppo-siti-web` e `/integrazione-ai`, con testi basati sull'offerta
  già descritta dal sito, senza risultati commerciali, certificazioni o clienti inventati.
- Ampliate `/webapp` e `/servizi`, collegati i servizi dal menu e dal footer.
- Demo template e `/bustapaga`: `noindex, follow`, escluse dalla sitemap ma accessibili.
- `/bustapaga` è uno strumento personale: per scelta del proprietario rimane accessibile tramite URL, senza password, senza link pubblici e fuori dalla sitemap. Il controllo SEO impedisce di introdurre link pubblici allo strumento. Oltre al meta robots, gli header Netlify dichiarano `X-Robots-Tag: noindex` sul percorso e sulla variante `.html`; l'effettiva risposta HTTP va verificata dopo il deploy. Questa configurazione non costituisce un controllo di accesso.
- Catalogo `/templates`: indicizzabile, collegato dai servizi/navigazione e dalle demo.
- Demo: avviso esplicito, ritorno al catalogo, CTA commerciali verso Contatti; il modulo
  dimostrativo non invia dati. Le CTA hero aprono correttamente il pannello dimostrativo.

Sitemap: `/`, `/chi-sono`, `/contatti`, `/servizi`, `/portfolio`, `/webapp`,
`/sviluppo-siti-web`, `/integrazione-ai`, `/templates`.
Nessun lastmod artificiale. robots.txt non è stato modificato.

JSON-LD: Person senza organizzazione fittizia, WebSite, Service solo sulle tre pagine
che descrivono i servizi. Nessun markup recensioni o certificazioni per i dati demo.

## Manutenzione

Per aggiungere una pagina, aggiornare il router e il registro SEO. La build fallisce
se una route registrata non produce un H1, se metadati o sitemap non sono coerenti,
o se i link interni verificati puntano a pagine/file inesistenti.

`public/sitemap.xml` e `public/_redirects` sono generati: modificarne la sorgente in
`src/seo/`, poi eseguire `npm run seo:assets`. Non reintrodurre il fallback SPA 200.
Gli originali PNG/JPG restano disponibili; le card usano varianti WebP più leggere.
La libreria template ora consuma i WebP, coerentemente con lo script di screenshot.

## Verifica

Comandi:

```sh
npm run build
CI=true npm test -- --watchAll=false --runInBand
npm run lint
npm run test:browser
```

`npm run build` esegue automaticamente `npm run test:seo` come postbuild.
`test:browser` richiede il Chromium installato da Puppeteer; avvia un server solo locale,
blocca richieste a domini esterni e non invia form o richieste alla chat in produzione.
Il test controlla idratazione, metadati durante navigazione, 404, menu, CTA template,
layout mobile, contenuti senza JavaScript e caricamento/lettura del parser PDF al bisogno.
La preview locale verifica i file e le regole prodotte, non emula il CDN o Netlify Forms.

Il controllo dell'indicizzazione reale e dei canonical scelti da Google richiede
Search Console dopo la pubblicazione. Restano da verificare sul deploy gli status del
CDN, i form Netlify, il dominio primario/TLS e i Core Web Vitals. Nessun dato Lighthouse
oppure CrUX viene dedotto dal peso dei file o dai test locali.

Il deploy non è stato eseguito da questa implementazione.

## Dimensioni misurate

Il bundle iniziale pubblicato durante l'audit era 1.811.951 byte non compressi
(circa 511 kB gzip ricompressi localmente). La nuova build è circa 341 kB non compressi
/ 104 kB gzip: il lettore PDF (circa 406 kB gzip) resta disponibile su richiesta.
Queste sono dimensioni di file, non misurazioni Core Web Vitals.

Le immagini portfolio a 1280 px passano da circa 2,13 MB a 104 kB (Scout) e da
1,36 MB a 43 kB (studio contabile); sono disponibili varianti da 640 px. ESP32
mantiene la risoluzione originale e passa da 191 kB a circa 17 kB.

La hero desktop sui viewport alti fino a 950 px ora scorre normalmente per evitare
che la barra contatti fissa copra la CTA. Il layout a colonne resta invariato.

## File interessati

`package-lock.json` era già modificato prima dell'intervento e non è stato modificato
da questa implementazione. L'eliminazione di `src/Pages/Iot.js` era preesistente ed è
stata confermata dall'utente; il router è stato adeguato con redirect verso Servizi.
Gli artefatti di `build/` sono generati e restano ignorati da Git.

- `.gitignore`
- `SEO_IMPLEMENTATION.md`
- `netlify.toml`
- `package.json`
- `public/_redirects`
- `public/images/Portfolio/ESP32.webp`
- `public/images/Portfolio/SitoSCOUT-1280.webp`
- `public/images/Portfolio/SitoSCOUT-640.webp`
- `public/images/Portfolio/sito-studio-1280.webp`
- `public/images/Portfolio/sito-studio-640.webp`
- `public/images/preview-templates/craftsmen.webp`
- `public/images/preview-templates/nonprofit.webp`
- `public/images/preview-templates/pro-services.webp`
- `public/images/preview-templates/retail.webp`
- `public/images/preview-templates/sme.webp`
- `public/index.html`
- `public/sitemap.xml`
- `scripts/browser-seo.cjs`
- `scripts/prerender.cjs`
- `scripts/register-source.cjs`
- `scripts/seo-assets.cjs`
- `scripts/verify-seo.cjs`
- `src/App.css`
- `src/App.js`
- `src/Css/Portfolio.css`
- `src/Css/Servizi.css`
- `src/Css/TemplateDetail.css`
- `src/Css/home/final-cta-reveal.css`
- `src/Css/home/hero.css`
- `src/Css/secondary-pages.css`
- `src/Pages/Chisono.js`
- `src/Pages/Home.js`
- `src/Pages/NotFound.jsx`
- `src/Pages/ServiceDetail.jsx`
- `src/Pages/Servizi.js`
- `src/Pages/Templates.js`
- `src/Pages/Web-app.js`
- `src/Pages/templates/CraftsmenTemplate.jsx`
- `src/Pages/templates/ProServicesTemplate.jsx`
- `src/Pages/templates/RetailTemplate.jsx`
- `src/Pages/templates/SmeTemplate.jsx`
- `src/Pages/templates/TemplateLayout.jsx`
- `src/components/Footer.js`
- `src/components/Header.js`
- `src/components/SideMenu.jsx`
- `src/components/home/HeroSection.jsx`
- `src/components/portfolio/PortfolioCard.jsx`
- `src/components/services/ServicesRecentProjects.jsx`
- `src/data/navigation.js`
- `src/data/projects.js`
- `src/features/bustapaga/PayrollCheckerPage.jsx`
- `src/hooks/useDocumentMeta.js`
- `src/hooks/useHomeSectionProgress.js`
- `src/hooks/useScrollReveal.js`
- `src/index.js`
- `src/seo/metadata.js`
- `src/seo/metadata.test.js`
- `src/seo/routes.json`

## Esito dei controlli finali

- Build di produzione: superata, 15 documenti prerenderizzati più `404.html`.
- Postbuild SEO: superato per metadati, sitemap, H1, link e immagini locali.
- Test unitari: 3 superati (navigazione metadata, canonical/alias, dati strutturati).
- Browser Chromium: superato su tutte le route, senza errori runtime o di idratazione.
- Navigazione SPA: title, canonical e robots aggiornati correttamente, anche passando
  da una demo noindex a una pagina indicizzabile.
- Menu mobile, apertura/chiusura pannello template e CTA: superati.
- Viewport mobile 390 px: nessun overflow orizzontale sulle 14 pagine di presentazione/demo.
- JavaScript disabilitato: H1 visibile e navigazione presenti sulle 9 pagine indicizzabili.
- PDF sintetico locale: estrazione riuscita; parser/worker assenti prima del caricamento
  e scaricati soltanto alla selezione del file. Nessun documento personale utilizzato.
- Lint: nessun errore; resta il warning preesistente `jsx-a11y/no-redundant-roles` in
  `src/components/NavbarCarouselImgs.jsx:64` (componente non montato dall'app).
- `git diff --check`: superato.

La toolchain segnala inoltre il database Browserslist datato e la deprecazione di
`punycode` nelle dipendenze di test. Non sono state aggiornate dipendenze fuori ambito.

Riferimenti per il comportamento di hosting:
[404 e normalizzazione slash Netlify](https://docs.netlify.com/manage/routing/redirects/redirect-options/),
[configurazione Pretty URLs](https://docs.netlify.com/build/configure-builds/file-based-configuration/).
Il comportamento CDN e l'invio reale dei form vanno confermati dopo il deploy.

## Aggiornamento grafico delle pagine servizio

Le pagine `/sviluppo-siti-web`, `/integrazione-ai` e `/webapp` usano ora un layout condiviso in `src/components/services/ServiceLanding.jsx`, con stili circoscritti in `src/Css/service-landing.css` e contenuti in `src/data/serviceDetails.js`.

- Siti web: anteprime dei template esistenti e selettore di cinque demo, con collegamenti al catalogo e alla demo scelta. I dati dei template sono condivisi con il catalogo tramite `src/data/templates.js`.
- IA: diagramma illustrativo del processo, casi d'uso e pulsante per aprire l'assistente esistente.
- Web app: dashboard illustrativa con dati dimostrativi e sezione sul progetto SaaS per la gestione dei condomini in sviluppo.
- Tutte e tre: apertura a due colonne, schede delle possibilità, percorso in quattro passaggi, approfondimenti e invito finale al contatto. Layout adattato ai dispositivi mobili e navigazione da tastiera.

Metadati, canonical e politiche di indicizzazione restano centralizzati. Nessuna nuova dipendenza. Verificati build, controlli SEO, lint, tre test unitari e test Chromium: selettore template da tastiera, apertura demo, idratazione, assenza di overflow a 390 px e contenuti leggibili senza JavaScript. Le anteprime desktop e mobile sono state controllate durante lo sviluppo; le chiamate a servizi esterni sono bloccate nei test browser.
