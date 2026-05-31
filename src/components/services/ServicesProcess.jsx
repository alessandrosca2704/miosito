import { serviceProcessSteps } from "../../data/services";
import ServicesProcessStep from "./ServicesProcessStep";

export default function ServicesProcess() {
  return (
    <section className="services-process-section secondary-container" aria-labelledby="services-process-title">
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
  );
}
