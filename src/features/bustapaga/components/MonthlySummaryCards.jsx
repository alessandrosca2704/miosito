function SummaryTile({ label, value, tone }) {
  return (
    <article className={`payroll-summary-tile ${tone ? `is-${tone}` : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function MonthlySummaryCards({ diaryPeriod, payslipPeriod, diaryCount, payslipCount, okCount, anomalyCount }) {
  return (
    <section className="payroll-summary-grid" aria-label="Riepilogo controllo busta paga">
      <SummaryTile label="Periodo diario" value={diaryPeriod || "-"} />
      <SummaryTile label="Mese cedolino" value={payslipPeriod || "-"} />
      <SummaryTile label="Voci diario" value={diaryCount} />
      <SummaryTile label="Voci cedolino" value={payslipCount} />
      <SummaryTile label="Voci OK" value={okCount} tone="ok" />
      <SummaryTile label="Anomalie" value={anomalyCount} tone={anomalyCount > 0 ? "alert" : "ok"} />
    </section>
  );
}

export default MonthlySummaryCards;
