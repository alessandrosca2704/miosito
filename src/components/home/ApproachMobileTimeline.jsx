export default function ApproachMobileTimeline({ activeStep, steps }) {
  return (
    <div className="approach-mobile-timeline" aria-label="Percorso del metodo">
      {steps.map((step, index) => (
        <article
          className={`approach-mobile-step ${index === activeStep ? "is-active" : index < activeStep ? "is-past" : ""}`}
          key={step.title}
          aria-current={index === activeStep ? "step" : undefined}
        >
          <span className="approach-mobile-step__index">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <span>{step.eyebrow}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            <code>{step.signal}</code>
          </div>
        </article>
      ))}
    </div>
  );
}
