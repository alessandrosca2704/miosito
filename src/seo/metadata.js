import routes from "./routes.json";

export const SITE_URL = "https://www.alessandroscarimbolo.it";
export const aliases = { "/iot": "/servizi", "/web-app": "/webapp", "/portfolio/webapp": "/webapp" };
export { routes };

export function normalizePath(pathname) {
  return pathname.replace(/\/+$/, "").toLowerCase() || "/";
}

export function getMetadata(pathname) {
  const normalized = normalizePath(pathname);
  const path = aliases[normalized] || normalized;
  const page = routes[path];
  if (!page) return {
    title: "Pagina non trovata | Alessandro Scarimbolo",
    description: "La pagina richiesta non esiste. Esplora i servizi e i progetti di Alessandro Scarimbolo oppure contattalo.",
    noindex: true,
    canonical: null,
    path,
  };
  return { ...page, path, canonical: `${SITE_URL}${path}` };
}

export function getStructuredData(meta) {
  if (!meta.canonical || meta.noindex) return null;
  const personId = `${SITE_URL}/#person`;
  const graph = [
    { "@type": "Person", "@id": personId, name: "Alessandro Scarimbolo", url: `${SITE_URL}/`, jobTitle: "Ingegnere informatico", sameAs: ["https://www.linkedin.com/in/alessandro-scarimbolo"] },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: "Alessandro Scarimbolo", inLanguage: "it-IT", publisher: { "@id": personId } },
  ];
  if (meta.service) graph.push({
    "@type": "Service", "@id": `${meta.canonical}#service`, name: meta.service,
    url: meta.canonical, description: meta.description, provider: { "@id": personId }, areaServed: "Italia",
  });
  return { "@context": "https://schema.org", "@graph": graph };
}

export function serializeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

// The same head fields are used by static generation and client-side navigation.
export function getMetaEntries(meta) {
  const entries = [
    ["name", "description", meta.description],
    ["name", "robots", meta.noindex ? "noindex, follow" : "index, follow"],
  ];
  for (const [name, value] of Object.entries({ title: meta.title, description: meta.description, type: "website", image: `${SITE_URL}/preview.png`, locale: "it_IT" })) {
    entries.push(["property", `og:${name}`, value]);
  }
  if (meta.canonical) entries.push(["property", "og:url", meta.canonical]);
  for (const [name, value] of Object.entries({ card: "summary_large_image", title: meta.title, description: meta.description, image: `${SITE_URL}/preview.png` })) {
    entries.push(["name", `twitter:${name}`, value]);
  }
  return entries;
}
