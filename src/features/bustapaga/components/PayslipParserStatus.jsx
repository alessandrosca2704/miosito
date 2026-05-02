function PayslipParserStatus({ fileName, period, lineCount, sensitiveLabels, isLoading }) {
  return (
    <section className="payroll-card payroll-status-card">
      <h3>Cedolino</h3>
      <dl>
        <div>
          <dt>File</dt>
          <dd>{fileName || "Non caricato"}</dd>
        </div>
        <div>
          <dt>Mese cedolino</dt>
          <dd>{period || "Non rilevato"}</dd>
        </div>
        <div>
          <dt>Voci paga</dt>
          <dd>{isLoading ? "Lettura..." : lineCount}</dd>
        </div>
      </dl>
      {fileName && lineCount === 0 && !isLoading && (
        <p className="payroll-warning">
          Nessuna riga paga riconosciuta. Verifica che il PDF contenga testo selezionabile.
        </p>
      )}
      {sensitiveLabels.length > 0 && (
        <p className="payroll-warning">
          Rilevati dati sensibili nel PDF: {sensitiveLabels.join(", ")}. Il testo debug viene oscurato.
        </p>
      )}
    </section>
  );
}

export default PayslipParserStatus;
