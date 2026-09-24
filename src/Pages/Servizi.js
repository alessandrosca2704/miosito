import { Link } from "react-router-dom";
import ServicesHero from "../components/services/ServicesHero";
import ServicesProcess from "../components/services/ServicesProcess";
import ServicesRecentProjects from "../components/services/ServicesRecentProjects";
import "../Css/Portfolio.css";
import "../Css/Servizi.css";


function Servizi() {

  return (
    <main className="services-page secondary-page">
      <ServicesHero />
      <section className="secondary-container" aria-labelledby="service-options-title">
        <h2 id="service-options-title">Quale soluzione serve alla tua attività?</h2>
        <div className="service-links-grid">
          <Link className="service-option-card" to="/sviluppo-siti-web" aria-labelledby="option-web"><h3 id="option-web"><span>Siti web</span></h3><p>Presenza online, contenuti aggiornabili e contatti per professionisti, PMI e associazioni.</p></Link>
          <Link className="service-option-card" to="/webapp" aria-labelledby="option-app"><h3 id="option-app"><span>Web app</span></h3><p>Dashboard, strumenti interni e interfacce per organizzare dati e processi.</p></Link>
          <Link className="service-option-card" to="/integrazione-ai" aria-labelledby="option-ai"><h3 id="option-ai"><span>IA e automazioni</span></h3><p>Analisi del caso d'uso, prototipi e collegamenti tra gli strumenti di lavoro.</p></Link>
        </div>
        <section className="service-content__section services-desktop-only" id="iot">
          <h2>Prototipi IoT e raccolta dati</h2>
          <p>Per esigenze di monitoraggio valuto prototipi con sensori, microcontrollori e dashboard. Nel portfolio è disponibile la tesi su ESP32, ThingsBoard e manutenzione predittiva: una base concreta per discutere vincoli e fattibilità del progetto.</p>
          <Link className="services-btn services-btn--primary services-iot-button" to="/portfolio">Consulta il progetto IoT nel portfolio</Link>
        </section>
        <details className="services-mobile-only services-iot-details">
          <summary>Ti servono sensori o raccolta dati?</summary>
          <p>Valutiamo un prototipo IoT per monitorare impianti e raccogliere dati.</p>
         <Link className="services-btn services-btn--primary services-iot-button" to="/portfolio">Esplora il progetto IoT nel portfolio →</Link>
        </details>
      </section>
      <ServicesProcess />
      <ServicesRecentProjects />
      <section className="services-mobile-only services-mobile-contact secondary-container" aria-labelledby="services-contact-title">
        <h2 id="services-contact-title">Parliamo della tua idea</h2>
        <p>Ti aiuto a capire da dove partire.</p>
        <Link to="/contatti" className="services-btn services-btn--primary">Contattami</Link>
      </section>
    </main>
  );
}

export default Servizi;
