const VALUE_VISUAL_IMAGE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&fm=jpg&q=76&w=1200";

export default function ValueSection({ points }) {
  return (
    <section className="value-section" aria-labelledby="value-title">
      <div className="value-section__intro" data-scroll-reveal>
        <p className="home-kicker">Valore professionale</p>
        <h2 id="value-title">Tecnica, metodo e responsabilita operativa nello stesso percorso.</h2>
        <p>
          La mia esperienza unisce formazione informatica, sviluppo freelance e
          lavoro in ambienti complessi dove precisione e affidabilita contano.
        </p>
        <figure className="value-section__visual">
          <img
            src={VALUE_VISUAL_IMAGE}
            alt="Workspace tecnico con codice e strumenti digitali"
            loading="lazy"
          />
          <figcaption>
            <span>Metodo operativo</span>
            <strong>Dal dato al rilascio</strong>
          </figcaption>
        </figure>
      </div>
      <div className="value-list">
        {points.map((point, index) => (
          <div className="value-item" data-scroll-reveal key={point} style={{ "--delay": `${index * 80}ms` }}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{point}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
