import { useState } from "react";
import { formatNumber } from "../parsers/numbers";
import { redactSensitiveText } from "../parsers/privacy";

function ParsedDiaryPreview({ items, rawText }) {
  const [showText, setShowText] = useState(false);

  return (
    <section className="payroll-card payroll-preview-card">
      <div className="payroll-section-heading">
        <div>
          <h2>Anteprima diario</h2>
          <p>Voci riconosciute nel riepilogo mensile.</p>
        </div>
        {rawText && (
          <button type="button" className="payroll-secondary-button" onClick={() => setShowText((value) => !value)}>
            {showText ? "Nascondi testo estratto" : "Mostra testo estratto"}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="payroll-muted">Carica un diario PDF per vedere le voci estratte.</p>
      ) : (
        <div className="payroll-mini-table-wrap">
          <table className="payroll-mini-table">
            <thead>
              <tr>
                <th>Codice</th>
                <th>Descrizione</th>
                <th>QTA</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.code}>
                  <td data-label="Codice">{item.code}</td>
                  <td data-label="Descrizione">{item.description}</td>
                  <td data-label="QTA">{formatNumber(item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showText && <pre className="payroll-raw-text">{redactSensitiveText(rawText)}</pre>}
    </section>
  );
}

export default ParsedDiaryPreview;
