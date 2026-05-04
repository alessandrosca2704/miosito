import { formatNumber } from "../parsers/numbers";

const CATEGORY_LABELS = {
  FIGURATIVA: "Figurativa",
  WELFARE: "Welfare",
  TICKET_ESENTE: "Ticket esente",
  CONTRIBUTI_AZIENDA: "Contributi azienda",
  TRATTENUTA: "Trattenuta",
  DETRAZIONE: "Detrazione",
  VOCE_FISSA: "Voce fissa",
  ALTRO_ESCLUSO: "Altro escluso",
};

function ExcludedPayslipLinesAccordion({ groups }) {
  const lines = groups.flatMap((group) => group.lines.map((line) => ({ ...line, groupCategory: group.category })));
  const totalCredit = groups.reduce((total, group) => total + group.totalCredit, 0);
  const totalDebit = groups.reduce((total, group) => total + group.totalDebit, 0);

  return (
    <details className="payroll-card payroll-excluded-card">
      <summary>
        <span>Voci figurative / escluse dal confronto</span>
        <strong>{lines.length}</strong>
      </summary>

      <div className="payroll-excluded-summary">
        <span>Righe escluse: <strong>{lines.length}</strong></span>
        <span>Competenze escluse: <strong>{formatNumber(totalCredit, 2)}</strong></span>
        <span>Trattenute escluse: <strong>{formatNumber(totalDebit, 2)}</strong></span>
      </div>

      <div className="payroll-mini-table-wrap">
        <table className="payroll-mini-table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Codice</th>
              <th>Descrizione</th>
              <th>Parametro</th>
              <th>Aliquota</th>
              <th>Trattenute</th>
              <th>Competenze</th>
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 ? (
              <tr>
                <td colSpan="7" className="payroll-empty-cell">Nessuna voce esclusa.</td>
              </tr>
            ) : (
              lines.map((line, index) => (
                <tr key={`${line.code}-${index}`}>
                  <td data-label="Categoria">
                    <span className={`payroll-status-badge status-${line.category}`}>
                      {CATEGORY_LABELS[line.category] || line.category}
                    </span>
                  </td>
                  <td data-label="Codice" className="payroll-code-cell">{line.code}</td>
                  <td data-label="Descrizione">{line.description}</td>
                  <td data-label="Parametro">{formatNumber(line.quantity)}</td>
                  <td data-label="Aliquota">{formatNumber(line.rate, 5)}</td>
                  <td data-label="Trattenute">{formatNumber(line.debit, 2)}</td>
                  <td data-label="Competenze">{formatNumber(line.credit, 2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </details>
  );
}

export default ExcludedPayslipLinesAccordion;
