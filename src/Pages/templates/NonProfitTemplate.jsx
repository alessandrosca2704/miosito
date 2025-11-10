import TemplateLayout from "./TemplateLayout";

const heroMedia = {
  src: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80",
  alt: "Volontari che collaborano durante un evento"
};

const impact = [
  { label: "Famiglie supportate", value: "1.250", detail: "Rete alimentare e sostegno psicologico" },
  { label: "Progetti attivi", value: "32", detail: "Ambiente, educazione, inclusione" },
  { label: "Volontari coinvolti", value: "480", detail: "Formazione continua e tutoraggio" }
];

const stories = [
  {
    name: "Amina, 12 anni",
    detail: "Con il kit scuola e le borse di studio ha potuto tornare in classe. Ora sogna di diventare ostetrica nel suo villaggio.",
    image: "https://images.unsplash.com/photo-1744809495173-217ca4faa8bc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
  },
  {
    name: "Paola, 34 anni",
    detail: "Ha riscoperto il proprio lavoro nel fare del bene.",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Cooperativa Aurora",
    detail: "Nuovo laboratorio tessile con 12 artigiane impiegate.",
    image: "https://images.unsplash.com/photo-1624525005654-c828ed32950d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
  }
];

const calendar = [
  { date: "12 NOV", title: "Flash Mob per il Clima", note: "Piazza centrale ore 18" },
  { date: "24 NOV", title: "Workshop Inclusione", note: "Spazio Civico, 20 posti" },
  { date: "2 DIC", title: "Cena Solidale", note: "Fundraising con chef ospite" }
];

const communityShots = [
  {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
    alt: "Evento comunitario all'aperto"
  },
  {
    src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80",
    alt: "Distribuzione viveri solidale"
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1723485635064-37739fd9918e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1976",
    alt: "Riunione operativa dei volontari"
  }
];

export default function NonProfitTemplate() {
  return (
    <TemplateLayout
      id="nonprofit"
      theme="civic"
      hero={{
        eyebrow: "Template • Associazioni & ETS",
        title: "Racconta il tuo impatto con numeri, storie e call to action mirate",
        subtitle:
          "Un'unica pagina scorrevole che accompagna l'utente dal manifesto alla donazione, evidenziando metriche e storie umane.",
        description:
          "Blocchi editoriali alternano copy caldo, counter e card narrative. In fondo un form adesioni e calendario eventi.",
        media: heroMedia,
        ctas: [
          { label: "Fai una donazione", href: "#donazioni" },
          { label: "Diventa volontario", href: "#contatto", variant: "ghost" }
        ],
        badges: ["CTA doppia", "Story cards"]
      }}
      stats={[
        { label: "Anni sul territorio", value: "18" },
        { label: "Partner istituzionali", value: "45" },
        { label: "Progetti raccontati", value: "50+" }
      ]}
      sections={[
        {
          id: "manifesto",
          eyebrow: "Manifesto",
          title: "Dichiara missione, visione e valori in modo chiaro",
          description: "Intro narrativa con messaggio del direttivo e foto di gruppo.",
          content: (
            <div className="card">
              <p>
                Crediamo in comunità resilienti dove nessuno resta indietro. La pagina apre con manifesto, firma del
                direttivo e link a statuto e bilancio sociale per la massima trasparenza.
              </p>
              <ul>
                <li>Pillole di vision con icone custom</li>
                <li>Citazione del presidente</li>
                <li>Link a documenti ufficiali</li>
              </ul>
            </div>
          )
        },
        {
          id: "impatto",
          eyebrow: "Counter impatto",
          title: "Numeri aggiornati in tempo reale",
          description: "Griglia con KPI e mini descrizioni per contestualizzare.",
          content: (
            <div className="card-grid">
              {impact.map((item) => (
                <article key={item.label} className="card">
                  <span className="badge">{item.label}</span>
                  <h3>{item.value}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          )
        },
        {
          id: "storie",
          eyebrow: "Story cards",
          title: "Persone e micro-narrazioni",
          description: "Card verticali con ritratto, citazione e CTA di approfondimento.",
          content: (
            <div className="story-cards">
              {stories.map((story) => (
                <article key={story.name} className="story-card">
                  <img src={story.image} alt={story.name} loading="lazy" />
                  <h3>{story.name}</h3>
                  <p>{story.detail}</p>
                  <a href="#storie">Leggi tutto →</a>
                </article>
              ))}
            </div>
          )
        },
        {
          id: "community",
          eyebrow: "Gallery",
          title: "La tua comunità in immagini",
          description: "Tre scatti evocativi per far percepire subito energia e partecipazione.",
          content: (
            <div className="media-grid media-grid--photo">
              {communityShots.map((shot) => (
                <img key={shot.src} src={shot.src} alt={shot.alt} loading="lazy" />
              ))}
            </div>
          )
        },
        {
          id: "eventi",
          eyebrow: "Calendario rapido",
          title: "Eventi ed iniziative imminenti",
          description: "Mini calendario con CTA eventi e volontariato.",
          content: (
            <>
              <div className="calendar">
                {calendar.map((item) => (
                  <div key={item.title} className="calendar__item">
                    <strong>{item.date}</strong>
                    <span>{item.title}</span>
                    <small>{item.note}</small>
                  </div>
                ))}
              </div>
              <div className="cta-double" id="donazioni">
                <a className="cta-primary" href="#contatto">
                  Donazione veloce
                </a>
                <a className="cta-secondary" href="#contatto">
                  Diventa volontario
                </a>
              </div>
            </>
          )
        }
      ]}
      highlights={["Counter impatto", "Story cards", "CTA doppia Donazione / Diventa volontario"]}
      stickyCta={{
        id: "contatto",
        eyebrow: "Form adesioni",
        title: "Partecipa al prossimo evento",
        description: "Raccolta contatti orientata a donatori ricorrenti e nuovi volontari.",
        points: ["Segmento donatori / volontari", "Preferenze di attività", "Newsletter opt-in"],
        fields: [
          { name: "nome", label: "Nome", placeholder: "Giulia" },
          { name: "email", label: "Email", type: "email", placeholder: "giulia@email.com" },
          { name: "ruolo", label: "Come vuoi contribuire?", placeholder: "Volontaria, donatrice, partner..." },
          { name: "messaggio", label: "Messaggio", type: "textarea", placeholder: "Parlaci della tua motivazione" }
        ],
        ctaLabel: "Invia adesione",
        helper: "Ti risponderemo entro 12 ore con calendario aggiornato."
      }}
    />
  );
}
