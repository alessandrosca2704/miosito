export default function ApproachDiagram({ activeStep, currentStep, isTransitioning, renderedStep, steps }) {
  return (
    <div className="approach-visual" aria-hidden="true">
      <div
        className={`approach-core ${isTransitioning ? "is-exiting" : "is-entering"}`}
        key={`core-${renderedStep}`}
      >
        <span>{String(renderedStep + 1).padStart(2, "0")}</span>
        <strong>{currentStep.title}</strong>
      </div>
      {steps.map((step, index) => (
        <div
          className={`approach-node ${index === activeStep ? "is-active" : ""}`}
          key={step.title}
          style={{ "--node-index": index }}
        >
          {step.title}
        </div>
      ))}
    </div>
  );
}
