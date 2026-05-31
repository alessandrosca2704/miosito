import { useEffect } from "react";

export default function useScrollReveal(rootRef, resetKey) {
  useEffect(() => {
    const root = rootRef?.current || document;
    if (!root) return undefined;

    const revealItems = root.querySelectorAll("[data-scroll-reveal], .reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.hasAttribute("data-scroll-reveal")) {
              entry.target.classList.add("is-visible");
            }
            if (entry.target.classList.contains("reveal")) {
              entry.target.classList.add("in");
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item) => {
      item.classList.remove("is-visible", "in");
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, [rootRef, resetKey]);
}
