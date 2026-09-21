import { useEffect } from "react";
import { getMetadata, getStructuredData, serializeJson, getMetaEntries } from "../seo/metadata";

function setMeta(attribute, name, content) {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export default function useDocumentMeta(pathname) {
  useEffect(() => {
    const meta = getMetadata(pathname);
    document.title = meta.title;
    getMetaEntries(meta).forEach(([attribute, name, content]) => setMeta(attribute, name, content));
    if (!meta.canonical) document.head.querySelector('meta[property="og:url"]')?.remove();
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (meta.canonical) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = meta.canonical;
    } else canonical?.remove();
    document.getElementById("site-schema")?.remove();
    const structuredData = getStructuredData(meta);
    if (structuredData) {
      const script = document.createElement("script");
      script.id = "site-schema";
      script.type = "application/ld+json";
      script.textContent = serializeJson(structuredData);
      document.head.appendChild(script);
    }
  }, [pathname]);
}
