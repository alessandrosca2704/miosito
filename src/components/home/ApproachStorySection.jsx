import ApproachDiagram from "./ApproachDiagram";
import ApproachMobileTimeline from "./ApproachMobileTimeline";
import ApproachStepCard from "./ApproachStepCard";
import ApproachStepList from "./ApproachStepList";
import SectionHeading from "./SectionHeading";

export default function ApproachStorySection({
  activeStep,
  isTransitioning,
  onStepSelect,
  renderedStep,
  sectionRef,
  steps,
}) {
  const currentStep = steps[renderedStep];

  return (
    <section className="approach-story" ref={sectionRef} aria-labelledby="approach-title">
      <div className="approach-story__pin">
        <SectionHeading
          kicker="Metodo di lavoro"
          title="Dal problema al rilascio, una decisione tecnica alla volta."
          titleId="approach-title"
        />

        <div className="approach-stage">
          <ApproachStepCard
            isTransitioning={isTransitioning}
            renderedStep={renderedStep}
            step={currentStep}
          />

          <ApproachDiagram
            activeStep={activeStep}
            currentStep={currentStep}
            isTransitioning={isTransitioning}
            renderedStep={renderedStep}
            steps={steps}
          />

          <ApproachStepList activeStep={activeStep} onStepSelect={onStepSelect} steps={steps} />
        </div>

        <ApproachMobileTimeline activeStep={activeStep} steps={steps} />
      </div>
    </section>
  );
}
