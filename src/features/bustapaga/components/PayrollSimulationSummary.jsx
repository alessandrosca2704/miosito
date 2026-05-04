import { formatNumber } from "../parsers/numbers";

function PayrollSimulationSummary({ result, payslipNet }) {
  const hasPayslipNet = payslipNet !== null && payslipNet !== undefined;
  const difference = hasPayslipNet ? result.totaleNetto - payslipNet : null;
  const isOk = difference !== null && Math.abs(difference) <= 5;

  return (
    <section className="payroll-simulation-summary">
      <article>
        <span>Lordo stimato</span>
        <strong>{formatNumber(result.totaleLordo, 2)}</strong>
      </article>
      <article>
        <span>Imponibile stimato</span>
        <strong>{formatNumber(result.totaleImponibile, 2)}</strong>
      </article>
      <article>
        <span>Netto simulato</span>
        <strong>{formatNumber(result.totaleNetto, 2)}</strong>
      </article>
      <article>
        <span>Netto cedolino</span>
        <strong>{formatNumber(payslipNet, 2)}</strong>
      </article>
      {hasPayslipNet && (
        <article>
          <span>Differenza</span>
          <strong>{formatNumber(difference, 2)}</strong>
          <span className={`payroll-status-badge ${isOk ? "status-OK" : "status-DIFFERENZA"}`}>
            {isOk ? "OK" : "Da verificare"}
          </span>
        </article>
      )}
    </section>
  );
}

export default PayrollSimulationSummary;
