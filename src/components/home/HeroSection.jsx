import { Link } from "react-router-dom";
import HeroArchitectureVisual from "./HeroArchitectureVisual";

export default function HeroSection({ activeStep, nodes, sectionRef, visualRef }) {
  return (
    <section className="home-hero" ref={sectionRef} aria-labelledby="home-title">
      <div className="home-hero__pin">
        <div className="home-hero__copy" data-scroll-reveal>
          <p className="home-kicker">Web app, IA e architetture software per PMI</p>
          <h1 id="home-title">Ciao, sono Alessandro Scarimbolo, ingegnere informatico.</h1>
          <p className="home-hero__lead">
            <span className="home-hero__lead-full">
              Progetto e sviluppo siti web, web app, soluzioni IoT e integrazioni IA
              per trasformare processi complessi in strumenti digitali semplici,
              scalabili e misurabili.
            </span>
            <span className="home-hero__lead-mobile">
              Sviluppo web app, soluzioni IoT e integrazioni IA per trasformare processi complessi in strumenti semplici e misurabili.
            </span>
          </p>
          <div className="home-hero__actions" aria-label="Azioni principali">
            <Link to="/contatti" className="home-btn home-btn--primary">
              Parliamo di un progetto
            </Link>
            <Link to="/portfolio" className="home-btn home-btn--ghost">
              Vedi i progetti
            </Link>
          </div>
          <div className="home-hero__meta" aria-label="Specializzazioni">
            <span>React</span>
            <span>Node.js</span>
            <span>IoT</span>
            <span>Integrazione IA</span>
          </div>
        </div>

        <div className="home-hero__visual" ref={visualRef} aria-hidden="true">
          <HeroArchitectureVisual activeStep={activeStep} nodes={nodes} />
        </div>
      </div>
    </section>
  );
}
