import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ behavior = "auto" }) {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior });
  }, [pathname, hash, behavior]);

  useEffect(() => {
    if (!hash) return undefined;

    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ block: "start", behavior });
      return undefined;
    }

    const t = setTimeout(() => {
      const el2 = document.getElementById(id);
      el2?.scrollIntoView({ block: "start", behavior });
    }, 50);
    return () => clearTimeout(t);
  }, [hash, behavior]);

  return null;
}
