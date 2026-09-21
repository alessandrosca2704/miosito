import { Link } from "react-router-dom";

function ProjectAction({ project }) {
  if (project.pdf) {
    return (
      <a href={project.pdf} target="_blank" rel="noopener noreferrer" className="portfolio-card__link">
        {project.cta || "Apri PDF"}
      </a>
    );
  }

  if (!project.link) return null;

  const isExternal = /^https?:\/\//.test(project.link);
  if (isExternal) {
    return (
      <a href={project.link} target="_blank" rel="noopener noreferrer" className="portfolio-card__link">
        {project.cta || "Visita"}
      </a>
    );
  }

  return (
    <Link to={project.link} className="portfolio-card__link">
      {project.cta || "Dettagli"}
    </Link>
  );
}

export default function PortfolioCard({ project, index, headingLevel = "h2" }) {
  const Heading = headingLevel;
  return (
    <article className="portfolio-card reveal" style={{ "--delay": `${index * 90}ms` }}>
      <div className="portfolio-card__media">
        {project.img ? (
          <img src={project.img} srcSet={project.srcSet} sizes="(max-width: 760px) 100vw, (max-width: 1160px) 50vw, 33vw" width={project.width} height={project.height} alt="" loading="lazy" decoding="async" />
        ) : (
          <div className="portfolio-card__fallback" aria-hidden="true">
            {project.category}
          </div>
        )}
        <span className="portfolio-card__category">{project.category}</span>
      </div>

      <div className="portfolio-card__body">
        <div className="portfolio-card__tags" aria-label="Tecnologie">
          {project.tags?.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <Heading>{project.title}</Heading>
        <p>{project.desc}</p>
        <ProjectAction project={project} />
      </div>
    </article>
  );
}
