// src/components/ScrollToTop.jsx
import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scorre in alto ad ogni cambio pagina.
 * - usa useLayoutEffect per evitare "salti" visibili
 * - gestisce anche gli anchor link (es. /contatti#form)
 */
export default function ScrollToTop({ behavior = "auto" }) {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    // se c'è un #ancora, aspetta il render e scrolla lì
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior });
  }, [pathname]); // ad ogni cambio path

  useEffect(() => {
    if (!hash) return;
    // aspetta che l'elemento con id esista nel DOM
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ block: "start", behavior });
    } else {
      // piccolo retry se il DOM è lento a montarsi
      const t = setTimeout(() => {
        const el2 = document.getElementById(id);
        el2?.scrollIntoView({ block: "start", behavior });
      }, 50);
      return () => clearTimeout(t);
    }
  }, [hash]);

  return null;
}
