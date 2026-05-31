export default function ServicesProcessStep({ step, index }) {
  return (
    <li className="services-process-step reveal" style={{ "--delay": `${index * 110}ms` }}>
      <div className="services-process-step__marker" aria-hidden="true">
        {step.n}
      </div>
      <article className="services-process-step__card">
        <span>{step.label}</span>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </article>
    </li>
  );
}
