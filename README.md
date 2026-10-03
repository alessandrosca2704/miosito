# Alessandro Scarimbolo — Developer Portfolio

A responsive personal portfolio and service website for Alessandro Scarimbolo, an IT engineer focused on web applications, AI-enabled workflows, IoT prototypes, and digital solutions for small and medium-sized businesses.

The project is a React single-page application deployed on Netlify. Alongside the public portfolio, it includes interactive business-template demos, a privacy-conscious payroll reconciliation utility, Cal.com appointment booking, and an AI chat assistant backed by a serverless function.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Content and Customization](#content-and-customization)
- [Payroll Reconciliation Tool](#payroll-reconciliation-tool)
- [Contact and Booking](#contact-and-booking)
- [Chat Assistant and Netlify Function](#chat-assistant-and-netlify-function)
- [Environment Variables](#environment-variables)
- [SEO and PWA](#seo-and-pwa)
- [Deployment](#deployment)
- [Testing and Quality Checks](#testing-and-quality-checks)
- [Troubleshooting](#troubleshooting)
- [Security and Privacy](#security-and-privacy)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

This website presents professional services, technical skills, selected projects, and contact options in a mobile-friendly experience. Its primary audience is professionals and SMEs looking for custom websites and web apps, AI integration, workflow automation, IoT proof-of-concept development, or technical consulting.

The application is primarily frontend-driven. It does **not** contain a traditional backend server or database. Server-side chat requests are handled by one Netlify Function, while contact options use Cal.com, email, phone and WhatsApp.

## Key Features

- Responsive portfolio, professional profile, and service pages
- Dedicated IoT and custom web-application offerings
- Data-driven project showcase
- Five interactive one-page business template demos
- Browser-based PDF payroll reconciliation tool
- Cal.com booking with direct email contact
- AI-powered chat assistant in Italian
- Desktop, mobile, carousel, and sticky-contact navigation
- Scroll-triggered animation and reduced-motion support
- Per-page titles and meta descriptions
- Sitemap, crawler configuration, app manifest, and responsive icons
- Netlify hosting, redirects, headers, Forms, and Functions

## Technology Stack

| Technology | Role |
| --- | --- |
| React 19 | Component-based user interface |
| React DOM 19 | Browser rendering |
| React Router 7 | Client-side routes and redirects |
| Create React App 5 | Development and production build pipeline |
| Motion | Interface animations |
| PDF.js (`pdfjs-dist`) | Local payroll PDF text extraction |
| Netlify | Hosting, Forms, headers, and serverless Functions |
| OpenAI API | Chat responses through a server-side proxy |
| Puppeteer | Optional template-preview generation |
| React Testing Library | UI testing foundation |

Styling uses modular files under `src/Css/`, feature-specific CSS, custom properties, and responsive media queries.

## Prerequisites

- Node.js 20.x, matching `netlify.toml`
- npm
- Git
- A Netlify account for deployment, Forms, and Functions
- An OpenAI API key only when the chat assistant is enabled

```bash
node --version
npm --version
git --version
```

## Installation

```bash
git clone https://github.com/alessandrosca2704/miosito.git
cd miosito
npm ci --legacy-peer-deps
```

`--legacy-peer-deps` matches the Netlify build configuration and helps npm resolve compatibility constraints in the Create React App dependency tree.

## Running Locally

### Frontend only

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000). This mode supports layout, routing, content, templates, IoT, portfolio, and payroll development. Chat requests require the Netlify Function.

### Complete Netlify environment

```bash
npx netlify login
npx netlify link
npx netlify dev
```

Netlify CLI prints the local URL, commonly `http://localhost:8888`. Use this mode to test `/.netlify/functions/chatAssistant`, booking configuration and deployment redirects.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Starts the development server |
| `npm run build` | Creates an optimized build in `build/` |
| `npm test` | Runs Jest in interactive watch mode |
| `npm test -- --watchAll=false` | Runs available tests once |
| `npm run eject` | Permanently exposes Create React App configuration |

`npm run eject` is irreversible and is not needed for ordinary development.

### Generate template previews

With the app running on port 3000:

```bash
node src/scripts/capture-previews.mjs
```

The Puppeteer script writes WebP screenshots to `public/images/preview-templates/`. The gallery currently references `.jpg` assets, so align the paths or output format before replacing the existing previews.

## Project Structure

```text
miosito/
├── netlify/functions/
│   └── chatAssistant.js       # Serverless OpenAI proxy
├── public/
│   ├── files/                 # Public CV and thesis
│   ├── images/                # Portfolio, navigation, and template media
│   ├── _redirects             # Redirects and SPA fallback
│   ├── manifest.json          # Web app metadata
│   ├── robots.txt             # Crawler rules
│   └── sitemap.xml            # Public route sitemap
├── src/
│   ├── components/            # Shared UI and page sections
│   ├── Css/                   # Global, page, and responsive styles
│   ├── data/                  # Navigation, projects, services, and copy
│   ├── features/bustapaga/    # Payroll parsing and reconciliation
│   ├── hooks/                 # Metadata, motion, and reveal hooks
│   ├── Pages/                 # Route-level pages and template demos
│   ├── scripts/               # Preview-capture utility
│   ├── App.js                 # Layout and route definitions
│   └── index.js               # React entry point
├── netlify.toml               # Build, Functions, and headers
├── package.json
└── README.md
```

`build/`, `node_modules/`, and local diagnostics under `tmp/` are generated or local artifacts and should not be edited as source.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Expertise, approach, skills, and highlighted projects |
| `/chi-sono` | Profile, experience, and service areas |
| `/servizi` | Services, delivery process, and recent work |
| `/portfolio` | Selected projects |
| `/iot` | IoT prototypes, ESP32, data collection, and dashboards |
| `/webapp` | Custom web-application offering |
| `/templates` | Business template gallery |
| `/templates/pro-services` | Professional-services demo |
| `/templates/craftsmen` | Craftspeople demo |
| `/templates/nonprofit` | Association and nonprofit demo |
| `/templates/sme` | SME and startup demo |
| `/templates/retail` | Retail and local-business demo |
| `/contatti` | Contact information and call booking |
| `/bustapaga` | Local payroll PDF reconciliation utility |

Legacy URLs `/Servizi`, `/web-app`, and `/portfolio/webapp` redirect to canonical routes. Netlify's catch-all rule sends direct SPA requests to `index.html`.

When adding a page:

1. Create it under `src/Pages/`.
2. Add its path to `src/data/navigation.js` when applicable.
3. Register it in `src/App.js`.
4. Add metadata with `useDocumentMeta()`.
5. Add it to `public/sitemap.xml` if it should be indexed.

## Content and Customization

Content is maintained in React components and JavaScript data files rather than through a CMS.

- `src/data/navigation.js`: paths and navigation collections
- `src/data/projects.js`: portfolio projects
- `src/data/services.js`: service benefits, process, and project references
- `src/data/about.js`: services, timeline, and technology stack
- `src/data/home/`: homepage copy, workflow, skills, and projects
- `src/Pages/Templates.js`: template gallery definitions
- `src/Pages/templates/`: complete template-demo content

Example project shape:

```js
{
  id: "project-id",
  title: "Project title",
  category: "Web application",
  description: "A concise explanation of the problem and result.",
  image: "/images/Portfolio/project-preview.png",
  href: "https://example.com"
}
```

Keep IDs unique and store public images under `public/images/`. Root-relative asset paths begin with `/images/`.

Contact constants currently live in `src/Pages/Contatti.js`, with related links in shared components. Search before changing an address or number:

```bash
rg "old-address@example.com|old-phone-number" src public
```

The CV and thesis under `public/files/` are publicly downloadable. Never place private or unredacted documents in `public/`.

## Payroll Reconciliation Tool

The `/bustapaga` feature compares an FS service diary with a payslip using extracted codes and parameters:

1. The user accepts the privacy notice.
2. The user selects a text-based diary PDF and payslip PDF.
3. PDF.js extracts text locally in the browser.
4. Parsers identify periods, items, pay lines, totals, and excluded lines.
5. Reconciliation rules report matches and anomalies.
6. The user may explicitly export the result as JSON.

Key modules under `src/features/bustapaga/` include:

- `parsers/pdfText.js`: PDF extraction
- `parsers/diaryParser.js`: service diary parsing
- `parsers/payslipParser.js`: pay-line parsing and aggregation
- `parsers/reconciliation.js`: comparison rules
- `parsers/privacy.js`: sensitive-data detection and redaction
- `config/`: categories and simulation defaults
- `components/`: upload, preview, summary, anomaly, and export UI

The current code keeps extracted content in React's in-memory state. It does not send PDFs to a server or API and does not persist them in `localStorage` or `sessionStorage`. Reloading clears the state; JSON is generated only by an explicit export.

Netlify sends `Cache-Control: no-store` for this route. The parser requires selectable text, so protected or image-only PDFs need preprocessing or a future OCR feature. This utility supports review but does not replace a payroll or accounting professional.

## Contact and Booking

The contact page pairs a Cal.com booking popup with email, phone and WhatsApp. The previous contact form and its Netlify registration have been removed. `src/components/contact/CalBooking.jsx` uses the official `@calcom/embed-react` package (React 19 compatible), dynamically imported only on click. The page uses the site's light theme and existing CSS buttons. No analytics or backend credentials are required.

### Cal.com setup

1. In Cal.com, create a public event type and configure its duration, availability, timezone, connected calendar and meeting location/video provider.
2. Copy `.env.example` to `.env.local` and set `REACT_APP_CALCOM_EVENT_URL` to the event's public URL, such as `https://cal.com/your-profile/your-event`. Use a canonical event URL without query parameters. This value is public and included in the browser bundle; never put an API key here.
3. Restart local development. For Netlify, set the same variable in the build environment and rebuild/deploy. The prerender step loads CRA's environment too, ensuring identical server and browser markup.
4. To change event type later, update this variable and rebuild.

An absent/invalid URL shows an email link instead of a broken booking button. If calendar loading fails, a direct booking link appears. Email and phone remain available without JavaScript. SDK failures and a 15-second loading timeout show a message with alternatives. Only public HTTPS event links on `cal.com` are supported; custom domains require an explicit extension to the configuration.

Before publishing, check the real event on desktop and mobile: open/close, keyboard focus and Escape, date/time selection, timezone, confirmation and notification delivery. Local mocked checks cannot verify account availability or actual booking delivery. No bookings are created automatically by tests. The SDK supports `bookingSuccessfulV2` if an existing analytics system is added in the future; no tracking is installed now.

On screens up to 640px, service landing pages use lighter secondary links, compact spacing and expandable approach explanations. Above this breakpoint the desktop presentation is preserved. Without JavaScript the explanations remain visible. The contact page uses two columns on desktop and one below 900px.

## Chat Assistant and Netlify Function

The project has no conventional backend. Its only request-time server-side component is:

```text
POST /.netlify/functions/chatAssistant
```

Example request:

```json
{
  "messages": [
    { "role": "system", "content": "Assistant instructions" },
    { "role": "user", "content": "Quali servizi offri?" }
  ]
}
```

Example response:

```json
{
  "reply": "..."
}
```

The Function validates the method and payload, reads the API key from the server environment, calls the configured OpenAI model, and returns its reply. Chat appears on the main site but not on template-detail pages.

For public traffic, consider request-size limits, role validation, rate limiting, abuse protection, origin checks, monitoring, and a usage budget.

## Environment Variables

| Variable | Required | Scope | Description |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | For chat | Server only | Preferred key for `chatAssistant` |
| `VITE_OPENAI_API_KEY` | No | Server fallback | Legacy-compatible Function fallback |
| `REACT_APP_OPENAI_API_KEY` | No | Server fallback | Legacy-compatible Function fallback |

Prefer `OPENAI_API_KEY`. A `REACT_APP_*` value can be embedded in a frontend bundle if browser code references it.

Set production secrets in **Netlify → Site configuration → Environment variables**, then redeploy. Never commit API keys or `.env` files.

## SEO and PWA

- `useDocumentMeta()` updates titles and descriptions on supported pages.
- `public/index.html` contains baseline metadata and social tags.
- `robots.txt` permits indexing and references the production sitemap.
- `sitemap.xml` lists canonical public routes.
- `_redirects` consolidates legacy URLs and supports React Router.

When changing the domain or public routes, update `public/index.html`, `robots.txt`, and `sitemap.xml` together. Not every route currently uses `useDocumentMeta()`; add unique metadata wherever search visibility matters.

`manifest.json` defines app identity, colors, standalone display, and standard/maskable icons. No service worker is registered in `src/index.js`, so offline caching and managed updates are not active. Full PWA support requires adding and testing a production service worker and cache policy.

## Deployment

`netlify.toml` configures:

- `npm run build` as the build command;
- `build` as the publish directory;
- `netlify/functions` as the Functions directory;
- Node.js 20 and `--legacy-peer-deps`;
- `Cache-Control: no-store` for `/bustapaga`.

### Continuous deployment

1. Push the repository to GitHub.
2. Import it through **Netlify → Add new site**.
3. Select the production branch.
4. Let Netlify read `netlify.toml`.
5. Add `OPENAI_API_KEY` if chat is enabled.
6. Deploy and test direct routes, Forms, chat, templates, and payroll parsing.

### Manual deployment

```bash
npm run build
npx netlify deploy --dir=build
npx netlify deploy --dir=build --prod
```

The first deploy is a preview; the final command publishes to production.

## Testing and Quality Checks

```bash
npm test -- --watchAll=false
npm run build
```

Testing-library packages are installed, but coverage should be expanded. High-value targets include payroll parser fixtures, reconciliation rules, privacy redaction, navigation, contact validation, and chat states.

Also test common desktop/mobile widths, keyboard navigation, focus visibility, reduced motion, heading order, labels, and template overflow.

## Troubleshooting

### Dependency conflicts

```bash
npm ci --legacy-peer-deps
```

Use Node 20 to match production.

### Direct routes return 404

Confirm `_redirects` exists in `build/`, Netlify publishes `build`, and the final fallback serves `/index.html` with status `200`.

### Chat reports a technical error

- Use `netlify dev`, not only `npm start`.
- Configure `OPENAI_API_KEY` and restart or redeploy.
- Inspect `chatAssistant` Function logs.
- Never place a production key in `ChatAssistant.jsx`.

### Booking button does not appear

- Set a valid public event URL in `REACT_APP_CALCOM_EVENT_URL`.
- For Netlify Dev, make the variable available in the dev context and link the correct site.
- Restart development or rebuild the deployment after changing the variable.

### A payroll PDF cannot be read

- Use an unprotected PDF with selectable text.
- Check parser status messages.
- Verify that the document layout still matches existing rules.
- Develop fixes using synthetic or fully anonymized fixtures.

Never upload real payroll documents to public issues or repositories.

### Preview generation fails

Start the app at `http://localhost:3000`, ensure Chromium can launch, and verify that `public/images/preview-templates/` exists.

## Security and Privacy

### NewStyle Architecture

NewStyle is in a non-destructive transition. The web UI at `/newstyleparrucchiere` remains available as a reference, while the target client is a standalone React + Vite + Capacitor Android app. The future app calls `https://www.alessandroscarimbolo.it/api/newstyle/*`; it never calls Cal.com directly.

The API is implemented by Netlify Functions. Cal.com credentials and the activation-code hash remain server-side. A device is activated once with `POST /api/newstyle/device/activate`; the server returns a high-entropy device token once, and stores only its SHA-256 hash in Netlify Blobs. The Android client will store the token through an Android Keystore-backed `DeviceTokenStorage` adapter.

Configure `NEWSTYLE_ALLOWED_ORIGINS` in Netlify environment variables with **Functions** scope and the exact origins for the target deploy context. Android uses `https://localhost`; browser development at port 8888 uses `http://localhost:8888`. Set the `dev` value to the browser origin for a local backend. For browser development against the production API, explicitly include both origins in the **production** value (`https://localhost,http://localhost:8888`) and redeploy. A `dev` value does not apply to production. Keep the allowlist explicit; never use `*`. `NEWSTYLE_DEV_ALLOWED_ORIGINS` is also merged into the allowlist if set, so configure its contexts deliberately. Use `VITE_API_BASE_URL` only as public client configuration. The current web session auth is transitional and will be removed only after the signed APK is verified.

Activation and bookings now both use modern Netlify Functions so Blobs is initialized automatically, with strong consistency for device validation. The store is site-wide (`newstyle-devices`); activation writes `devices/<sha256>` and bookings reads the same key. Do not convert bookings to a Lambda `handler` without restoring the Blobs context and strong-read support. A `401` reports `ACTIVATION_CODE_INVALID`, `DEVICE_TOKEN_MISSING`, or `DEVICE_UNAUTHORIZED`. Blobs configuration failures are server errors, not token revocations. No token or activation code should be logged.

After changes, run `npm run verify:newstyle && npm run build`. This is also the Netlify build gate. If UI tests or `test:seo` fail with missing `canvas.node`, repair the local optional native dependency rather than weakening the gate: use the configured Node 20 and run `npm ci --legacy-peer-deps --omit=optional`, then rerun the gate. NewStyle UI and SEO do not require native canvas. For environments that need native canvas, install its Cairo/Pango build prerequisites and run `npm rebuild canvas` instead.

Deployment verification: inspect **Netlify → Deploys → latest production deploy** and its build log; verify it is Published and includes the changed Functions. If secret scanning blocks deployment, remove secrets from tracked files/generated output, keep them in Functions-scoped environment variables, and rotate exposed credentials; do not disable scanning. Then verify OPTIONS for both required origins and GET bookings without credentials (401 JSON is expected). Install the rebuilt APK and test actual activation separately; never use a real activation code in automated live probes.

- Keep credentials in server-side environment variables.
- Treat everything in `public/` as publicly downloadable.
- Avoid logging chat messages or personal information without a retention policy.
- Preserve browser-only payroll processing when changing that feature.
- Do not add analytics, uploads, or third-party scripts to `/bustapaga` without reviewing its privacy notice.
- Use anonymized documents in development and tests.
- Add rate limiting and abuse controls to the chat endpoint for production use.
- Review dependency advisories and test upgrades before release.

## Contributing

1. Update `main` and create a focused branch:

   ```bash
   git switch -c feature/short-description
   ```

2. Follow the existing organization: pages in `src/Pages`, reusable UI in `src/components`, structured copy in `src/data`, and feature code in `src/features`.
3. Keep changes accessible and responsive.
4. Add tests for logic-heavy changes, especially payroll parsing.
5. Run tests and a production build.
6. Open a pull request explaining affected routes, verification, and privacy or configuration impact.

Do not commit secrets, personal payroll data, private documents, or unrelated generated files.

## License

No license file is currently included. Unless the owner adds an explicit license, treat the source, written content, visual identity, and bundled documents as proprietary and all rights reserved.

## Contact

For projects, collaboration, or technical services, use the deployed contact page:

[www.alessandroscarimbolo.it/contatti](https://www.alessandroscarimbolo.it/contatti)

For code issues, include reproduction steps, the affected route, browser and Node versions, and sanitized logs. Never include API keys, payroll documents, or personal data.

## NewStyle Admin

Area privata: `/newstyleparrucchiere`. React/TypeScript → Netlify Function
`newstyle` → Cal.com API v2. Nessun database: Cal.com conserva gli appuntamenti.
Il frontend usa cookie HttpOnly e non riceve chiavi o token. Le tre viste sono
Oggi, Agenda (FullCalendar) e Da confermare. Conferma/rifiuto aggiornano Cal.com,
ricaricano la vista e invalidano i dati quando si cambia sezione.

### Configurazione server

Configurare in Netlify, nelle environment variables con scope **Functions**:

| Variabile | Uso |
| --- | --- |
| `CAL_API_KEY` | Chiave dell'account Cal.com proprietario degli appuntamenti NewStyle |
| `NEWSTYLE_ADMIN_USERNAME` | Unico amministratore |
| `NEWSTYLE_ADMIN_PASSWORD_HASH` | Hash bcrypt, generato con il comando sotto |
| `NEWSTYLE_SESSION_SECRET` | Segreto casuale di almeno 32 caratteri |
| `NEWSTYLE_CAL_EVENT_TYPE_IDS` | ID positivi dei servizi NewStyle, separati da virgole; obbligatori salvo opt-in esplicito sotto |
| `NEWSTYLE_CAL_ALLOW_ALL_EVENTS` | Default `false`; `true` autorizza esplicitamente tutto l’account quando non sono configurati ID |
| `CAL_API_BASE_URL` | Facoltativa: default `https://api.cal.com/v2`; solo HTTPS |

Non utilizzare prefissi `VITE_` o `REACT_APP_`. Non inserire credenziali nei file
versionati. `.env.example` contiene segreti vuoti e impostazioni di esempio; `.env` è ignorato da Git.
Per generare l'hash senza password nella cronologia della shell:

```sh
node scripts/newstyle-password.cjs
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

Il primo comando chiede la password senza mostrarla e stampa l'hash; il secondo
stampa il segreto di sessione. Conservare i risultati solo nelle variabili server.
Se si usa `.env`, racchiudere l'hash bcrypt tra apici singoli per conservare i `$`.

### Cal.com

Nell'account dedicato NewStyle, aprire Settings → Developer → API keys e creare
una chiave. La chiave deve poter leggere gli appuntamenti e i tipi di evento,
e confermare/rifiutare le prenotazioni dell'account. Configurare i servizi e gli
orari direttamente in Cal.com, con timezone **Europe/Rome**, e attivare la
richiesta di conferma negli eventi interessati (confirmation policy).
Configurare `NEWSTYLE_CAL_EVENT_TYPE_IDS`: il filtro si applica a lista, dettaglio
e mutazioni. In assenza di ID, il server blocca le operazioni prima di chiamare
Cal.com. Solo per un account interamente dedicato è possibile autorizzare tutto
l’account con `NEWSTYLE_CAL_ALLOW_ALL_EVENTS=true`. ID malformati bloccano
comunque l’accesso; gli ID configurati prevalgono sull’opt-in.

Contratti verificati sulla documentazione ufficiale:

- [Lista prenotazioni](https://cal.com/docs/api-reference/v2/bookings/get-all-bookings): `2026-05-01`, cursori, `limit`, `afterStart`, `beforeEnd`, filtro `unconfirmed`.
- [Dettaglio](https://cal.com/docs/api-reference/v2/bookings/get-a-booking), [conferma](https://cal.com/docs/api-reference/v2/bookings/confirm-a-booking) e [rifiuto](https://cal.com/docs/api-reference/v2/bookings/decline-a-booking): `2026-02-25`.
- [Titolo servizio](https://cal.com/docs/api-reference/v2/event-types/get-an-event-type): `2026-06-12`. L'oggetto evento della prenotazione contiene ID/slug; il titolo viene letto dall'evento.

Le versioni sono fissate nel service layer; autenticazione `Authorization: Bearer`.
Fetch server-side evita un SDK aggiuntivo per queste sole operazioni.

### Sviluppo e test locale

Richiede Node 20 o successivo.

```sh
npm ci --legacy-peer-deps
cp .env.example .env
# Compilare .env con credenziali di un account Cal.com di prova.
npm run verify:newstyle
CI=true npm test -- --watchAll=false --runInBand
npm run build
npm run test:newstyle:browser
npx netlify-cli dev
```

Aprire `http://localhost:8888/newstyleparrucchiere`. Usare Netlify Dev, perché
`npm start` da solo non serve le Functions. Netlify Dev imposta `NETLIFY_DEV=true`
per consentire il cookie su HTTP locale; in deploy il cookie è sempre Secure.
Se la CLI richiede il framework, scegliere Create React App, comando `npm start`,
porta applicazione 3000 e porta proxy 8888.

I test `test:newstyle` simulano tutte le risposte Cal.com: autenticazione valida e
fallita, sessioni alterate, logout, API senza sessione, controllo origine, ambito,
mapper, paginazione, conferma/rifiuto, errori, timeout, rate limit e ora legale.
Non creano o modificano appuntamenti reali. I test UI verificano recupero dagli
errori di rendering, paginazione, richieste obsolete e conservazione dei dati
in caso di refresh fallito. Il test browser serve la build e usa i veri handler
HTTP con cookie, simulando soltanto Cal.com: include risposta persa dopo una
scrittura, storico su più pagine, ritorno al mese selezionato, errori HTML 200 e
leggibilità degli appuntamenti da 15 minuti. Non simula l’infrastruttura Netlify.
La build Netlify è preceduta da lint (anche TypeScript), typecheck e test NewStyle.

### Collaudo Netlify / produzione

1. Configurare le variabili nello scope Functions per il contesto di deploy
   desiderato, poi eseguire un nuovo deploy con la procedura abituale del sito.
2. Aprire `https://alessandroscarimbolo.it/newstyleparrucchiere` in finestra privata:
   deve apparire il login. Verificare che credenziali errate siano rifiutate.
3. Accedere, fare refresh diretto e verificare la persistenza della sessione.
   Controllare in DevTools il cookie `newstyle_session`: HttpOnly, Secure,
   SameSite=Strict, Path=/ e durata 7 giorni.
4. Con un appuntamento di prova predisposto consapevolmente in Cal.com,
   verificare Oggi e Agenda su smartphone e desktop, orari italiani e dettagli.
   Preparare due richieste da confermare: confermarne una e rifiutare l'altra.
   Controllare il risultato in tutte le viste e nell'account Cal.com.
5. Verificare il pulsante Annulla nel dialogo di rifiuto, gli errori di rete,
   il caricamento di altre pagine e la navigazione del calendario.
6. Uscire, fare refresh: deve tornare il login. In finestra privata,
   `/api/newstyle/bookings` deve rispondere 401. Le richieste del browser devono
   andare solamente a `/api/newstyle`, senza chiavi Cal.com nei payload o bundle.
7. Aprire home, contatti, portfolio e una route inesistente: devono mantenere
   il comportamento precedente. La route NewStyle ha noindex ed è esclusa dalla sitemap.

### Limiti V1

Pagine da 100 appuntamenti con pulsante esplicito “Carica altri appuntamenti”;
Agenda carica il range visibile (massimo 45 giorni per richiesta), non lo storico
intero. Le richieste pendenti seguono il filtro `unconfirmed` di Cal.com, che
ancora la ricerca a circa un'ora prima del momento corrente. Gli appuntamenti
passati restano consultabili tramite Agenda. Un refresh manuale aggiorna le
modifiche effettuate esternamente; non sono previsti webhook o polling continuo.

Il login usa la Function dedicata `newstyle-login`, con rate limit Netlify di
10 richieste/minuto per IP e dominio, valido anche sul suo URL diretto. Il vecchio
router non accetta login. Il contatore locale aggiuntivo limita 10 tentativi
falliti o contemporanei in 15 minuti per istanza; un accesso riuscito azzera i
fallimenti locali. La regola Netlify conta anche gli accessi riusciti, opera tra
istanze e può impiegare fino a 10 secondi ad applicarsi; non è un limite totale
contro attacchi distribuiti da molti IP.

Dopo il deploy, controllare la validazione della regola nei log di post-processing
Netlify e verificare una risposta 429 sia sul percorso API sia sull’URL diretto:
una regola invalida può non far fallire il deploy. Questo controllo richiede
l’infrastruttura pubblicata e non è coperto dal server HTTP locale.
Riferimento: [rate limiting Netlify](https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/).

La sessione firmata è stateless: logout elimina il cookie dal browser;
la revoca generale si effettua ruotando il segreto o le credenziali admin.
Non esiste revoca individuale di una copia già sottratta del cookie prima della
scadenza. Nessun dato personale viene scritto nei log applicativi.

Aggiornamento mobile NewStyle: su smartphone Agenda si apre in **Elenco**
giornaliero, con orario, cliente, servizio e stato interamente leggibili. **Orari**
apre la griglia a intervalli di 15 minuti, con righe più alte. Su desktop resta
la settimana. Oggi e calendario escludono le richieste rifiutate e annullate.
Il pulsante **Storico richieste** in Agenda mostra confermate, rifiutate e
annullate di tutte le date, indipendentemente dal periodo visualizzato nel
calendario, con filtro per stato e caricamento progressivo. L'ordine è per data
dell'appuntamento decrescente; le confermate includono anche appuntamenti futuri.
Lo storico riflette lo stato attuale conservato da Cal.com, non un registro delle
singole modifiche. Il filtro si applica a ciascuna pagina: quando sono disponibili
altre pagine, usare “Carica altri appuntamenti” anche se quella corrente non ha
corrispondenze. Nessuna prenotazione viene cancellata da Cal.com.

### Recupero e limiti delle chiamate NewStyle

Le risposte JSON vengono validate nel server e nel browser; HTML con status 200,
date e contatti malformati producono un errore leggibile. Un error boundary offre
il ricaricamento se un componente fallisce. Il client limita ogni richiesta,
lettura del corpo compresa, a 30 secondi. Il server usa un budget di 20 secondi
per le letture e 25 per le scritture, con chiamate singole fino a 8 secondi.
Il recupero dei titoli servizi usa al massimo tre chiamate contemporanee e
2,5 secondi complessivi, cache limitata per account (5 minuti, 30 secondi per
errori); se non riesce, resta visibile il titolo della prenotazione.

Una conferma/rifiuto con risposta persa non viene ripetuta automaticamente:
il server e, se necessario, il client rileggono lo stato. Se non è verificabile,
l’interfaccia blocca altre modifiche e propone “Verifica esito”. Uno stato già
coerente con la richiesta restituisce successo senza una seconda scrittura.
Questa riconciliazione non costituisce una transazione: modifiche concorrenti
esterne restano possibili e lo stato letto dipende dalla consistenza di Cal.com.

Agenda conserva data e tipo di vista durante il passaggio allo storico. La
griglia usa tre righe compatte per gli eventi brevi; nomi lunghi possono avere
ellissi, con dettaglio completo apribile. Su smartphone la vista iniziale resta
l’elenco leggibile a larghezza intera.
