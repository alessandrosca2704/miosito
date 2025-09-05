import { Link } from "react-router-dom";
import "../Css/Chisono.css";
import TechStack from "../component/TechStack";
function Chisono(){
    return(
        
        <section className="about">
        <header className="about-hero reveal delay-1">
        <h1>Chi sono?</h1>
        <p>
            Ciao, sono <strong>Alessandro</strong> , sono un <b>Ingegnere Informatico</b> con una forte passione per l'innovazione, la semplicità e le soluzioni che funzionano <b>davvero</b>.Attualmente lavoro come <b>capotreno per Trenitalia</b>, una professione che mi ha insegnato rigore, precisione operativa e gestione delle responsabilità in ambienti complessi. Parallelamente, porto avanti la mia attività di sviluppatore freelance, dove unisco la mia formazione tecnica all’esperienza concreta nel mondo reale.Nel tempo libero, <b>che libero non è mai davvero</b>, progetto e realizzo soluzioni digitali su misura per piccole e medie imprese, con un focus particolare su:
        </p>
        </header>
        <section className="about-services">
            <div className="about-card reveal delay-3">
                <div className="about-ic">Web & Web App</div>
                <h3>🌐</h3>
                <p>Siti moderni e veloci, web-app su misura con attenzione a UX e performance.</p>
            </div>
            <div className="about-card reveal delay-4">
                    <div className="about-ic">Soluzioni IoT</div>
                    <h3>📡</h3>
                    <p>Sistemi embedded, ESP32, raccolta dati e dashboard (ThingsBoard, Grafana).</p>
            </div>
            <div className="about-card reveal delay-5">
                <div className="about-ic">Prototipi & Consulenza</div>
                    <h3>⚙️</h3>
                    <p>Proof-of-Concept rapidi, analisi tecnica e supporto al rilascio/monitoraggio.</p>
             </div>
        </section>
        {/* STACK TECNOLOGICO (CHIPS) */}
   
      <TechStack/>

      {/* TIMELINE SINTETICA */}
      <section className="about-timeline">
        <h2>Percorso</h2>
        <ol className="about-steps">
          <li className="about-step reveal delay-6">
            <span className="about-badge">1</span>
            <div>
              <h4>Formazione</h4>
              <p>-Diploma Liceo Scientifico Scienze Applicate <b>100/100</b></p>
              <p>-Certificazioni <b>Cisco System Inc:</b>  Internet of Everything , Connecting Things </p>
              <p>-<b>Ingegneria informatica</b>, fondamenta solide tra software e sistemi.</p>
            </div>
          </li>
          <li className="about-step  reveal delay-7">
            <span className="about-badge">2</span>
            <div>
              <h4>Esperienza operativa</h4>
              <p>-Esperienza presso uno  <b>studio contabile</b> come <b>gestore di banche dati</b></p>
              <p>-Ruolo da <b>Junior Developer</b> presso <b>Fincons Group</b></p>
              <p>-Ruolo da <b>Capotreno</b> per <b>Trenitalia</b>: rigore, responsabilità e gestione in contesti complessi.</p>
            </div>
          </li>
          <li className="about-step  reveal delay-8">
            <span className="about-badge">3</span>
            <div>
              <h4>Freelance</h4>
              <p>Progetti IoT e web per PMI e no-profit: soluzioni pratiche e documentate.</p>
            </div>
          </li>
        </ol>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>Parliamo del tuo progetto?</h2>
        <p>Che sia un prototipo IoT o una web-app, ti aiuto a farlo partire in modo concreto.</p>
        <div className="about-cta-actions">
          <Link to="/contatti" className="about-btn about-btn--primary">Contattami</Link>
          <Link to="/portfolio" className="about-btn">Vedi i progetti</Link>
        </div>
      </section>
        {/*<ul>
            <li><h3>Sviluppo Web e Web App</h3>
                <ul>
                    <li>Siti web moderni, responsive e veloci</li>
                    <li>Web app interattive per desktop e mobile</li>
                    <li>Gestionali , dashboard, strumenti su misura</li>
                </ul>
            </li>
            <li>
                <h4>Tecnologie Utilizzate:</h4>
                <ul>
                    <li><b>Frontend:</b>React , Angular , HTML5 , CSS3, JavaScript , Tailwind CSS</li>
                    <li><b>Backend:</b> Java , Spring boot</li>
                    <li><b>Database:</b> PostgreSQL, SQLite</li>
                </ul>
            </li>
            <li>
                <h3>Soluzioni IoT</h3>
                <ul>
                    <li>Proggettazione e sviluppo di <b>sistemi embedded</b></li>
                    <li>Integrazione di <b>microcontrollori</b> come ESP32 e Arduino</li>
                    <li>Raccolta e analisi dati da sensori industriali o ambientali</li>
                    <li>Inegrazione con <b>dashboard online</b> come ThingsBoard e Grafana</li>
                </ul>
            </li>
            <li>
                <h4>Tecnologie e Tool</h4>
                <ul>
                    <li>C/C++ per microcontrollori</li>
                    <li>MQTT, HTTP, WebSocket</li>
                    <li>Librerie e SDK ESP-IDF , PlatformIO</li>
                    <li>Dashboard custom o opensource (Grafana, ThingsBoard)</li>
                </ul>
            </li>
        </ul>*/}
        </section>
    );
}
export default Chisono;