function PdfUploadCard({ title, description, fileName, isLoading, error, onFileSelected, disabled, disabledReason }) {
  return (
    <section className="payroll-card payroll-upload-card">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <label className="payroll-upload-control">
        <input
          type="file"
          accept="application/pdf,.pdf"
          disabled={isLoading || disabled}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onFileSelected(file);
            }
            event.target.value = "";
          }}
        />
        <span>{isLoading ? "Lettura PDF..." : fileName ? "Sostituisci PDF" : "Seleziona PDF"}</span>
      </label>

      {disabled && disabledReason && <p className="payroll-muted">{disabledReason}</p>}
      {fileName && <p className="payroll-file-name">{fileName}</p>}
      {error && <p className="payroll-error">{error}</p>}
    </section>
  );
}

export default PdfUploadCard;
