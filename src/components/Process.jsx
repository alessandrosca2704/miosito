export default function Process() {
  const steps = [
    { n: 1, title: "Brief & Obiettivi", text: "Capisco bisogni, vincoli e risultati attesi. Definiamo scope e priorità." },
    { n: 2, title: "Prototipo / PoC", text: "Mockup o proof-of-concept veloce per validare l’idea prima di investire." },
    { n: 3, title: "Sviluppo iterativo", text: "Sprint brevi, demo frequenti, feedback continui. Documentazione inclusa." },
    { n: 4, title: "Go-live & Supporto", text: "Deploy, monitoraggio, ottimizzazioni e supporto post-lancio." },
  ];

  return (
    <section className="process">
      <div className="container">
        <h2>Come lavoro</h2>
        <ol className="process-grid">
          {steps.map((s,i) => (
            <li key={s.n} className="process-card reveal" style={{animationDelay:`${0.5+i * 0.5}s`}}>
              <div className="process-badge">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
