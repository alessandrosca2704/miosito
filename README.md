# Alessandro Scarimbolo — Developer Portfolio

A responsive personal portfolio and service website for Alessandro Scarimbolo, an IT engineer focused on web applications, AI-enabled workflows, IoT prototypes, and digital solutions for small and medium-sized businesses.

The project is a React single-page application deployed on Netlify. Alongside the public portfolio, it includes interactive business-template demos, a privacy-conscious payroll reconciliation utility, Netlify contact-form integration, and an AI chat assistant backed by a serverless function.

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
- [Contact Form](#contact-form)
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

The application is primarily frontend-driven. It does **not** contain a traditional backend server or database. Server-side chat requests are handled by one Netlify Function, while contact messages use Netlify Forms.

## Key Features

- Responsive portfolio, professional profile, and service pages
- Dedicated IoT and custom web-application offerings
- Data-driven project showcase
- Five interactive one-page business template demos
- Browser-based PDF payroll reconciliation tool
- Netlify contact form with email fallback
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

Netlify CLI prints the local URL, commonly `http://localhost:8888`. Use this mode to test `/.netlify/functions/chatAssistant`, form submissions, and deployment redirects.

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
| `/contatti` | Contact information and inquiry form |
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

## Contact Form

The contact page submits URL-encoded data to Netlify using the form name `contatti`. A matching hidden form in `public/index.html` enables build-time detection.

The form provides required fields, email validation, a spam honeypot, status messages, and an email-client fallback. It is best tested on a Netlify deploy or with `netlify dev`, because `npm start` does not reproduce the entire Forms pipeline.

After deployment, verify submissions and notifications under **Netlify → Forms**.

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

### Contact messages do not arrive

- Keep the `contatti` name identical in `public/index.html` and `Contatti.js`.
- Test a Netlify deploy or `netlify dev`.
- Check Netlify Forms, spam detection, and notifications.

### A payroll PDF cannot be read

- Use an unprotected PDF with selectable text.
- Check parser status messages.
- Verify that the document layout still matches existing rules.
- Develop fixes using synthetic or fully anonymized fixtures.

Never upload real payroll documents to public issues or repositories.

### Preview generation fails

Start the app at `http://localhost:3000`, ensure Chromium can launch, and verify that `public/images/preview-templates/` exists.

## Security and Privacy

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
