import { Link } from "react-router-dom";
import "../Css/secondary-pages.css";
import { paths } from "../data/navigation";


function Webapp() {

  return (
    <main className="secondary-page">
      <header className="secondary-hero">
        <div className="secondary-container reveal">
          <p className="secondary-kicker">Web app</p>
          <h1>Strumenti web su misura per processi reali.</h1>
          <p>
            Progetto dashboard, applicazioni operative e interfacce personalizzate
            per trasformare flussi complessi in strumenti semplici da usare.
          </p>
          <div className="services-hero__actions">
            <Link to={paths.contact} className="btn">Richiedi una valutazione</Link>
            <Link to={paths.services} className="btn secondary">Scopri i servizi</Link>
          </div>
        </div>
      </header>
      <div className="secondary-container service-content">
        <section className="service-content__section reveal">
          <h2>Dashboard e strumenti per il lavoro quotidiano</h2>
          <p>Una web app può riunire dati, rendere consultabili informazioni e guidare attività che oggi richiedono passaggi tra fogli di calcolo e applicazioni separate. Partiamo dagli utenti, dai dati disponibili e dalle operazioni da semplificare.</p>
        </section>
        <section className="service-content__section reveal">
          <h2>Interfacce, API e database</h2>
          <p>Lavoro con React e Node.js, API REST e database come PostgreSQL e MongoDB. Lo stack dipende dal progetto: integrazioni esistenti, ruoli di accesso e manutenzione contano quanto le funzionalità iniziali.</p>
        </section>
        <section className="service-content__section reveal">
          <h2>Dal prototipo al rilascio</h2>
          <p>Definiamo un primo flusso da validare, realizziamo un prototipo e raccogliamo feedback prima di ampliare l'applicazione. Concordiamo test, pubblicazione, monitoraggio e supporto in base all'uso previsto. Collaboro da Bari anche da remoto.</p>
        </section>
        <section className="service-content__section reveal">
          <h2>Un progetto in sviluppo: personaggi D&amp;D 5e</h2>
          <p>Nel portfolio è presente una web app per gestire personaggi D&amp;D 5e, con interfaccia React e dati strutturati. È un esempio di lavoro su interfacce e database; non viene presentato come un caso aziendale concluso o come un risultato commerciale misurato.</p>
        </section>
        <nav className="service-content__links" aria-label="Approfondimenti">
          <Link to="/portfolio">Esplora il portfolio</Link>
          <Link to="/integrazione-ai">Integrazioni IA e automazioni</Link>
          <Link to="/contatti">Descrivimi il processo da migliorare</Link>
        </nav>
      </div>
    </main>
  );
}

export default Webapp;
