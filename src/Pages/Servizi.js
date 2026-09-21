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
          <article><h3>Siti web</h3><p>Presenza online, contenuti aggiornabili e contatti per professionisti, PMI e associazioni.</p><Link to="/sviluppo-siti-web">Sviluppo siti web</Link></article>
          <article><h3>Web app</h3><p>Dashboard, strumenti interni e interfacce per organizzare dati e processi.</p><Link to="/webapp">Applicazioni web su misura</Link></article>
          <article><h3>IA e automazioni</h3><p>Analisi del caso d'uso, prototipi e collegamenti tra gli strumenti di lavoro.</p><Link to="/integrazione-ai">Integrazioni IA e automazioni</Link></article>
        </div>
        <section className="service-content__section" id="iot">
          <h2>Prototipi IoT e raccolta dati</h2>
          <p>Per esigenze di monitoraggio valuto prototipi con sensori, microcontrollori e dashboard. Nel portfolio è disponibile la tesi su ESP32, ThingsBoard e manutenzione predittiva: una base concreta per discutere vincoli e fattibilità del progetto.</p>
          <Link to="/portfolio">Consulta il progetto IoT nel portfolio</Link>
        </section>
      </section>
      <ServicesProcess />
      <ServicesRecentProjects />
    </main>
  );
}

export default Servizi;
