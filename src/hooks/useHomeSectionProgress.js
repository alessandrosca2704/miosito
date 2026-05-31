import { useEffect } from "react";

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function getApproachStepFromProgress(progress, currentStep, stepCount) {
  const rawStep = Math.min(stepCount - 1, Math.floor(Math.min(progress, 0.999) * stepCount));
  const hysteresis = 0.035;

  if (rawStep === currentStep) return currentStep;

  if (rawStep > currentStep) {
    const forwardBoundary = rawStep / stepCount;
    return progress > forwardBoundary + hysteresis ? rawStep : currentStep;
  }

  const backwardBoundary = currentStep / stepCount;
  return progress < backwardBoundary - hysteresis ? rawStep : currentStep;
}

function getClosestVisibleStep(items, viewportTarget) {
  const visibleItems = items.filter((item) => item.offsetParent !== null);
  if (!visibleItems.length) return 0;

  return visibleItems.reduce(
    (closest, item, index) => {
      const itemRect = item.getBoundingClientRect();
      const distance = Math.abs(itemRect.top + itemRect.height / 2 - viewportTarget);
      return distance < closest.distance ? { index, distance } : closest;
    },
    { index: 0, distance: Number.POSITIVE_INFINITY }
  ).index;
}

export default function useHomeSectionProgress({
  heroRef,
  heroVisualRef,
  heroStepCount,
  setHeroStep,
  approachRef,
  approachStepRef,
  approachStepCount,
  setApproachStep,
  systemRef,
  systemStepCount,
  setSystemStep,
}) {
  useEffect(() => {
    let frame = 0;

    const updateScrollState = () => {
      frame = 0;
      const viewport = window.innerHeight || 1;

      if (heroRef.current && heroVisualRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const isPinnedHero = window.innerWidth > 1040;
        const sectionTop = window.scrollY + rect.top;
        const progressRange = isPinnedHero
          ? Math.max(rect.height - viewport * 1.05, viewport * 1.35)
          : Math.max(rect.height * 0.51, viewport * 0.63);
        const progress = isPinnedHero
          ? clamp((window.scrollY - Math.max(sectionTop - 24, 0)) / progressRange)
          : clamp((window.scrollY - Math.max(window.scrollY + rect.top - viewport * 0.28, 0)) / progressRange);
        const nextHeroStep =
          window.innerWidth <= 680
            ? [0, 2, 6][Math.min(2, Math.floor(progress * 3))]
            : Math.min(heroStepCount - 1, Math.floor(progress * heroStepCount));

        heroVisualRef.current.style.setProperty("--hero-progress", progress.toFixed(3));
        heroVisualRef.current.style.setProperty("--hero-active-step", String(nextHeroStep));
        setHeroStep((previousStep) => (previousStep === nextHeroStep ? previousStep : nextHeroStep));
      }

      if (approachRef.current) {
        const rect = approachRef.current.getBoundingClientRect();
        const isMobileApproach = window.innerWidth < 768;
        const isCompactApproach = window.innerWidth < 1041;
        let sectionProgress = 0;
        let nextStep = approachStepRef.current;

        if (isMobileApproach) {
          const mobileItems = [...approachRef.current.querySelectorAll(".approach-mobile-step")];
          nextStep = getClosestVisibleStep(mobileItems, viewport * 0.46);
          sectionProgress = approachStepCount > 1 ? nextStep / (approachStepCount - 1) : 0;
        } else if (isCompactApproach) {
          const stepItems = [...approachRef.current.querySelectorAll(".approach-steps li")];
          nextStep = getClosestVisibleStep(stepItems, viewport * 0.52);
          sectionProgress = approachStepCount > 1 ? nextStep / (approachStepCount - 1) : 0;
        } else {
          const progressStart = viewport * 0.18;
          const progressRange = Math.max(rect.height - viewport * 1.05, viewport * 1.6);
          sectionProgress = clamp((progressStart - rect.top) / progressRange, 0, 0.999);
          nextStep = getApproachStepFromProgress(sectionProgress, approachStepRef.current, approachStepCount);
        }

        approachStepRef.current = nextStep;
        setApproachStep((previousStep) => (previousStep === nextStep ? previousStep : nextStep));
        approachRef.current.style.setProperty("--approach-progress", sectionProgress.toFixed(3));
      }

      if (systemRef.current) {
        const rect = systemRef.current.getBoundingClientRect();
        const isPinnedSystem = window.innerWidth > 1040;
        const sectionTop = window.scrollY + rect.top;
        const systemProgressRange = isPinnedSystem
          ? Math.max(rect.height - viewport * 1.05, viewport * 1.45)
          : viewport * 0.32 + rect.height * 0.32;
        const progress = isPinnedSystem
          ? clamp((window.scrollY - Math.max(sectionTop - 24, 0)) / systemProgressRange)
          : clamp((viewport * 0.35 - rect.top) / systemProgressRange);
        const nextSystemStep = Math.min(systemStepCount - 1, Math.floor(progress * systemStepCount));

        systemRef.current.style.setProperty("--system-progress", progress.toFixed(3));
        setSystemStep((previousStep) => (previousStep === nextSystemStep ? previousStep : nextSystemStep));
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [
    approachRef,
    approachStepCount,
    approachStepRef,
    heroRef,
    heroStepCount,
    heroVisualRef,
    setApproachStep,
    setHeroStep,
    setSystemStep,
    systemRef,
    systemStepCount,
  ]);
}
