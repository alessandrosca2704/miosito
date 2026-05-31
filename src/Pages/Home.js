import { useRef, useState } from "react";
import ApproachStorySection from "../components/home/ApproachStorySection";
import FinalCta from "../components/home/FinalCta";
import HeroSection from "../components/home/HeroSection";
import SkillsSection from "../components/home/SkillsSection";
import SystemSection from "../components/home/SystemSection";
import ValueSection from "../components/home/ValueSection";
import "../Css/Home.css";
import { approachSteps, APPROACH_TRANSITION_DELAY_MS } from "../data/home/approachSteps";
import { heroArchitectureNodes } from "../data/home/heroArchitecture";
import { skillGroups } from "../data/home/skills";
import { systemFlowDirections, systemFlowSteps } from "../data/home/systemFlow";
import { valuePoints } from "../data/home/valuePoints";
import useDelayedStep from "../hooks/useDelayedStep";
import useDocumentMeta from "../hooks/useDocumentMeta";
import useHomeSectionProgress from "../hooks/useHomeSectionProgress";
import useReducedMotion from "../hooks/useReducedMotion";

const HOME_META_TITLE = "Alessandro Scarimbolo | Ingegnere Informatico, Web App e IA";
const HOME_META_DESCRIPTION =
  "Portfolio professionale di Alessandro Scarimbolo: sviluppo web, web app, integrazione IA, IoT e soluzioni software per PMI.";

function Home() {
  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const heroVisualRef = useRef(null);
  const approachRef = useRef(null);
  const approachStepRef = useRef(0);
  const systemRef = useRef(null);
  const [heroStep, setHeroStep] = useState(0);
  const [approachActiveStep, setApproachActiveStep] = useState(0);
  const [systemStep, setSystemStep] = useState(0);
  const reducedMotion = useReducedMotion();
  const { renderedStep: approachRenderedStep, isTransitioning: isApproachTransitioning } = useDelayedStep(
    approachActiveStep,
    APPROACH_TRANSITION_DELAY_MS,
    reducedMotion
  );

  useDocumentMeta(HOME_META_TITLE, HOME_META_DESCRIPTION);
  useHomeSectionProgress({
    heroRef,
    heroVisualRef,
    heroStepCount: heroArchitectureNodes.length,
    setHeroStep,
    approachRef,
    approachStepRef,
    approachStepCount: approachSteps.length,
    setApproachStep: setApproachActiveStep,
    systemRef,
    systemStepCount: systemFlowSteps.length,
    setSystemStep,
  });

  const handleApproachStepSelect = (index) => {
    approachStepRef.current = index;
    setApproachActiveStep(index);
  };

  return (
    <main className="home-scroll" ref={rootRef}>
      <HeroSection
        activeStep={heroStep}
        nodes={heroArchitectureNodes}
        sectionRef={heroRef}
        visualRef={heroVisualRef}
      />

      <ApproachStorySection
        activeStep={approachActiveStep}
        isTransitioning={isApproachTransitioning}
        onStepSelect={handleApproachStepSelect}
        renderedStep={approachRenderedStep}
        sectionRef={approachRef}
        steps={approachSteps}
      />

      <SkillsSection groups={skillGroups} />
      {/* <ProjectsSection projects={projects} /> */}
      <ValueSection points={valuePoints} />

      <SystemSection
        activeStep={systemStep}
        directions={systemFlowDirections}
        sectionRef={systemRef}
        steps={systemFlowSteps}
      />

      <FinalCta />
    </main>
  );
}

export default Home;
