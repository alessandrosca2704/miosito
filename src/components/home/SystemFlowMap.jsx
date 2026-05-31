import { getStepStateClass } from "./stepState";

export default function SystemFlowMap({ activeStep, directions, steps }) {
  return (
    <div className="diagram-grid diagram-grid--software" role="img" aria-label="Pipeline dal brief al rilascio">
      <div className="diagram-flow-header">
        <div className="diagram-flow-label">SYSTEM DESIGN FLOW</div>
        <div className="system-progress-track" aria-hidden="true">
          <span />
        </div>
      </div>
      <div className="software-steps">
        {steps.map((step, index) => {
          const stateClass = getStepStateClass(index, activeStep);
          const direction = directions[index];

          return (
            <div className={`software-step-wrap ${stateClass}`} key={step.number}>
              <div className="diagram-box software-step">
                <span className="software-phase">{step.phase}</span>
                <span className="software-number">{step.number}</span>
                <strong>{step.title}</strong>
                <span>{step.subtitle}</span>
              </div>
              {direction && (
                <span
                  className={`software-flow-arrow software-flow-arrow--${direction}`}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
