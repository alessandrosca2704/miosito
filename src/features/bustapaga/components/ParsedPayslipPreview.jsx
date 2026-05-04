import { useState } from "react";
import { formatNumber } from "../parsers/numbers";
import { redactSensitiveText } from "../parsers/privacy";

function ParsedPayslipPreview({ lines, rawText }) {
  const [showText, setShowText] = useState(false);

  return (
    <section className="payroll-card payroll-preview-card">
      <div className="payroll-section-heading">
        <div>
          <h2>Anteprima cedolino</h2>
          <p>Righe paga riconosciute dal PDF.</p>
        </div>
        {rawText && (
          <button type="button" className="payroll-secondary-button" onClick={() => setShowText((value) => !value)}>
            {showText ? "Nascondi testo estratto" : "Mostra testo estratto"}
          </button>
        )}
      </div>

      {lines.length === 0 ? (
        <p className="payroll-muted">Carica un cedolino PDF per vedere le righe estratte.</p>
      ) : (
        <div className="payroll-mini-table-wrap">
          <table className="payroll-mini-table">
            <thead>
              <tr>
                <th>Codice</th>
                <th>Descrizione</th>
                <th>Parametro</th>
                <th>Importo</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.code}>
                  <td data-label="Codice">{line.code}</td>
                  <td data-label="Descrizione">{line.description}</td>
                  <td data-label="Parametro">{formatNumber(line.quantity)}</td>
                  <td data-label="Importo">{formatNumber(line.totalCredit || line.totalDebit || line.credit || line.debit)}</td>
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

export default ParsedPayslipPreview;
