import { useEffect, useRef, useState } from "react";
import "../../Css/TemplateDetail.css";

/**
 * Shared layout for the one-page template detail screens.
 * Each template passes structured props so we can keep styling consistent
 * while still rendering bespoke content blocks.
 */
export default function TemplateLayout({
  id,
  theme = "neutral",
  hero,
  stats = [],
  highlights = [],
  sections = [],
  stickyCta,
  quickNav
}) {
  const [isStickyOpen, setIsStickyOpen] = useState(false);
  const stickyRef = useRef(null);

  useEffect(() => {
    if (!stickyCta || !isStickyOpen) return;
    const handleOutside = (event) => {
      if (stickyRef.current && !stickyRef.current.contains(event.target)) {
        setIsStickyOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setIsStickyOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [stickyCta, isStickyOpen]);

  useEffect(() => {
    if (!stickyCta) return;
    setIsStickyOpen(false);
  }, [id, stickyCta]);

  return (
    <main className={`template-detail template-detail--${id} theme-${theme}`}>
      {quickNav && quickNav.items?.length > 0 && (
        <nav className="template-detail__quick-nav reveal" aria-label={quickNav.label}>
          <p>{quickNav.label}</p>
          <div className="template-detail__quick-nav-links">
            {quickNav.items.map((item) => (
              <a key={item.target} href={`#${item.target}`}>
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}

      <header className="template-detail__hero reveal" data-template={id}>
        <div className="template-detail__hero-copy">
          {hero?.eyebrow && <span className="eyebrow">{hero.eyebrow}</span>}
          <h1>{hero?.title}</h1>
          {hero?.subtitle && <p className="template-detail__lead">{hero.subtitle}</p>}
          {hero?.description && <p className="template-detail__body">{hero.description}</p>}

          {(hero?.ctas?.length || hero?.badges?.length) && (
            <div className="template-detail__hero-actions">
              <div className="template-detail__cta-stack">
                {hero?.ctas?.map((cta) => (
                  <a
                    key={cta.label}
                    href={cta.href || "#"}
                    className={`btn ${cta.variant === "ghost" ? "btn-ghost" : "btn-primary"}`}
                  >
                    {cta.label}
                  </a>
                ))}
              </div>
              {hero?.badges?.length > 0 && (
                <ul className="template-detail__badges">
                  {hero.badges.map((badge) => (
                    <li key={badge}>{badge}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {hero?.media && (
          <figure className="template-detail__hero-media">
            <img src={hero.media.src} alt={hero.media.alt || hero.title} loading="lazy" />
            {hero.media.caption && <figcaption>{hero.media.caption}</figcaption>}
          </figure>
        )}
      </header>

      {stats.length > 0 && (
        <section className="template-detail__stats reveal" aria-label="Indicatori principali">
          {stats.map((stat) => (
            <article key={stat.label}>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
              {stat.detail && <span>{stat.detail}</span>}
            </article>
          ))}
        </section>
      )}

      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className={`template-section reveal ${section.variant ? `template-section--${section.variant}` : ""}`}
        >
          <header>
            {section.eyebrow && <span className="eyebrow">{section.eyebrow}</span>}
            <h2>{section.title}</h2>
            {section.description && <p>{section.description}</p>}
          </header>
          <div className="template-section__content">{section.content}</div>
        </section>
      ))}

      {highlights.length > 0 && (
        <section className="template-detail__highlights reveal" aria-label="Punti di forza">
          <h2>Punti di forza</h2>
          <ul>
            {highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {stickyCta && (
        <>
          <aside
            ref={stickyRef}
            id={stickyCta.id || "contatto"}
            className={`template-detail__sticky-cta${
              isStickyOpen ? "" : " template-detail__sticky-cta--hidden"
            }`}
            aria-live="polite"
            role="dialog"
            aria-modal="false"
            aria-label={stickyCta.title}
          >
            <button
              type="button"
              className="template-detail__sticky-close"
              aria-label="Chiudi modulo"
              onClick={() => setIsStickyOpen(false)}
            >
              <span aria-hidden="true">×</span>
            </button>
            <div>
              <p className="eyebrow">{stickyCta.eyebrow}</p>
              <h3>{stickyCta.title}</h3>
              <p>{stickyCta.description}</p>
              {stickyCta.points && (
                <ul>
                  {stickyCta.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </div>

            <form>
              {stickyCta.fields?.map((field) => (
                <label key={field.name}>
                  <span>{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea name={field.name} placeholder={field.placeholder} rows="3" />
                  ) : (
                    <input type={field.type || "text"} name={field.name} placeholder={field.placeholder} />
                  )}
                </label>
              ))}
              <button type="button">{stickyCta.ctaLabel || "Invia richiesta"}</button>
              {stickyCta.helper && <small>{stickyCta.helper}</small>}
            </form>
          </aside>

          {!isStickyOpen && (
            <button
              type="button"
              className="template-cta-toggle"
              aria-expanded={isStickyOpen}
              aria-controls={stickyCta.id || "contatto"}
              onClick={() => setIsStickyOpen(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 15h-2v-4H7v-2h4V7h2v4h4v2h-4v4Z"
                />
              </svg>
              <span>Apri modulo</span>
            </button>
          )}
        </>
      )}
    </main>
  );
}
