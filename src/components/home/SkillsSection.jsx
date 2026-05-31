import SectionHeading from "./SectionHeading";

export default function SkillsSection({ groups }) {
  return (
    <section className="skills-section" aria-labelledby="skills-title">
      <SectionHeading
        kicker="Competenze"
        title="Stack tecnico organizzato intorno a prodotti reali."
        titleId="skills-title"
        description="Uso tecnologie web, backend, database, IoT e automazione per costruire strumenti concreti, mantenibili e adatti al contesto."
      />
      <div className="skills-grid">
        {groups.map((group, index) => (
          <article className="skill-card" data-scroll-reveal key={group.title} style={{ "--delay": `${index * 70}ms` }}>
            <h3>{group.title}</h3>
            <ul>
              {group.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
