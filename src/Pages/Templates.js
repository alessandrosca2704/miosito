import { Link } from "react-router-dom";
import "../Css/Templates.css";

import { templates } from "../data/templates";

function TemplateCard({ template }) {
  return (
    <article className="template-card">
      <header className="template-card__header">
        <div className="template-card__chip">{template.subtitle}</div>
        <h2>{template.title}</h2>
      </header>

      <div className="template-preview" data-template={template.id}>
        <div className="template-preview__hero">
          <img
            src={`/images/preview-templates/${template.id}.webp`}
            alt={`Anteprima ${template.title}`}
            width="1440"
            height={template.previewHeight}
            loading="lazy"
          />
        </div>
        <div className="template-preview__body">
          <div className="template-preview__block" />
          <div className="template-preview__block template-preview__block--sm" />
          <div className="template-preview__block template-preview__block--pill" />
        </div>
      </div>

      <p className="template-card__blurb">{template.blurb}</p>

      <ul className="template-card__highlights">
        {template.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="template-card__cta">
        <Link to={`/templates/${template.id}`}>Scopri questo Template</Link>
      </div>
    </article>
  );
}

export default function Templates() {
  return (
    <main className="templates">
      <section className="templates-hero">
        <span className="eyebrow">Libreria</span>
        <h1>Template one-page pronti per il tuo business</h1>
        <p>
          Seleziono layout moderni e flessibili per professionisti, imprese e associazioni. Sono esempi dimostrativi: contenuti, immagini e funzionalità vengono definiti per il tuo progetto.
        </p>
      </section>

      <section className="templates-grid" aria-label="Anteprime template">
        {templates.map((tpl) => (
          <TemplateCard key={tpl.id} template={tpl} />
        ))}
      </section>
    </main>
  );
}
