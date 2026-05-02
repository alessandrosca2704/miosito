function DiaryParserStatus({ fileName, period, itemCount, sectionFound, sensitiveLabels, isLoading }) {
  return (
    <section className="payroll-card payroll-status-card">
      <h3>Diario dei servizi</h3>
      <dl>
        <div>
          <dt>File</dt>
          <dd>{fileName || "Non caricato"}</dd>
        </div>
        <div>
          <dt>Periodo competenza</dt>
          <dd>{period || "Non rilevato"}</dd>
        </div>
        <div>
          <dt>Voci riepilogo</dt>
          <dd>{isLoading ? "Lettura..." : itemCount}</dd>
        </div>
      </dl>
      {fileName && !sectionFound && !isLoading && (
        <p className="payroll-warning">
          Sezione "Riepilogo mensile delle voci" non trovata nel testo estratto.
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

export default DiaryParserStatus;
