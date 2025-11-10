import TemplateLayout from "./TemplateLayout";

const heroMedia = {
  src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
  alt: "Consulenti finanziari durante una riunione"
};

const services = [
  {
    title: "Consulenza fiscale",
    description: "Per liberi professionisti e piccole imprese che cercano una guida continuativa.",
    items: ["Bilanci e dichiarativi", "Pianificazione fiscale", "Aggiornamento normativo trimestrale"]
  },
  {
    title: "Risk & assurance",
    description: "Mappatura rischi operativi con simulazioni di scenario e azioni correttive.",
    items: ["Audit documentale", "Timeline certificazioni", "Report per CDA"]
  },
  {
    title: "Welfare & HR",
    description: "Programmi su misura per gestire benefit, fringe benefit e smart working.",
    items: ["Policy personalizzate", "Gestione note spese", "Helpdesk dipendenti"]
  }
];

const timeline = [
  { year: "2020", title: "ISO 9001", detail: "Qualità del processo di consulenza certificata" },
  { year: "2021", title: "ISO 27001", detail: "Gestione sicura dei dati sensibili e privacy" },
  { year: "2022", title: "Partner OCF", detail: "Accreditamento per consulenze finanziarie avanzate" }
];

const officeShots = [
  {
    src: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
    alt: "Board room contemporanea"
  },
  {
    src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
    alt: "Consulente che prepara documentazione"
  },
  {
    src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80",
    alt: "Workshop con clienti corporate"
  }
];

const testimonials = [
  {
    name: "Studio Bianchi",
    result: "+28% marginalità",
    note: "Abbiamo revisionato listino e pacchetti in 3 settimane.",
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Rete Assicurativa Nord",
    result: "NPS 72",
    note: "Supporto compliance e onboarding team digital.",
    image: "https://images.unsplash.com/photo-1544723795-432537f949c5?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Impresa Rossi",
    result: "-35% tempi back office",
    note: "Workflow automatizzati su pratiche ricorrenti.",
    image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80"
  }
];

const pricing = [
  {
    name: "Starter",
    price: "€590",
    detail: "/mese",
    features: ["Consulenza mensile 60 min", "Report KPI", "Supporto entro 48h"]
  },
  {
    name: "Growth",
    price: "€990",
    detail: "/mese",
    featured: true,
    features: ["Consulente dedicato", "Meeting board mensile", "Linea diretta 12h"]
  },
  {
    name: "Corporate",
    price: "Custom",
    detail: "su preventivo",
    features: ["Presenza on-site", "Piano certificazioni", "Training team interno"]
  }
];

export default function ProServicesTemplate() {
  return (
    <TemplateLayout
      id="pro-services"
      theme="ocean"
      hero={{
        eyebrow: "Template • Studio professionale",
        title: "One-page per studi contabili, assicuratori e consulenti",
        subtitle: "Valore percepito e fiducia immediata grazie a servizi chiari, certificazioni e call to action sempre visibile.",
        description:
          "Un flusso a blocchi verticali che guida l'utente dalle competenze al risultato, con timeline certificazioni, fotografie immersive e modulo contatto sticky.",
        media: heroMedia,
        ctas: [
          { label: "Prenota una consulenza", href: "#contatto" },
          { label: "Scarica scheda tecnica", href: "#servizi", variant: "ghost" }
        ],
        badges: ["Palette blu profondo", "Struttura premium", "Tempo medio sviluppo 7gg"]
      }}
      stats={[
        { label: "Clienti gestiti ogni anno", value: "120+" },
        { label: "Tempo medio risposta", value: "2h" },
        { label: "Certificazioni evidenziate", value: "8", detail: "Timeline dinamica" }
      ]}
      sections={[
        {
          id: "servizi",
          eyebrow: "Hero modulare",
          title: "Servizi e pacchetti in tre colonne",
          description: "Ogni blocco mostra deliverable, vantaggi e micro-copy per convertire subito il visitatore.",
          content: (
            <div className="card-grid">
              {services.map((service) => (
                <article key={service.title} className="card">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul>
                    {service.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )
        },
        {
          id: "timeline",
          eyebrow: "Timeline certificazioni",
          title: "Prova sociale istituzionale",
          description: "Uno scroll verticale con milestone, badge ufficiali e link ai documenti.",
          content: (
            <div className="timeline">
              {timeline.map((item) => (
                <div key={item.title} className="timeline__item">
                  <strong>{item.year}</strong>
                  <p>{item.title}</p>
                  <small>{item.detail}</small>
                </div>
              ))}
            </div>
          )
        },
        {
          id: "studio",
          eyebrow: "Moodboard visivo",
          title: "Visual storytelling dello studio",
          description: "Fotografie di riunioni, board room e consulenze per aumentare la fiducia.",
          content: (
            <div className="media-grid media-grid--photo">
              {officeShots.map((shot) => (
                <img key={shot.src} src={shot.src} alt={shot.alt} loading="lazy" />
              ))}
            </div>
          )
        },
        {
          id: "testimonianze",
          eyebrow: "Social proof",
          title: "Testimonianze numeriche e citazioni brevi",
          description: "Card sintetiche con risultato e payoff per valorizzare il passaparola.",
          content: (
            <div className="slider">
              {testimonials.map((item) => (
                <article key={item.name} className="slider__item">
                  <figure>
                    <img src={item.image} alt={item.name} loading="lazy" />
                    <figcaption>
                      <strong>{item.name}</strong>
                    </figcaption>
                  </figure>
                  <h3>{item.name}</h3>
                  <p className="badge">{item.result}</p>
                  <p>{item.note}</p>
                </article>
              ))}
            </div>
          )
        },
        {
          id: "pricing",
          eyebrow: "Pacchetti tariffari",
          title: "Prezzi chiari per ogni livello di consulenza",
          description: "Tabella responsive con tre piani, CTA primaria e microcopy di tranquillità.",
          content: (
            <div className="pricing-grid">
              {pricing.map((plan) => (
                <article
                  key={plan.name}
                  className={`pricing-card${plan.featured ? " is-featured" : ""}`}
                >
                  <span className="badge">{plan.name}</span>
                  <strong>{plan.price}</strong>
                  <small>{plan.detail}</small>
                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <button type="button" className="btn btn-primary">
                    Richiedi proposta
                  </button>
                </article>
              ))}
            </div>
          )
        }
      ]}
      highlights={["Palette blu profondo", "Timeline certificazioni", "Modulo contatto sticky"]}
      stickyCta={{
        id: "contatto",
        eyebrow: "Prenota una consulenza",
        title: "Modulo sticky rapido",
        description: "Risposta in giornata con un mini brief su esigenze e tempistiche.",
        points: ["Slot dedicato 30 minuti", "Diagnosi gratuita", "Report riassuntivo PDF"],
        fields: [
          { name: "nome", label: "Nome e cognome", placeholder: "Mario Rossi" },
          { name: "azienda", label: "Azienda", placeholder: "Studio Associato Rossi" },
          { name: "email", label: "Email", type: "email", placeholder: "nome@azienda.it" },
          { name: "messaggio", label: "Esigenze", type: "textarea", placeholder: "Descrivi che tipo di supporto cerchi" }
        ],
        ctaLabel: "Prenota una chiamata",
        helper: "Riceverai conferma e agenda via email entro 2 ore lavorative."
      }}
    />
  );
}
