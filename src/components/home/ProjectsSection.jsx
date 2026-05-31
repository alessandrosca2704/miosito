import SectionHeading from "./SectionHeading";

export default function ProjectsSection({ projects }) {
  return (
    <section className="projects-story" aria-labelledby="projects-title">
      <SectionHeading
        kicker="Progetti"
        title="Casi studio sintetici, dal sito vetrina ai sistemi IoT."
        titleId="projects-title"
      />
      <div className="project-rail">
        {projects.map((project, index) => (
          <article className="case-card" data-scroll-reveal key={project.title} style={{ "--delay": `${index * 90}ms` }}>
            <div className="case-card__media">
              <img src={project.image} alt="" loading="lazy" />
            </div>
            <div className="case-card__body">
              <span>Case study {String(index + 1).padStart(2, "0")}</span>
              <h3>{project.title}</h3>
              <dl>
                <div>
                  <dt>Problema</dt>
                  <dd>{project.problem}</dd>
                </div>
                <div>
                  <dt>Valore</dt>
                  <dd>{project.result}</dd>
                </div>
              </dl>
              <ul className="case-card__stack" aria-label="Tecnologie usate">
                {project.stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
              <a
                className="case-card__link"
                href={project.link}
                target={project.link.startsWith("http") || project.link.endsWith(".pdf") ? "_blank" : undefined}
                rel={project.link.startsWith("http") || project.link.endsWith(".pdf") ? "noopener noreferrer" : undefined}
              >
                {project.linkLabel}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
