export default function ApproachStepList({ activeStep, onStepSelect, steps }) {
  return (
    <ol className="approach-steps" aria-label="Step del metodo">
      {steps.map((step, index) => (
        <li className={index === activeStep ? "is-active" : ""} key={step.title}>
          <button
            type="button"
            onClick={() => onStepSelect(index)}
            aria-current={index === activeStep ? "step" : undefined}
          >
            <span>{step.eyebrow}</span>
            <strong>{step.title}</strong>
          </button>
        </li>
      ))}
    </ol>
  );
}
