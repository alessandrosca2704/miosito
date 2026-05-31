import { Link } from "react-router-dom";
import AboutServiceCard from "../components/about/AboutServiceCard";
import AboutTimeline from "../components/about/AboutTimeline";
import TechStack from "../components/TechStack";
import { aboutServices, aboutTimeline } from "../data/about";
import "../Css/Chisono.css";

function Chisono() {
  return (
    <main className="about secondary-page">
      <header className="about-hero secondary-hero">
        <div className="secondary-container about-hero__inner">
          <div className="about-hero__copy reveal">
            <p className="secondary-kicker">Chi sono</p>
            <h1>Metodo tecnico, responsabilita operativa e soluzioni concrete.</h1>
            <p>
              Sono Alessandro, ingegnere informatico. Unisco formazione tecnica,
              sviluppo freelance ed esperienza in contesti operativi complessi
              per costruire strumenti digitali semplici, scalabili e misurabili.
            </p>
          </div>

          <aside className="about-hero__profile reveal" style={{ "--delay": "120ms" }} aria-label="Sintesi profilo">
            <div className="about-profile-mark" aria-hidden="true">
              <span>AS</span>
              <i />
              <i />
              <i />
            </div>
            <div className="about-profile-card">
              <span>Web & IA Engineer</span>
              <strong>Problemi complessi, soluzioni misurabili.</strong>
            </div>
            <dl className="about-profile-metrics">
              <div>
                <dt>Focus</dt>
                <dd>Web app</dd>
              </div>
              <div>
                <dt>Metodo</dt>
                <dd>PoC</dd>
              </div>
              <div>
                <dt>Output</dt>
                <dd>Release</dd>
              </div>
            </dl>
          </aside>
        </div>
      </header>

      <section className="about-services secondary-container" aria-label="Aree di lavoro">
        {aboutServices.map((service, index) => (
          <AboutServiceCard key={service.title} service={service} index={index} />
        ))}
      </section>

      <section className="about-stack-section secondary-container">
        <TechStack />
      </section>

      <div className="secondary-container">
        <AboutTimeline items={aboutTimeline} />
      </div>

      <section className="about-cta secondary-container reveal">
        <p className="secondary-kicker">Collaborazione</p>
        <h2>Parliamo del tuo progetto?</h2>
        <p>
          Che sia un prototipo IoT, una web app o un'integrazione IA, possiamo
          partire da una valutazione tecnica concreta.
        </p>
        <div className="about-cta-actions">
          <Link to="/contatti" className="about-btn about-btn--primary">Contattami</Link>
          <Link to="/portfolio" className="about-btn">Vedi i progetti</Link>
        </div>
      </section>
    </main>
  );
}

export default Chisono;
