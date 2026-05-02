import { formatNumber } from "../parsers/numbers";
import StatusBadge from "./StatusBadge";

function AnomalyList({ anomalies }) {
  return (
    <section className="payroll-card payroll-anomaly-card">
      <div className="payroll-section-heading">
        <div>
          <h2>Anomalie</h2>
          <p>Voci da verificare manualmente prima di considerare chiuso il controllo.</p>
        </div>
      </div>

      {anomalies.length === 0 ? (
        <p className="payroll-muted">Nessuna anomalia rilevata.</p>
      ) : (
        <ul className="payroll-anomaly-list">
          {anomalies.map((item) => (
            <li key={`${item.code}-${item.status}`}>
              <div>
                <strong>{item.code}</strong>
                <span>{item.description}</span>
              </div>
              <div>
                <span>Differenza: {formatNumber(item.difference)}</span>
                <StatusBadge status={item.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default AnomalyList;
