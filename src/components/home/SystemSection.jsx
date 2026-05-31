import SystemFlowMap from "./SystemFlowMap";

export default function SystemSection({ activeStep, directions, sectionRef, steps }) {
  return (
    <section className="system-section" ref={sectionRef} aria-labelledby="system-title">
      <div className="system-section__pin">
        <div className="system-section__copy" data-scroll-reveal>
          <p className="home-kicker">Software architecture</p>
          <h2 id="system-title">Ogni soluzione vive dentro un sistema: dati, interfacce, automazioni e rilascio.</h2>
        </div>
        <div className="system-map" aria-hidden="true">
          <SystemFlowMap activeStep={activeStep} directions={directions} steps={steps} />
          <div className="system-mobile-summary">
            <article>
              <span>01</span>
              <div>
                <strong>Brief & UX</strong>
                <p>Chiarisco obiettivi, priorita e flussi prima dello sviluppo.</p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <strong>Build</strong>
                <p>Creo interfacce, API e integrazioni con una base solida.</p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <strong>Release</strong>
                <p>Porto online, monitoro e preparo il sistema a evolvere.</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
