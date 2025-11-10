import TemplateLayout from "./TemplateLayout";

const heroMedia = {
  src: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
  alt: "Artigiano che lavora manualmente il legno"
};

const quickFixes = [
  { label: "Riparazioni urgenti", detail: "Intervento entro 24h su perdite, serrature, cabine" },
  { label: "Restyling arredi", detail: "Carteggiatura, verniciatura e personalizzazioni su misura" },
  { label: "Progettazione su misura", detail: "Render rapidi e distinta materiali pronta per il cliente" }
];

const process = [
  { step: "Sopralluogo", detail: "Arrivo con kit fotografico e rilievi laser" },
  { step: "Proposta visiva", detail: "Gallery prima/dopo e selezione finiture" },
  { step: "Esecuzione", detail: "Squadra coordinata, timeline e aggiornamenti live" }
];

const works = [
  {
    title: "Cucina su misura",
    tag: "Legno di rovere",
    result: "-3 giorni grazie a moduli pre tagliati",
    image: "https://images.unsplash.com/photo-1546551613-09c2f83e1ede?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1176"
  },
  {
    title: "Bagno artigianale",
    tag: "Microcemento",
    result: "Nuovo impianto con finitura impermeabile",
    image: "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074"
  },
  {
    title: "Il nostro Showroom",
    tag: "Illuminazione",
    result: "Percorso visitor con pannelli retroilluminati",
    image: "https://images.unsplash.com/photo-1687180498602-5a1046defaa4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
  }
];

const beforeAfter = {
  before: {
    src: "https://images.unsplash.com/photo-1738474429314-9c5f19d56824?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    alt: "Ambiente prima della ristrutturazione"
  },
  after: {
    src: "https://images.unsplash.com/photo-1720247520862-7e4b14176fa8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1228",
    alt: "Ambiente dopo il restyling"
  }
};

const workshopShots = [
  {
    src: "https://plus.unsplash.com/premium_photo-1664302186256-3ce895002630?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    alt: "Dettaglio strumenti artigianali"
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1682147364229-f5faa0fd9bd7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    alt: "Interno di una bottega"
  },
  {
    src: "https://images.unsplash.com/photo-1681726267024-04427f16ad45?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    alt: "Artigiani durante la fase di finitura"
  }
];

export default function CraftsmenTemplate() {
  return (
    <TemplateLayout
      id="craftsmen"
      theme="artisan"
      hero={{
        eyebrow: "Template • Artigiani & professionisti",
        title: "Storytelling visivo per lavori manuali di alto livello",
        subtitle:
          "Un layout immersivo che mette al centro foto prima/dopo, disponibilità immediata e lista interventi rapidi.",
        description:
          "Il template alterna blocchi fotografici a sezioni informative, così l'utente percepisce subito manualità e affidabilità.",
        media: heroMedia,
        ctas: [
          { label: "Richiedi preventivo", href: "#richiesta" },
          { label: "Scarica brochure", href: "#lavori", variant: "ghost" }
        ],
        badges: ["Disponibilità 24/7", "Hero immersivo"]
      }}
      stats={[
        { label: "Anni di esperienza sul campo", value: "15" },
        { label: "Progetti completati", value: "430+" },
        { label: "Valutazione media", value: "4.9/5" }
      ]}
      sections={[
        {
          id: "galleria",
          eyebrow: "Prima / dopo",
          title: "Gallery full width per raccontare la trasformazione",
          description: "Due pannelli sovrapposti con slider manuale per mostrare il prima e dopo.",
          content: (
            <div className="before-after">
              <article className="before-after__panel">
                <span className="badge">Prima</span>
                <img src={beforeAfter.before.src} alt={beforeAfter.before.alt} loading="lazy" />
                <p>Stato iniziale documentato con punti critici e note tecniche.</p>
              </article>
              <article className="before-after__panel">
                <span className="badge">Dopo</span>
                <img src={beforeAfter.after.src} alt={beforeAfter.after.alt} loading="lazy" />
                <p>Visualizzazione finale con dettagli di finitura e materiali impiegati.</p>
              </article>
            </div>
          )
        },
        {
          id: "interventi",
          eyebrow: "Interventi rapidi",
          title: "Lista dinamica con badge disponibilità",
          description: "Ogni voce mostra tempi, strumenti necessari e vantaggio competitivo.",
          content: (
            <div className="card-grid">
              {quickFixes.map((item) => (
                <article key={item.label} className="card">
                  <div className="availability-badge">
                    <span role="img" aria-label="fulmine">
                      ⚡
                    </span>
                    Pronto
                  </div>
                  <h3>{item.label}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          )
        },
        {
          id: "lavori",
          eyebrow: "Slider",
          title: "Ultimi lavori con tag tecnici",
          description: "Card orizzontali scorrono e mostrano materiali principali e risultato.",
          content: (
            <div className="slider">
              {works.map((work) => (
                <article key={work.title} className="slider__item">
                  <div className="slider__media">
                    <img src={work.image} alt={work.title} loading="lazy" />
                  </div>
                  <h3>{work.title}</h3>
                  <p className="badge">{work.tag}</p>
                  <p>{work.result}</p>
                </article>
              ))}
            </div>
          )
        },
        {
          id: "processo",
          eyebrow: "Come lavoro",
          title: "Processo in tre step molto chiari",
          description: "Illustrazione testuale con spiegazione di strumenti e tempistiche.",
          content: (
            <ul className="steps">
              {process.map((item) => (
                <li key={item.step}>
                  <strong>{item.step}</strong>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
          )
        },
        {
          id: "bottega",
          eyebrow: "Dietro le quinte",
          title: "Moodboard della bottega",
          description: "Una mini gallery per raccontare ambienti, texture e attrezzatura.",
          content: (
            <div className="media-grid media-grid--photo">
              {workshopShots.map((shot) => (
                <img key={shot.src} src={shot.src} alt={shot.alt} loading="lazy" />
              ))}
            </div>
          )
        }
      ]}
      highlights={["Hero immersivo", "Slider lavori recenti", "Sezione 'Come lavoro'"]}
      stickyCta={{
        id: "richiesta",
        eyebrow: "Preventivo flash",
        title: "Conferma disponibilità in 2 ore",
        description: "Compila rapidamente gli elementi essenziali per ricevere una proposta dettagliata.",
        points: ["Checklist materiali", "Sopralluogo digitale", "Garanzia 24 mesi"],
        fields: [
          { name: "nome", label: "Nome", placeholder: "Laura" },
          { name: "telefono", label: "Telefono", placeholder: "+39 320 123 4567" },
          { name: "servizio", label: "Servizio richiesto", placeholder: "Restauro tavolo antico" },
          { name: "messaggio", label: "Descrizione", type: "textarea", placeholder: "Inserisci misure, stile, urgenza" }
        ],
        ctaLabel: "Verifica disponibilità",
        helper: "Ricevi risposta con foto di riferimento e costo stimato."
      }}
    />
  );
}
