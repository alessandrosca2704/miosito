import TemplateLayout from "./TemplateLayout";

const heroMedia = {
  src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  alt: "Team prodotto mentre presenta un mockup"
};

const features = [
  { title: "Value proposition chiara", detail: "Hero split con copy, KPI e CTA sempre visibile.", icon: "⚡" },
  { title: "Feature modulari", detail: "Tre blocchi benefit con icone e micro-copy mirate.", icon: "🧩" },
  { title: "Proof sociale", detail: "Loghi clienti e quote sintetiche per rassicurare buyer.", icon: "⭐" }
];

const caseStudies = [
  {
    company: "AtlasPay",
    result: "+142% inbound demo",
    quote: "Abbiamo lanciato la nuova pagina in 9 giorni, con CRM già integrato.",
    image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80"
  },
  {
    company: "DevSpark",
    result: "Lead qualificati x3",
    quote: "Hero video, highlights e FAQ ci hanno ridotto i tempi di prevendita.",
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80"
  },
  {
    company: "OmniSoft",
    result: "CAC -28%",
    quote: "Pricing modulare e CTA sticky hanno spinto le trial automatiche.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
  }
];

const plans = [
  {
    name: "Launch",
    price: "€1.490",
    detail: "setup one-page + automation",
    features: ["Hero + 5 blocchi custom", "Copywriting SEO", "Integrazione CRM base"]
  },
  {
    name: "Scale",
    price: "€2.290",
    detail: "piattaforma + nurturing",
    featured: true,
    features: ["Hero video + mockup", "Social proof avanzato", "Automazioni e-mail"],
    tag: "Più richiesto"
  },
  {
    name: "Enterprise",
    price: "Custom",
    detail: "roadmap e sprint dedicati",
    features: ["Studio CX completo", "Design system dedicato", "Workshop stakeholder"]
  }
];

const faqs = [
  { q: "Quanto tempo serve per lanciare?", a: "Con asset pronti bastano 10 giorni lavorativi." },
  { q: "È ottimizzato per SEO?", a: "Heading, schema markup e immagini compressi sono inclusi." },
  { q: "Posso collegare CRM / HubSpot?", a: "Sì, integriamo webhook e API no-code in fase di handoff." }
];

export default function SmeTemplate() {
  return (
    <TemplateLayout
      id="sme"
      theme="business"
      hero={{
        eyebrow: "Template • PMI & Startup",
        title: "Landing modulare pensata per la conversione B2B",
        subtitle:
          "Value proposition immediata, blocchi feature, prova sociale e pricing plan. Tutto pronto per test A/B e campagne performance.",
        description:
          "Hero split con mockup del prodotto, sezioni dinamiche per casi d'uso e pacchetti con CTA distinte.",
        media: heroMedia,
        ctas: [
          { label: "Prenota una demo", href: "#contatto" },
          { label: "Guarda il mockup", href: "#mockup", variant: "ghost" }
        ],
        badges: ["Hero split con mockup", "Performance first"]
      }}
      stats={[
        { label: "Pagine lanciate", value: "65" },
        { label: "Tasso medio conversione", value: "4,8%" },
        { label: "Tempo medio realizzazione", value: "10 gg" }
      ]}
      sections={[
        {
          id: "value-prop",
          eyebrow: "Value Proposition",
          title: "Tre punti chiave per spiegare il prodotto",
          description: "Blocco con icone e bullet orientate ai benefici.",
          content: (
            <div className="card-grid">
              {features.map((feature) => (
                <article key={feature.title} className="card">
                  <h3>
                    <span className="badge badge--ghost">{feature.icon}</span> {feature.title}
                  </h3>
                  <p>{feature.detail}</p>
                </article>
              ))}
            </div>
          )
        },
        {
          id: "mockup",
          eyebrow: "Hero split",
          title: "Mockup dispositivo + copy a contrasto",
          description: "Colonna sinistra testo, destra mockup o video embed.",
          content: (
            <div className="media-grid">
              <div className="slider__media">
                <img
                  src="https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1000&q=80"
                  alt="Mockup prodotto su laptop"
                  loading="lazy"
                />
              </div>
              <article className="card">
                <h3>Headline</h3>
                <p>Support copy che in tre righe spiega vantaggio competitivo e CTA.</p>
                <ul>
                  <li>CTA primaria e secondaria</li>
                  <li>Snippet codice / API</li>
                  <li>Badge sicurezza e partner</li>
                </ul>
              </article>
            </div>
          )
        },
        {
          id: "clienti",
          eyebrow: "Loghi clienti",
          title: "Social proof credibile",
          description: "Riga loghi + quote breve per rassicurare buyer.",
          content: (
            <div className="card-grid">
              {["AtlasPay", "GreenLoop", "DevSpark", "OmniSoft"].map((logo) => (
                <article key={logo} className="card">
                  <strong>{logo}</strong>
                  <p>+120% lead qualificati</p>
                </article>
              ))}
            </div>
          )
        },
        {
          id: "case-studies",
          eyebrow: "Case studies",
          title: "Slider con risultati tangibili",
          description: "Ogni card mostra immagine, KPI e citazione del cliente.",
          content: (
            <div className="slider">
              {caseStudies.map((cs) => (
                <article key={cs.company} className="slider__item">
                  <div className="slider__media">
                    <img src={cs.image} alt={cs.company} loading="lazy" />
                  </div>
                  <h3>{cs.company}</h3>
                  <p className="badge">{cs.result}</p>
                  <p>{cs.quote}</p>
                </article>
              ))}
            </div>
          )
        },
        {
          id: "pricing",
          eyebrow: "Pricing plan",
          title: "Tre pacchetti con CTA chiare",
          description: "Box con tag 'Più richiesto' sul piano intermedio.",
          content: (
            <div className="pricing-grid">
              {plans.map((plan) => (
                <article key={plan.name} className={`pricing-card${plan.featured ? " is-featured" : ""}`}>
                  <div className="badge">{plan.tag || plan.name}</div>
                  <strong>{plan.price}</strong>
                  <small>{plan.detail}</small>
                  <ul>
                    {plan.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <button type="button" className="btn btn-primary">
                    Inizia ora
                  </button>
                </article>
              ))}
            </div>
          )
        },
        {
          id: "faq",
          eyebrow: "FAQ accordion",
          title: "Risposte alle obiezioni classiche",
          description: "Sezione utile per customer care e per SEO semantica.",
          content: (
            <div className="faq">
              {faqs.map((item) => (
                <article key={item.q} className="faq__item">
                  <strong>{item.q}</strong>
                  <p>{item.a}</p>
                </article>
              ))}
            </div>
          )
        }
      ]}
      highlights={["Hero split con mockup", "Loghi clienti", "FAQ accordion"]}
      stickyCta={{
        id: "contatto",
        eyebrow: "Prenota una demo",
        title: "Condividi il tuo funnel",
        description: "Ti rispondiamo con KPI stimati e timeline dettagliata.",
        points: ["Analisi funnel", "Suggerimenti CRO", "Roadmap personalizzata"],
        fields: [
          { name: "nome", label: "Nome", placeholder: "Sara, Growth Manager" },
          { name: "azienda", label: "Azienda", placeholder: "Startup / PMI" },
          { name: "email", label: "Email", type: "email", placeholder: "sara@startup.com" },
          { name: "messaggio", label: "Sfida principale", type: "textarea", placeholder: "Lead qualificati, inbound, ecc." }
        ],
        ctaLabel: "Richiedi demo",
        helper: "Slot video di 30 minuti + recap PDF."
      }}
    />
  );
}
