import { serviceProcessSteps } from "../../data/services";
import ServicesProcessStep from "./ServicesProcessStep";

export default function ServicesProcess() {
  return (
    <>
    <section className="services-process-section services-desktop-only secondary-container" aria-labelledby="services-process-title">
      <div className="services-section-heading reveal">
        <p className="secondary-kicker">Come lavoro</p>
        <h2 id="services-process-title">Un percorso progressivo, dal brief al go-live.</h2>
        <p>
          Ogni fase riduce incertezza e mantiene il progetto leggibile: prima
          si valida, poi si costruisce, infine si porta online con supporto.
        </p>
      </div>

      <ol className="services-process" aria-label="Fasi del metodo di lavoro">
        {serviceProcessSteps.map((step, index) => (
          <ServicesProcessStep key={step.n} step={step} index={index} />
        ))}
      </ol>
    </section>
    <section className="services-mobile-only services-mobile-process secondary-container" aria-labelledby="services-mobile-process-title">
      <h2 id="services-mobile-process-title">Come lavoro</h2>
      <ol aria-label="Fasi del progetto"><li>Analisi</li><li>Prototipo</li><li>Sviluppo</li><li>Supporto</li></ol>
      <p>Definiamo le priorità, verifichiamo un prototipo e realizziamo la soluzione con supporto al rilascio.</p>
    </section>
    </>
  );
}
