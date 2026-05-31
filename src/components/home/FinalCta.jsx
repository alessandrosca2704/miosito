import { Link } from "react-router-dom";

export default function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="contact-title">
      <div data-scroll-reveal>
        <p className="home-kicker">Contatto</p>
        <h2 id="contact-title">Hai un progetto da costruire?</h2>
        <p>
          Raccontami obiettivi, vincoli e contesto: ti aiuto a trasformare
          l'idea in una soluzione software concreta.
        </p>
        <div className="final-cta__actions">
          <Link to="/contatti" className="home-btn home-btn--primary">
            Contattami
          </Link>
          <a href="/files/CV-SITO.pdf" className="home-btn home-btn--ghost">
            Scarica CV
          </a>
        </div>
      </div>
    </section>
  );
}
