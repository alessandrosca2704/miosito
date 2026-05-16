import { Link } from "react-router-dom";
import "../Css/Portfolio.css";
import portfolioContent from "../content/portfolio.json";

export default function Portfolio() {
  const { pageTitle, intro, projects } = portfolioContent;

  return (
    <section className="portfolio-page">
      <header className="portfolio-hero">
        <div className="container reveal delay-1">
          <h1>{pageTitle}</h1>
          <p>{intro}</p>
        </div>
      </header>

      <div className="container projects-grid">
        {projects.map((project) => (
          <article
            key={project.id}
            className="project-card reveal"
            style={{ animationDelay: `${0.5 + project.id * 0.5}s` }}
          >
            <div className="project-img">
              <img src={project.img} alt={project.title} />
            </div>
            <div className="project-body">
              <h2>{project.title}</h2>
              <p>{project.desc}</p>
              <div className="actions">
                {project.link && (
                  <Link to={project.link} className="btn" target="_blank">
                    Dettagli
                  </Link>
                )}
                {project.pdf && (
                  <a
                    href={project.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn secondary"
                  >
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
