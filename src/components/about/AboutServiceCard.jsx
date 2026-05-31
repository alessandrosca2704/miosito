export default function AboutServiceCard({ service, index }) {
  return (
    <article className="about-card reveal" style={{ "--delay": `${index * 90}ms` }}>
      <span className="about-card__icon" aria-hidden="true">
        {service.icon}
      </span>
      <div>
        <p className="about-card__eyebrow">{service.eyebrow}</p>
        <h3>{service.title}</h3>
        <p>{service.text}</p>
      </div>
    </article>
  );
}
