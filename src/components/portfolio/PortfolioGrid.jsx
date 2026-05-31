import PortfolioCard from "./PortfolioCard";

export default function PortfolioGrid({ projects }) {
  return (
    <section className="portfolio-grid-section" aria-label="Progetti selezionati">
      <div className="secondary-container portfolio-grid">
        {projects.map((project, index) => (
          <PortfolioCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
