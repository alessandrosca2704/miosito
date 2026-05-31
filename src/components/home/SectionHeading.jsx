export default function SectionHeading({ kicker, title, description, titleId, className = "section-heading" }) {
  return (
    <div className={className} data-scroll-reveal>
      <p className="home-kicker">{kicker}</p>
      <h2 id={titleId}>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}
