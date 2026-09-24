import { Link } from "react-router-dom";
import PortfolioCard from "../portfolio/PortfolioCard";
import { portfolioProjects } from "../../data/projects";
import { serviceRecentProjectIds } from "../../data/services";

const recentProjects = serviceRecentProjectIds
  .map((id) => portfolioProjects.find((project) => project.id === id))
  .filter(Boolean);

export default function ServicesRecentProjects() {
  return (
    <section className="services-recent secondary-container" aria-labelledby="services-projects-title">
      <div className="services-section-heading services-section-heading--split reveal">
        <div>
          <p className="secondary-kicker">Progetti recenti</p>
          <h2 id="services-projects-title"><span className="services-desktop-only">Esempi concreti di soluzioni gia portate online.</span><span className="services-mobile-only">Un progetto realizzato</span></h2>
          <p className="services-desktop-only">
            Una selezione di lavori coerenti con i servizi: siti, web app e
            strumenti digitali costruiti attorno a esigenze reali.
          </p>
        </div>
        <Link to="/portfolio" className="services-text-link services-desktop-only">Apri portfolio</Link>
      </div>

      <div className="services-recent__grid">
        {recentProjects.map((project, index) => (
          <PortfolioCard headingLevel="h3" key={project.id} project={project} index={index} />
        ))}
      </div>
      <Link to="/portfolio" className="services-mobile-only services-mobile-portfolio">Vedi tutti i progetti →</Link>
    </section>
  );
}
