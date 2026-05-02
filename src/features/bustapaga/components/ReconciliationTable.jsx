import { useMemo, useState } from "react";
import { formatNumber } from "../parsers/numbers";
import StatusBadge, { STATUS_LABELS } from "./StatusBadge";

function ReconciliationTable({ results }) {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  const filteredResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return results.filter((result) => {
      const matchesStatus = statusFilter === "ALL" || result.status === statusFilter;
      const matchesQuery =
        !normalizedQuery ||
        result.code.toLowerCase().includes(normalizedQuery) ||
        result.description.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [query, results, statusFilter]);

  return (
    <section className="payroll-card payroll-table-card">
      <div className="payroll-section-heading">
        <div>
          <h2>Tabella confronto</h2>
          <p>Confronto tra QTA del diario e Parametro del cedolino.</p>
        </div>
        <div className="payroll-table-tools">
          <label>
            Stato
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="ALL">Tutti</option>
              {Object.entries(STATUS_LABELS).map(([status, label]) => (
                <option key={status} value={status}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Cerca
            <input
              type="search"
              value={query}
              placeholder="Codice o descrizione"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="payroll-table-wrap">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Codice</th>
              <th>Descrizione</th>
              <th>QTA Diario</th>
              <th>Parametro Cedolino</th>
              <th>Differenza</th>
              <th>Aliquota Cedolino</th>
              <th>Importo Cedolino</th>
              <th>Stato</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.length === 0 ? (
              <tr>
                <td colSpan="8" className="payroll-empty-cell">
                  Nessuna voce da mostrare.
                </td>
              </tr>
            ) : (
              filteredResults.map((result) => (
                <tr key={`${result.code}-${result.status}`}>
                  <td className="payroll-code-cell" data-label="Codice">{result.code}</td>
                  <td data-label="Descrizione">{result.description}</td>
                  <td data-label="QTA Diario">{formatNumber(result.diaryQuantity)}</td>
                  <td data-label="Parametro Cedolino">{formatNumber(result.payslipQuantity)}</td>
                  <td data-label="Differenza">{formatNumber(result.difference)}</td>
                  <td data-label="Aliquota Cedolino">{formatNumber(result.payslipRate, 5)}</td>
                  <td data-label="Importo Cedolino">{formatNumber(result.payslipAmount, 2)}</td>
                  <td data-label="Stato">
                    <StatusBadge status={result.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="payroll-mobile-results" aria-label="Risultati confronto in formato compatto">
        {filteredResults.length === 0 ? (
          <p className="payroll-muted">Nessuna voce da mostrare.</p>
        ) : (
          filteredResults.map((result) => (
            <article className="payroll-mobile-result-card" key={`${result.code}-${result.status}-mobile`}>
              <div className="payroll-mobile-result-head">
                <div>
                  <strong>{result.code}</strong>
                  <p>{result.description}</p>
                </div>
                <StatusBadge status={result.status} />
              </div>

              <div className="payroll-mobile-core-metrics">
                <span>
                  <small>Diario</small>
                  {formatNumber(result.diaryQuantity)}
                </span>
                <span>
                  <small>Cedolino</small>
                  {formatNumber(result.payslipQuantity)}
                </span>
                <span>
                  <small>Diff.</small>
                  {formatNumber(result.difference)}
                </span>
              </div>

              <details className="payroll-mobile-details">
                <summary>Dettagli cedolino</summary>
                <dl>
                  <div>
                    <dt>Aliquota</dt>
                    <dd>{formatNumber(result.payslipRate, 5)}</dd>
                  </div>
                  <div>
                    <dt>Importo</dt>
                    <dd>{formatNumber(result.payslipAmount, 2)}</dd>
                  </div>
                  <div>
                    <dt>Stato tecnico</dt>
                    <dd>{STATUS_LABELS[result.status] || result.status}</dd>
                  </div>
                </dl>
              </details>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default ReconciliationTable;
