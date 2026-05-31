import { useEffect, useState } from "react";

export default function useDelayedStep(activeStep, delayMs, reducedMotion) {
  const [renderedStep, setRenderedStep] = useState(activeStep);

  useEffect(() => {
    if (activeStep === renderedStep) return undefined;

    if (reducedMotion) {
      setRenderedStep(activeStep);
      return undefined;
    }

    const transitionTimer = window.setTimeout(() => {
      setRenderedStep(activeStep);
    }, delayMs);

    return () => window.clearTimeout(transitionTimer);
  }, [activeStep, renderedStep, delayMs, reducedMotion]);

  return {
    renderedStep,
    isTransitioning: activeStep !== renderedStep,
  };
}
