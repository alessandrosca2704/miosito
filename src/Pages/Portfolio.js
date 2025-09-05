import { Link } from "react-router-dom";
import "../Css/Portfolio.css";

export default function Portfolio() {
  const projects = [
    {
      id: 1,
      title: "Progettazione di un sistema IoT basato su sensori di movimento per il controllo di sistemi industriali ",
      desc: "La mia Tesi di Laurea, basata su Sensori ESP32 + dashboard ThingsBoard per controllo delle vibrazioni e manutenzione predittiva.",
      img: "images/Portfolio/ESP32.png",
      pdf: "files/Tesi.pdf"
    },
    {
      id: 2,
      title: "Web App per creazione di Pg in Dungeon & Dragons 5e",
      desc: "Gestione di grandi db ed interattività user-friendly, sviluppata in React + Node.js.",
      img: "/images/Portfolio/workinprogress.jpg",
      link: "/portfolio/webapp"
    },
    {
      id: 3,
      title: "Sito vetrina per Gruppo Scout Bari 14",
      desc: "Sito responsive, aggiornabile dal cliente.",
      img: "/images/Portfolio/SitoSCOUT.png",
      link: "https://alessandrosca2704.wixsite.com/bari-14"
    },
  ];

  return (
    <section className="portfolio-page">
      <header className="portfolio-hero">
        <div className="container  reveal delay-1">
          <h1>Portfolio</h1>
          <p>
            Una selezione di progetti sviluppati tra IoT, web app e siti web.  
            Ogni soluzione è costruita su misura per le esigenze del cliente.
          </p>
        </div>
      </header>

      <div className="container projects-grid">
        {projects.map(p => (
          <article key={p.id} className="project-card reveal" style={{animationDelay:`${0.5+p.id*0.5}s`}}>
            <div className="project-img">
              <img src={p.img} alt={p.title} />
            </div>
            <div className="project-body">
              <h2>{p.title}</h2>
              <p>{p.desc}</p>
              <div className="actions">
                {p.link && <Link to={p.link} className="btn">Dettagli</Link>}
                {p.pdf && (
                  <a href={p.pdf} target="_blank" rel="noopener noreferrer" className="btn secondary">
                    Apri PDF
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
