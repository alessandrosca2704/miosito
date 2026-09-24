import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { serviceDetails } from "../../data/serviceDetails";
import { templates } from "../../data/templates";
import "../../Css/secondary-pages.css";
import "../../Css/service-landing.css";

const presentation = {
  websites: {
    label: "Siti web", accent: "Design, contenuti, identità.",
    capabilities: [
      ["Siti vetrina", "Presenta la tua attività con servizi chiari, progetti e contatti facili da trovare."],
      ["Contenuti aggiornabili", "Un CMS quando serve autonomia per pubblicare novità e aggiornare le pagine."],
      ["Landing page", "Una pagina dedicata a un servizio, con un percorso semplice verso il contatto."],
    ],
    steps: ["Ascolto e contenuti", "Direzione visiva", "Sviluppo responsive", "Pubblicazione e supporto"],
    cta: "Diamo una forma alla tua attività.",
    prompt: "Partiamo da un template o da una nuova idea: raccontami cosa vuoi comunicare.",
  },
  ai: {
    label: "Integrazioni IA", accent: "Un processo chiaro, prima del modello.",
    capabilities: [
      ["Assistenti informativi", "Aiuta le persone a orientarsi tra servizi e informazioni selezionate."],
      ["Supporto sui documenti", "Valutiamo estrazione e sintesi delle informazioni, con verifica dell'operatore."],
      ["Automazioni tra strumenti", "Collega le attività ripetitive tramite API, usando l'IA soltanto dove è utile."],
    ],
    steps: ["Analisi del processo", "Prototipo circoscritto", "Verifica degli output", "Integrazione e monitoraggio"],
    cta: "Quale attività vorresti semplificare?",
    prompt: "Descrivimi un passaggio ripetitivo del tuo lavoro. Valutiamo insieme come affrontarlo.",
  },
  webapp: {
    label: "Web app", accent: "Meno passaggi. Più chiarezza.",
    capabilities: [
      ["Dashboard", "Riunisci le informazioni utili in una vista progettata per chi le usa ogni giorno."],
      ["Applicazioni operative", "Organizza attività, dati e ruoli attorno al tuo processo di lavoro."],
      ["Strumenti connessi", "Collega servizi e database per ridurre i passaggi tra applicazioni separate."],
    ],
    steps: ["Utenti e requisiti", "Prototipo del flusso", "Sviluppo e integrazioni", "Test e rilascio"],
    cta: "Il tuo processo, in uno strumento su misura.",
    prompt: "Raccontami come lavori oggi e quali passaggi vorresti rendere più semplici.",
  },
};

function ApproachDetail({ section }) {
  const [expanded, setExpanded] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const id = useId();
  // Without JavaScript the original explanations remain readable.
  useEffect(() => setInteractive(true), []);
  return <article className="service-detail" data-interactive={interactive} data-collapsed={interactive && !expanded}>
    <h3><span className="service-detail__title">{section.title}</span><button className="service-detail__toggle" type="button" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(!expanded)}>{section.title}<span aria-hidden="true">{expanded ? "−" : "+"}</span></button></h3>
    <p id={id}>{section.text}</p>
  </article>;
}

function BrowserFrame({ children, label, className = "" }) {
  return <div className={`service-browser ${className}`}>
    <div className="service-browser__bar"><span aria-hidden="true">● ● ●</span><span>{label}</span><span aria-hidden="true">↗</span></div>
    {children}
  </div>;
}

function HeroVisual({ service }) {
  if (service === "websites") return <figure className="service-visual service-visual--sites">
    <BrowserFrame label="Studio professionale · Template">
      <img src="/images/preview-templates/pro-services.webp" width="1440" height="652" alt="Anteprima del template per studi professionali" fetchPriority="high" />
    </BrowserFrame>
    <div className="service-visual__inset"><img src="/images/preview-templates/craftsmen.webp" width="1440" height="652" alt="Anteprima del template per artigiani" /></div>
    <figcaption><span className="service-dot" /> Due stili, un punto di partenza: la tua attività.</figcaption>
  </figure>;
  if (service === "ai") return <figure className="service-visual service-flow">
    <figcaption className="service-visual__caption">DALLA RICHIESTA AL RISULTATO <span>Flusso illustrativo</span></figcaption>
    <ol className="service-flow__nodes">
      <li><span className="service-node-icon" aria-hidden="true">01</span><div><strong>Una richiesta concreta</strong><span>Informazioni e contesto selezionati</span></div></li>
      <li className="service-flow__core"><span className="service-node-icon" aria-hidden="true">✦</span><div><strong>Elaborazione assistita</strong><span>Modello + strumenti del progetto</span></div></li>
      <li><span className="service-node-icon" aria-hidden="true">✓</span><div><strong>Verifica della persona</strong><span>Controllo prima dell'azione</span></div></li>
    </ol>
    <div className="service-flow__foot">Dati insufficienti? <strong>Il flusso torna all'operatore.</strong></div>
  </figure>;
  return <figure className="service-visual service-dashboard">
    <BrowserFrame label="Area di lavoro · Esempio illustrativo">
      <div className="service-dashboard__body">
        <div className="service-dashboard__heading"><div><small>IL TUO SPAZIO OPERATIVO</small><strong>Ogni attività, al suo posto.</strong></div><span className="service-node-icon" aria-hidden="true">▦</span></div>
        <div className="service-dashboard__stats"><div><span>Da valutare</span><strong>04</strong></div><div><span>In lavorazione</span><strong>08</strong></div><div><span>Completate</span><strong>12</strong></div></div>
        <div className="service-dashboard__table"><div><strong>Attività</strong><strong>Stato</strong></div><div><span>Raccolta requisiti</span><span className="service-status">Completata</span></div><div><span>Revisione prototipo</span><span className="service-status service-status--progress">In corso</span></div><div><span>Collegamento dati</span><span className="service-status service-status--wait">Da valutare</span></div></div>
      </div>
    </BrowserFrame><figcaption>Dati dimostrativi · Interfaccia da progettare sulle tue esigenze</figcaption>
  </figure>;
}

function TemplateShowcase() {
  const [selected, setSelected] = useState(templates[0].id);
  const active = templates.find(template => template.id === selected);
  return <section className="service-section service-showcase" id="template" aria-labelledby="template-heading">
    <div className="service-section__heading"><div><p className="secondary-kicker">Template già realizzati</p><h2 id="template-heading">Trova un punto di partenza.<br /><span>Rendiamolo tuo.</span></h2></div><p>Cinque direzioni visive da esplorare. Colori, contenuti e struttura si adattano alla tua attività: le demo mostrano possibilità, non pacchetti rigidi.</p></div>
    <div className="service-template-options" aria-label="Scegli l'anteprima del template">
      {templates.map((template, i) => <button key={template.id} type="button" aria-pressed={selected === template.id} aria-controls="template-preview" onClick={() => setSelected(template.id)}><span>0{i + 1}</span>{["Professionisti", "Artigiani", "Associazioni", "PMI & startup", "Negozi"][i]}</button>)}
    </div>
    <div className="service-template-stage" id="template-preview">
      <Link className="service-template-image" to={`/templates/${active.id}`} aria-label={`Apri la demo ${active.title}`}><BrowserFrame label={`Anteprima · ${active.title}`}><img src={`/images/preview-templates/${active.id}.webp`} alt={`Layout dimostrativo ${active.title}`} width="1440" height={active.previewHeight} loading="lazy" decoding="async" /></BrowserFrame></Link>
      <div className="service-template-copy"><p className="secondary-kicker">Da personalizzare insieme</p><h3>{active.title}</h3><p>{active.subtitle}</p><ul><li>Identità visiva e palette</li><li>Testi, immagini e servizi</li><li>Sezioni e percorso di contatto</li></ul><Link className="btn" to={`/templates/${active.id}`}>Esplora la demo <span aria-hidden="true">↗</span></Link><Link className="service-secondary-button" to="/templates">Confronta tutti i template →</Link></div>
    </div>
    <p className="service-disclaimer">Le demo contengono testi, immagini e dati illustrativi. Funzionalità e contenuti del sito finale vengono concordati per il progetto.</p>
  </section>;
}

export default function ServiceLanding({ service }) {
  const content = serviceDetails[service];
  const design = presentation[service];
  const isWebsite = service === "websites";
  const feature = content.sections[service === "websites" ? 2 : 3];
  const articles = content.sections.filter(section => section !== feature);
  return <main className={`secondary-page service-landing service-landing--${service}`}>
    <header className="service-landing__hero secondary-container">
      <div className="service-landing__copy"><Link className="service-back" to="/servizi">← Tutti i servizi</Link><p className="secondary-kicker">{content.kicker}</p><h1>{content.title}</h1><p className="service-lead">{content.intro}</p><div className="service-actions"><Link to="/contatti" className="btn">Parliamo del progetto <span aria-hidden="true">↗</span></Link><a href={isWebsite ? "#template" : "#approccio"} className="service-secondary-button">{isWebsite ? "Esplora i template" : "Scopri l’approccio"} ↓</a></div></div>
      <HeroVisual service={service} />
    </header>
    <div className="service-principles"><div className="secondary-container"><span>{design.label}</span><strong>{design.accent}</strong><span>Da Bari, anche da remoto</span></div></div>
    <div className="secondary-container">
      {isWebsite && <TemplateShowcase />}
      <section className="service-section" aria-labelledby="possibilities-heading"><div className="service-section__heading"><div><p className="secondary-kicker">Possibilità concrete</p><h2 id="possibilities-heading">Cosa possiamo realizzare.</h2></div></div><div className="service-capabilities">{design.capabilities.map(([title, text], i) => <article key={title}><span className="service-card-number" aria-hidden="true">0{i + 1} /</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="service-section service-approach" id="approccio" aria-labelledby="approach-heading"><div className="service-section__heading"><div><p className="secondary-kicker">Il progetto, passo dopo passo</p><h2 id="approach-heading">Come prende forma.</h2></div><p>Un percorso condiviso: definiamo le priorità e verifichiamo le scelte prima di ampliare il progetto.</p></div><ol className="service-steps">{design.steps.map((step, i) => <li key={step}><span aria-hidden="true">0{i + 1}</span><strong>{step}</strong></li>)}</ol><div className="service-editorial">{articles.map(section => <ApproachDetail key={section.title} section={section} />)}</div></section>
      <section className="service-feature"><div className="service-feature__mark" aria-hidden="true">{service === "ai" ? "✦" : service === "webapp" ? <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M5 21V3h10v18M15 9h4v12M3 21h18M9 21v-4h2v4M8 6h1m2 0h1M8 10h1m2 0h1M8 14h1m2 0h1M17 12v2m0 2v2" /></svg> : "↗"}</div><div><p className="secondary-kicker">{service === "webapp" ? "Laboratorio · In sviluppo" : "Dal progetto alla pratica"}</p><h2>{feature.title}</h2><p>{feature.text}</p>{service === "ai" ? <button className="service-secondary-button" type="button" onClick={() => window.dispatchEvent(new CustomEvent("open-chat-assistant"))}>Apri l’assistente del sito ↗</button> : service === "webapp" ? <a className="service-secondary-button" href="https://github.com/alessandrosca2704/app-condomini" target="_blank" rel="noopener noreferrer">Segui lo sviluppo su GitHub ↗</a> : <Link className="service-secondary-button" to="/portfolio">Esplora il portfolio →</Link>}</div></section>
      <section className="service-final"><p className="secondary-kicker">Parliamone</p><h2>{design.cta}</h2><p>{design.prompt}</p><Link className="btn" to="/contatti">Raccontami il tuo progetto <span aria-hidden="true">↗</span></Link></section>
      <nav className="service-related" aria-label="Servizi correlati"><span>Continua a esplorare</span><Link to={content.related.to}>{content.related.label} →</Link><Link to="/servizi">Tutti i servizi →</Link></nav>
    </div>
  </main>;
}
