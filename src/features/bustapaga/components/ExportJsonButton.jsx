import { exportReconciliationJson } from "../parsers/exportJson";

function ExportJsonButton({ data, disabled }) {
  return (
    <button
      type="button"
      className="payroll-primary-button"
      disabled={disabled}
      onClick={() => exportReconciliationJson(data)}
    >
      Esporta JSON
    </button>
  );
}

export default ExportJsonButton;
