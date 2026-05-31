import { Link } from "react-router-dom";
import {
  serviceHeroBenefits,
  serviceHeroTags,
  serviceVisualNodes,
} from "../../data/services";

function ServicesHeroVisual() {
  return (
    <aside className="services-hero-visual reveal" style={{ "--delay": "120ms" }} aria-label="Schema dei servizi">
      <div className="services-visual-card services-visual-card--input">
        <span>Brief</span>
        <strong>Esigenza PMI</strong>
        <p>Vincoli, processi e obiettivi diventano una mappa tecnica chiara.</p>
      </div>

      <div className="services-visual-flow" aria-label="Aree di intervento">
        {serviceVisualNodes.map((node, index) => (
          <div className="services-visual-node" style={{ "--node-delay": `${index * 120}ms` }} key={node.title}>
            <span>{node.title}</span>
            <p>{node.text}</p>
          </div>
        ))}
      </div>

      <div className="services-visual-card services-visual-card--output">
        <span>Release</span>
        <strong>Strumento online</strong>
        <p>Una soluzione usabile, monitorabile e pronta per crescere.</p>
      </div>
    </aside>
  );
}

export default function ServicesHero() {
  return (
    <header className="services-hero" aria-labelledby="services-title">
      <div className="secondary-container services-hero__grid">
        <div className="services-hero__copy reveal">
          <p className="secondary-kicker">Servizi digitali per PMI</p>
          <h1 id="services-title">Soluzioni su misura per PMI</h1>
          <p className="services-hero__lead">
            Dallo <strong>sviluppo web</strong> alle <strong>soluzioni IA</strong>:
            progetto, realizzo e rendo disponibili online strumenti semplici,
            veloci e scalabili.
          </p>

          <ul className="services-benefits" aria-label="Vantaggi principali">
            {serviceHeroBenefits.map((benefit) => (
              <li key={benefit}>
                <span className="services-benefit__icon" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>

          <div className="services-hero__actions">
            <Link to="/contatti" className="services-btn services-btn--primary">
              Richiedi preventivo
            </Link>
            <Link to="/portfolio" className="services-btn services-btn--ghost">
              Vedi progetti
            </Link>
          </div>

          <div className="services-badges" aria-label="Ambiti e disponibilita">
            <span className="services-badge services-badge--dark">IA / Web App / Siti Web</span>
            <span className="services-badge services-badge--ok">Disponibile per nuovi progetti</span>
            {serviceHeroTags.map((tag) => (
              <span className="services-badge" key={tag}>{tag}</span>
            ))}
          </div>
        </div>

        <ServicesHeroVisual />
      </div>
    </header>
  );
}
