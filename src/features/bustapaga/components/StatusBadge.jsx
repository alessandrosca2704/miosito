const STATUS_LABELS = {
  OK: "OK",
  DIFFERENZA: "Differenza",
  MANCANTE_IN_CEDOLINO: "Mancante in cedolino",
  EXTRA_IN_CEDOLINO: "Extra in cedolino",
};

function StatusBadge({ status }) {
  return <span className={`payroll-status-badge status-${status}`}>{STATUS_LABELS[status] || status}</span>;
}

export default StatusBadge;
export { STATUS_LABELS };
