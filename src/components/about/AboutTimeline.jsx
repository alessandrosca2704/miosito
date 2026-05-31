export default function AboutTimeline({ items }) {
  return (
    <section className="about-timeline" aria-labelledby="about-timeline-title">
      <div className="about-section-heading reveal">
        <p className="secondary-kicker">Percorso</p>
        <h2 id="about-timeline-title">Dalla formazione tecnica al rilascio operativo.</h2>
      </div>

      <ol className="about-steps">
        {items.map((item, index) => (
          <li className="about-step reveal" key={item.step} style={{ "--delay": `${index * 120}ms` }}>
            <span className="about-badge">{item.step}</span>
            <div>
              <h3>{item.title}</h3>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
