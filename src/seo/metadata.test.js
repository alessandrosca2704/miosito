/* eslint-disable testing-library/no-node-access -- Head metadata has no accessible roles; inspect the document head directly. */
import { render, cleanup } from "@testing-library/react";
import useDocumentMeta from "../hooks/useDocumentMeta";
import { getMetadata, getStructuredData, normalizePath, routes, SITE_URL } from "./metadata";

function Head({ path }) { useDocumentMeta(path); return null; }
afterEach(() => { cleanup(); document.head.innerHTML = ""; });

test("navigation replaces metadata, resets noindex and removes stale canonical on 404", () => {
  const view = render(<Head path="/" />);
  view.rerender(<Head path="/contatti" />);
  expect(document.title).toBe(routes['/contatti'].title);
  expect(document.querySelector('link[rel="canonical"]').href).toBe(SITE_URL + '/contatti');
  expect(document.querySelector('meta[property="og:url"]').content).toBe(SITE_URL + '/contatti');
  view.rerender(<Head path="/templates/sme" />);
  expect(document.querySelector('meta[name="robots"]').content).toBe('noindex, follow');
  expect(document.getElementById('site-schema')).toBeNull();
  view.rerender(<Head path="/servizi" />);
  expect(document.querySelector('meta[name="robots"]').content).toBe('index, follow');
  expect(document.querySelectorAll('#site-schema')).toHaveLength(1);
  view.rerender(<Head path="/does-not-exist" />);
  expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  expect(document.querySelector('meta[property="og:url"]')).toBeNull();
  expect(document.querySelector('meta[name="robots"]').content).toBe('noindex, follow');
  expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1);
});

test("canonical policy consolidates aliases and slash/case variants", () => {
  expect(normalizePath('/Servizi/')).toBe('/servizi');
  expect(getMetadata('/iot/').canonical).toBe(SITE_URL + '/servizi');
  expect(getMetadata('/portfolio/webapp').canonical).toBe(SITE_URL + '/webapp');
  expect(getMetadata('/missing').canonical).toBeNull();
});

test("each public route has distinct metadata and only actual services have Service schema", () => {
  expect(new Set(Object.values(routes).map(route => route.title)).size).toBe(Object.keys(routes).length);
  expect(new Set(Object.values(routes).map(route => route.description)).size).toBe(Object.keys(routes).length);
  expect(getStructuredData(getMetadata('/bustapaga'))).toBeNull();
  expect(getStructuredData(getMetadata('/webapp'))['@graph'].some(entity => entity['@type'] === 'Service')).toBe(true);
  expect(getStructuredData(getMetadata('/chi-sono'))['@graph'].some(entity => entity['@type'] === 'Service')).toBe(false);
});
