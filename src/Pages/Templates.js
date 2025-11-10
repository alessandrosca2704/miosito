import "../Css/Templates.css";
import { Link } from "react-router-dom";

const templates = [
  {
    id: "pro-services",
    title: "Studio Professionale",
    subtitle: "Contabili · Assicuratori · Consulenti",
    blurb:
      "Hero con headline di valore, blocco servizi a tre colonne e CTA 'Prenota una consulenza'. Include sezione testimonianze e pacchetti tariffari.",
    highlights: ["Palette blu profondo", "Timeline certificazioni", "Modulo contatto sticky"]
  },
  {
    id: "craftsmen",
    title: "Artigiani & Professionisti di settore",
    subtitle: "Falegnami · Idraulici · Designer",
    blurb:
      "Layout modulare con ampie foto prima/dopo, lista interventi rapidi e badge di disponibilità immediata. Perfetto per raccontare manualità e fiducia.",
    highlights: ["Hero immersivo", "Slider lavori recenti", "Sezione 'Come lavoro'"]
  },
  {
    id: "nonprofit",
    title: "Associazioni",
    subtitle: "ETS · Onlus · No profit",
    blurb:
      "Struttura narrativa: manifesto, impatto numerico, storie delle persone e call to action donazione/eventi. Integra calendario rapido e form adesioni.",
    highlights: ["Counter impatto", "Story cards", "CTA doppia Donazione / Diventa volontario"]
  },
  {
    id: "sme",
    title: "PMI & Startup",
    subtitle: "Prodotti digitali e servizi B2B",
    blurb:
      "Landing modulare orientata alla conversione: value proposition, blocco feature, social proof e pricing plan. Ideale per aziende innovative.",
    highlights: ["Hero split con mockup", "Loghi clienti", "FAQ accordion"]
  },
  {
    id: "retail",
    title: "Negozi & Attività commerciali",
    subtitle: "Local shop · Boutique · Food",
    blurb:
      "Template one-page con menù rapido, galleria prodotti e sezione orari/posizione. Focus su prenotazione veloce e integrazione mappe.",
    highlights: ["Cards prodotti", "Banner promo", "Mappa interattiva"]
  }
];

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
            src={`${process.env.PUBLIC_URL}/images/preview-templates/${template.id}.jpg`}
            alt={`Anteprima ${template.title}`}
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
        <Link to={`/templates/${template.id}`}><button type="button">Scopri questo Template</button></Link>
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
          Seleziono layout moderni e flessibili per professionisti, imprese e associazioni. Ogni template è
          ottimizzato per performance, SEO e conversione, personalizzabile in pochi giorni.
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
