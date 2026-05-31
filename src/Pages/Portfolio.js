import { portfolioProjects } from "../data/projects";
import PortfolioGrid from "../components/portfolio/PortfolioGrid";
import "../Css/Portfolio.css";

export default function Portfolio() {
  return (
    <main className="portfolio-page secondary-page">
      <header className="portfolio-hero secondary-hero">
        <div className="secondary-container portfolio-hero__inner reveal">
          <p className="secondary-kicker">Portfolio</p>
          <h1>Soluzioni digitali costruite attorno a problemi reali.</h1>
          <p>
            Una selezione di progetti sviluppati tra IoT, web app e siti web.
            Ogni soluzione nasce da un vincolo concreto e viene costruita su
            misura per restare semplice, utile e mantenibile.
          </p>
          <div className="portfolio-hero__stats" aria-label="Ambiti progettuali">
            <span>Web app</span>
            <span>IoT</span>
            <span>Siti su misura</span>
          </div>
        </div>
      </header>

      <PortfolioGrid projects={portfolioProjects} />
    </main>
  );
}
