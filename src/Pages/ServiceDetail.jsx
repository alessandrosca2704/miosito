import { Link } from "react-router-dom";
import "../Css/secondary-pages.css";

const services = {
  websites: {
    kicker: "Siti web per PMI, professionisti e associazioni",
    title: "Siti web chiari, aggiornabili e costruiti attorno alla tua attività.",
    intro: "Progetto e sviluppo siti per presentare servizi, pubblicare informazioni e facilitare il contatto. Lavoro da Bari, anche da remoto: partiamo dai contenuti e dalle esigenze di chi visiterà il sito.",
    sections: [
      { title: "Dai contenuti alla struttura", text: "Definiamo insieme destinatari, servizi da presentare e azioni principali: chiedere informazioni, consultare un progetto o trovare i contatti. Organizzo pagine e navigazione in modo che ogni contenuto abbia uno scopo preciso." },
      { title: "Sviluppo e gestione dei contenuti", text: "Realizzo interfacce responsive per telefono e desktop. La scelta tra un sito essenziale e una soluzione con CMS dipende da chi aggiornerà i contenuti e con quale frequenza. Valuto accessibilità, peso delle immagini e SEO tecnica durante lo sviluppo." },
      { title: "Esempi di lavoro", text: "Nel portfolio trovi un sito dinamico per uno studio contabile, con contenuti aggiornabili, e un sito vetrina per il Gruppo Scout Bari 14. Sono due esigenze diverse: presentare una professione e organizzare informazioni per un'associazione." },
      { title: "Pubblicazione e supporto", text: "Prima del rilascio controllo navigazione, contatti e visualizzazione sui diversi dispositivi. Concordiamo poi aggiornamenti, manutenzione e supporto. Tempi e costi dipendono da pagine, materiali disponibili e integrazioni richieste." },
    ],
    related: { to: "/templates", label: "Esplora gli esempi di layout" },
  },
  ai: {
    kicker: "IA e automazioni per i processi aziendali",
    title: "Integrare l’IA dove può aiutare il lavoro quotidiano.",
    intro: "Parto da un'attività concreta: organizzare informazioni, assistere un operatore o ridurre passaggi ripetitivi tra strumenti. Prima di scegliere un modello valuto se bastano una regola, un collegamento API o un'automazione tradizionale.",
    sections: [
      { title: "Definire un caso d’uso verificabile", text: "Individuiamo input, risultato atteso, frequenza dell'attività e chi dovrà controllare l'output. Un assistente informativo o un supporto all'analisi dei dati richiedono criteri di verifica diversi. Il prototipo serve a capire l'utilità e i limiti prima di estendere l'integrazione." },
      { title: "Collegare strumenti e dati", text: "Le integrazioni possono collegare una web app ai servizi già utilizzati tramite API. Valuto disponibilità dei dati, permessi, gestione degli errori e costi operativi. Le automazioni senza IA restano una scelta utile quando il processo è deterministico." },
      { title: "Supervisione e gestione degli errori", text: "Le risposte generate possono essere inesatte. Per questo definiamo controlli, informazioni utilizzabili e passaggi che richiedono una conferma umana. Nel prototipo verifichiamo anche cosa succede quando un servizio non risponde o i dati non sono sufficienti." },
      { title: "Un esempio su questo sito", text: "L'assistente digitale del sito risponde a domande generali sui servizi tramite una funzione backend. È un esempio circoscritto di integrazione: per un progetto aziendale occorre valutare dati, utenti e requisiti specifici, senza assumere che lo stesso approccio vada bene per ogni processo." },
    ],
    related: { to: "/webapp", label: "Scopri le web app su misura" },
  },
};

export default function ServiceDetail({ service }) {
  const content = services[service];
  return (
    <main className="secondary-page">
      <header className="secondary-hero">
        <div className="secondary-container reveal">
          <p className="secondary-kicker">{content.kicker}</p>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
          <div className="services-hero__actions">
            <Link to="/contatti" className="btn">Parliamo del progetto</Link>
            <Link to="/portfolio" className="btn secondary">Vedi i progetti</Link>
          </div>
        </div>
      </header>
      <div className="secondary-container service-content">
        {content.sections.map(section => (
          <section className="service-content__section reveal" key={section.title}>
            <h2>{section.title}</h2><p>{section.text}</p>
          </section>
        ))}
        <nav className="service-content__links" aria-label="Approfondimenti">
          <Link to={content.related.to}>{content.related.label}</Link>
          <Link to="/servizi">Tutti i servizi</Link>
          <Link to="/contatti">Richiedi una valutazione</Link>
        </nav>
      </div>
    </main>
  );
}
