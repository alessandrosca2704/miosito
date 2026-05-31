export function getStepStateClass(index, activeStep) {
  if (index === activeStep) return "is-active";
  if (index < activeStep) return "is-past";
  if (index === activeStep + 1) return "is-next";
  return "";
}

export function getConnectionStateClass(targetIndex, activeStep) {
  if (activeStep === targetIndex) return "is-active";
  if (activeStep > targetIndex) return "is-past";
  return "";
}

export function getServiceClusterStateClass(activeStep) {
  if (activeStep >= 3 && activeStep <= 5) return "is-active";
  if (activeStep > 5) return "is-past";
  return "";
}
