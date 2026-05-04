import { useMemo, useState } from "react";
import {
  buildSimulationInputFromDiary,
  buildSimulationInputFromPayslip,
  calculatePayrollSimulation,
} from "../calculators/payrollSimulationCalculator";
import {
  diarySimulationCodeMap,
  payrollSimulationDefaults,
  payrollRoleDefaults,
  simulationFieldLabels,
} from "../config/payrollSimulationDefaults";
import { formatNumber } from "../parsers/numbers";
import PayrollSimulationSummary from "./PayrollSimulationSummary";

const baseFields = [
  ["minimoContrattuale", "Minimo contrattuale"],
  ["apa", "APA"],
  ["salarioProfessionale", "Salario professionale"],
  ["salarioProduttivita", "Salario produttivita"],
  ["eurofer", "Eurofer"],
  ["detrazioniLavoroDipendente", "Detrazioni lavoro dipendente"],
  ["aliquotaINPS", "Aliquota INPS"],
  ["aliquotaAddizionaleRegionale", "Aliquota addizionale regionale"],
  ["aliquotaAddizionaleComunale", "Aliquota addizionale comunale"],
];

const variableFields = Object.keys(simulationFieldLabels).filter((key) => key !== "rimborsoPasti");

function findPayslipNet(payslipLines, payslipTotals) {
  if (payslipTotals?.netPay !== null && payslipTotals?.netPay !== undefined) {
    return payslipTotals.netPay;
  }

  const totals = payslipLines.reduce(
    (acc, line) => ({
      credit: acc.credit + (line.totalCredit || line.credit || 0),
      debit: acc.debit + (line.totalDebit || line.debit || 0),
    }),
    { credit: 0, debit: 0 }
  );

  return totals.credit || totals.debit ? totals.credit - totals.debit : null;
}

function buildDifferenceRows(result, payslipTotals, payslipNet) {
  if (!payslipTotals) {
    return [];
  }

  return [
    {
      label: "Totale competenze / lordo",
      simulated: result.totaleLordo,
      payslip: payslipTotals.totalCredit,
      note: "Se il cedolino e' piu alto qui, mancano voci/quote non ricavate dal Diario o importi base non letti dalla riga voce.",
    },
    {
      label: "Totale trattenute",
      simulated: result.totaleTrattenuteStimate,
      payslip: payslipTotals.totalDebit,
      note: "Nel cedolino include contributi e trattenute; qui stimiamo INPS, Eurofer e addizionali configurate.",
    },
    {
      label: "Imposte",
      simulated: result.imposteStimate,
      payslip: payslipTotals.taxes,
      note: "Confronto con l'imposta lorda cedolino prima delle detrazioni.",
    },
    {
      label: "Detrazioni",
      simulated: result.detrazioniLavoroDipendente,
      payslip: payslipTotals.deductions,
      note: "Valore preso dal riepilogo cedolino quando disponibile.",
    },
    {
      label: "Netto a pagare",
      simulated: result.totaleNetto,
      payslip: payslipNet,
      note: "Differenza finale tra netto simulato e netto ufficiale.",
    },
  ].filter((row) => row.payslip !== null && row.payslip !== undefined);
}

function PayrollTotalCalculatorModal({ diaryItems, payslipLines, payslipTotals, onClose, onCalculated }) {
  const initialInput = useMemo(
    () => ({
      ...buildSimulationInputFromDiary(diaryItems),
      ...Object.fromEntries(
        Object.entries(buildSimulationInputFromPayslip(payslipLines)).filter(([, value]) => value !== undefined)
      ),
      detrazioniLavoroDipendente: payslipTotals?.deductions || 0,
    }),
    [diaryItems, payslipLines, payslipTotals]
  );
  const [input, setInput] = useState(initialInput);
  const result = useMemo(() => calculatePayrollSimulation(input), [input]);
  const payslipNet = useMemo(() => findPayslipNet(payslipLines, payslipTotals), [payslipLines, payslipTotals]);
  const differenceRows = useMemo(
    () => buildDifferenceRows(result, payslipTotals, payslipNet),
    [payslipNet, payslipTotals, result]
  );
  const unusedDiaryItems = useMemo(
    () => diaryItems.filter((item) => !diarySimulationCodeMap[item.code]),
    [diaryItems]
  );
  const missingFields = variableFields.filter((key) => (input[key] || 0) === 0);

  function updateField(key, value) {
    setInput((current) => ({ ...current, [key]: Number(value) || 0 }));
  }

  function updateRole(role) {
    const roleDefaults = payrollRoleDefaults[role];
    setInput((current) => ({
      ...current,
      payrollRole: role,
      salarioProfessionale: roleDefaults?.salarioProfessionale ?? current.salarioProfessionale,
    }));
  }

  function handleConfirm() {
    onCalculated?.(input, result);
    onClose();
  }

  return (
    <div className="payroll-modal-backdrop" role="presentation">
      <section className="payroll-modal" role="dialog" aria-modal="true" aria-labelledby="payroll-total-title">
        <div className="payroll-modal-heading">
          <div>
            <h2 id="payroll-total-title">Calcola totale busta paga</h2>
            <p>
              Calcolo simulato basato sui dati estratti dal Diario e sulle aliquote configurate. Potrebbero mancare
              conguagli, detrazioni, trattenute, welfare, fondi, addizionali o altre voci del cedolino ufficiale.
            </p>
          </div>
          <button type="button" className="payroll-secondary-button" onClick={onClose}>Chiudi</button>
        </div>

        <div className="payroll-role-selector" aria-label="Selezione ruolo">
          <span>Ruolo</span>
          <div>
            {Object.entries(payrollRoleDefaults).map(([role, config]) => (
              <button
                key={role}
                type="button"
                className={input.payrollRole === role ? "is-active" : ""}
                onClick={() => updateRole(role)}
              >
                {config.label}
              </button>
            ))}
          </div>
          <small>
            {payrollRoleDefaults[input.payrollRole]?.description || payrollRoleDefaults.BORDO.description}
          </small>
        </div>

        {missingFields.length > 0 && (
          <div className="payroll-warning">
            Alcuni dati non sono stati ricavati dal Diario: verifica o inserisci manualmente i campi a zero.
          </div>
        )}

        <PayrollSimulationSummary result={result} payslipNet={payslipNet} />

        {differenceRows.length > 0 && (
          <section className="payroll-difference-panel">
            <div className="payroll-section-heading">
              <div>
                <h3>Valori che non quadrano con il cedolino</h3>
                <p>Questi scostamenti spiegano dove la simulazione si allontana dai totali ufficiali.</p>
              </div>
            </div>
            <div className="payroll-mini-table-wrap">
              <table className="payroll-mini-table">
                <thead>
                  <tr>
                    <th>Voce</th>
                    <th>Simulazione</th>
                    <th>Cedolino</th>
                    <th>Differenza</th>
                    <th>Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {differenceRows.map((row) => {
                    const difference = row.simulated - row.payslip;
                    const isRelevant = Math.abs(difference) > 5;
                    return (
                      <tr key={row.label} className={isRelevant ? "is-payroll-mismatch" : ""}>
                        <td data-label="Voce">{row.label}</td>
                        <td data-label="Simulazione">{formatNumber(row.simulated, 2)}</td>
                        <td data-label="Cedolino">{formatNumber(row.payslip, 2)}</td>
                        <td data-label="Differenza">{formatNumber(difference, 2)}</td>
                        <td data-label="Nota">{row.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {unusedDiaryItems.length > 0 && (
          <section className="payroll-difference-panel">
            <div className="payroll-section-heading">
              <div>
                <h3>Voci Diario non valorizzate nella simulazione</h3>
                <p>Queste voci sono nel riepilogo mensile, ma non hanno ancora una formula certa nel calcolo totale.</p>
              </div>
            </div>
            <div className="payroll-mini-table-wrap">
              <table className="payroll-mini-table">
                <thead>
                  <tr>
                    <th>Codice</th>
                    <th>Descrizione</th>
                    <th>QTA</th>
                    <th>Impatto</th>
                  </tr>
                </thead>
                <tbody>
                  {unusedDiaryItems.map((item) => (
                    <tr key={item.code} className="is-payroll-mismatch">
                      <td data-label="Codice">{item.code}</td>
                      <td data-label="Descrizione">{item.description}</td>
                      <td data-label="QTA">{formatNumber(item.quantity, 2)}</td>
                      <td data-label="Impatto">Possibile lordo mancante se la voce ha importo nel cedolino.</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className="payroll-modal-grid">
          <section>
            <h3>Valori base e aliquote</h3>
            <div className="payroll-field-grid">
              {baseFields.map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    type="number"
                    step={key.startsWith("aliquota") ? "0.0001" : "0.01"}
                    value={input[key] ?? payrollSimulationDefaults[key] ?? 0}
                    onChange={(event) => updateField(key, event.target.value)}
                  />
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3>Riepilogo dati usati</h3>
            <div className="payroll-field-grid">
              {variableFields.map((key) => (
                <label key={key}>
                  {simulationFieldLabels[key]}
                  <input
                    type="number"
                    step="0.01"
                    value={input[key] ?? 0}
                    onChange={(event) => updateField(key, event.target.value)}
                  />
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="payroll-modal-grid">
          <section>
            <h3>Competenze variabili</h3>
            <div className="payroll-mini-table-wrap">
              <table className="payroll-mini-table">
                <thead>
                  <tr>
                    <th>Voce</th>
                    <th>QTA</th>
                    <th>Aliquota</th>
                    <th>Importo</th>
                  </tr>
                </thead>
                <tbody>
                  {result.variableAmounts.map((item) => (
                    <tr key={item.key}>
                      <td>{item.label}</td>
                      <td>{formatNumber(item.quantity)}</td>
                      <td>{formatNumber(item.rate, 5)}</td>
                      <td>{formatNumber(item.amount, 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3>Trattenute stimate</h3>
            <div className="payroll-mini-table-wrap">
              <table className="payroll-mini-table">
                <tbody>
                  <tr><td>Diaria no tax</td><td>{formatNumber(result.diariaNoTax, 2)}</td></tr>
                  <tr><td>Contributi INPS</td><td>{formatNumber(result.contributiINPS, 2)}</td></tr>
                  <tr><td>Eurofer</td><td>{formatNumber(result.eurofer, 2)}</td></tr>
                  <tr><td>Imponibile IRPEF</td><td>{formatNumber(result.imponibileIRPEF, 2)}</td></tr>
                  <tr><td>IRPEF</td><td>{formatNumber(result.irpef, 2)}</td></tr>
                  <tr><td>Detrazioni lavoro dipendente</td><td>{formatNumber(result.detrazioniLavoroDipendente, 2)}</td></tr>
                  <tr><td>Addizionale regionale</td><td>{formatNumber(result.addizionaleRegionale, 2)}</td></tr>
                  <tr><td>Addizionale comunale</td><td>{formatNumber(result.addizionaleComunale, 2)}</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="payroll-modal-actions">
          <button type="button" className="payroll-secondary-button" onClick={onClose}>Annulla</button>
          <button type="button" className="payroll-primary-button" onClick={handleConfirm}>Usa questa simulazione</button>
        </div>
      </section>
    </div>
  );
}

export default PayrollTotalCalculatorModal;
