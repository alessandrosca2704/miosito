export default function ApproachStepCard({ step, renderedStep, isTransitioning }) {
  return (
    <div className="approach-copy" data-scroll-reveal>
      <div
        className={`approach-copy__content ${isTransitioning ? "is-exiting" : "is-entering"}`}
        key={renderedStep}
      >
        <span>{step.eyebrow}</span>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
        <code>{step.signal}</code>
      </div>
    </div>
  );
}
