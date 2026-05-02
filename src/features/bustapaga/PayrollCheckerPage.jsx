import { useMemo, useState } from "react";
import "./bustapaga.css";
import PdfUploadCard from "./components/PdfUploadCard";
import DiaryParserStatus from "./components/DiaryParserStatus";
import PayslipParserStatus from "./components/PayslipParserStatus";
import MonthlySummaryCards from "./components/MonthlySummaryCards";
import ReconciliationTable from "./components/ReconciliationTable";
import ParsedDiaryPreview from "./components/ParsedDiaryPreview";
import ParsedPayslipPreview from "./components/ParsedPayslipPreview";
import AnomalyList from "./components/AnomalyList";
import ExportJsonButton from "./components/ExportJsonButton";
import { extractPdfText } from "./parsers/pdfText";
import {
  extractDiaryPeriod,
  getDiaryMonthlySection,
  parseDiaryMonthlyItems,
} from "./parsers/diaryParser";
import { extractPayslipPeriod, parsePayslipLines } from "./parsers/payslipParser";
import { reconcileDiaryWithPayslip } from "./parsers/reconciliation";
import { detectSensitiveData } from "./parsers/privacy";

const emptyDiary = {
  fileName: "",
  text: "",
  period: "",
  items: [],
  sectionFound: true,
  sensitiveLabels: [],
  error: "",
  isLoading: false,
};

const emptyPayslip = {
  fileName: "",
  text: "",
  period: "",
  lines: [],
  sensitiveLabels: [],
  error: "",
  isLoading: false,
};

function PayrollCheckerPage() {
  const [diary, setDiary] = useState(emptyDiary);
  const [payslip, setPayslip] = useState(emptyPayslip);

  const reconciliationResults = useMemo(
    () => reconcileDiaryWithPayslip(diary.items, payslip.lines),
    [diary.items, payslip.lines]
  );
  const anomalies = useMemo(
    () => reconciliationResults.filter((result) => result.status !== "OK"),
    [reconciliationResults]
  );
  const okCount = reconciliationResults.length - anomalies.length;

  async function handleDiaryUpload(file) {
    setDiary((current) => ({
      ...current,
      fileName: file.name,
      error: "",
      isLoading: true,
    }));

    try {
      const text = await extractPdfText(file);
      const section = getDiaryMonthlySection(text);
      const items = parseDiaryMonthlyItems(text);

      setDiary({
        fileName: file.name,
        text,
        period: extractDiaryPeriod(text),
        items,
        sectionFound: section.found,
        sensitiveLabels: detectSensitiveData(text),
        error: "",
        isLoading: false,
      });
    } catch (error) {
      setDiary((current) => ({
        ...current,
        error: "Non riesco a leggere questo PDF. Verifica che non sia protetto o composto solo da immagini.",
        isLoading: false,
      }));
    }
  }

  async function handlePayslipUpload(file) {
    setPayslip((current) => ({
      ...current,
      fileName: file.name,
      error: "",
      isLoading: true,
    }));

    try {
      const text = await extractPdfText(file);
      const lines = parsePayslipLines(text);

      setPayslip({
        fileName: file.name,
        text,
        period: extractPayslipPeriod(text),
        lines,
        sensitiveLabels: detectSensitiveData(text),
        error: "",
        isLoading: false,
      });
    } catch (error) {
      setPayslip((current) => ({
        ...current,
        error: "Non riesco a leggere questo PDF. Verifica che non sia protetto o composto solo da immagini.",
        isLoading: false,
      }));
    }
  }

  const exportData = {
    generatedAt: new Date().toISOString(),
    privacyNotice: "Dati elaborati nel browser. Export generato manualmente dall'utente.",
    diary: {
      fileName: diary.fileName,
      period: diary.period,
      items: diary.items,
    },
    payslip: {
      fileName: payslip.fileName,
      period: payslip.period,
      lines: payslip.lines,
    },
    reconciliationResults,
  };

  return (
    <main className="payroll-page">
      <section className="payroll-hero">
        <div>
          <span className="payroll-kicker">Webapp interna</span>
          <h1>Controllo busta paga FS</h1>
          <p>
            Incrocia il riepilogo mensile del Diario dei servizi con le righe del cedolino,
            usando Codice voce e Parametro come chiave di confronto.<br/><strong> Ricorda di confrontare la busta paga con il diario di bordo del mese precedente.</strong>
          </p>
        </div>
        <ExportJsonButton data={exportData} disabled={reconciliationResults.length === 0} />
      </section>

      <div className="payroll-privacy-alert" role="alert">
        I PDF possono contenere dati personali e retributivi. I dati restano nel browser salvo esportazione manuale.
      </div>

      <section className="payroll-upload-grid">
        <PdfUploadCard
          title="Carica Diario dei servizi PDF"
          description="Il parser legge periodo e sezione Riepilogo mensile delle voci."
          fileName={diary.fileName}
          isLoading={diary.isLoading}
          error={diary.error}
          onFileSelected={handleDiaryUpload}
        />
        <PdfUploadCard
          title="Carica Cedolino PDF"
          description="Il parser legge Cod. Voce, Parametro, Aliquota, Trattenute e Competenze."
          fileName={payslip.fileName}
          isLoading={payslip.isLoading}
          error={payslip.error}
          onFileSelected={handlePayslipUpload}
        />
      </section>

      <section className="payroll-status-grid">
        <DiaryParserStatus
          fileName={diary.fileName}
          period={diary.period}
          itemCount={diary.items.length}
          sectionFound={diary.sectionFound}
          sensitiveLabels={diary.sensitiveLabels}
          isLoading={diary.isLoading}
        />
        <PayslipParserStatus
          fileName={payslip.fileName}
          period={payslip.period}
          lineCount={payslip.lines.length}
          sensitiveLabels={payslip.sensitiveLabels}
          isLoading={payslip.isLoading}
        />
      </section>

      <MonthlySummaryCards
        diaryPeriod={diary.period}
        payslipPeriod={payslip.period}
        diaryCount={diary.items.length}
        payslipCount={payslip.lines.length}
        okCount={okCount}
        anomalyCount={anomalies.length}
      />

      <ReconciliationTable results={reconciliationResults} />
      <AnomalyList anomalies={anomalies} />

      <section className="payroll-preview-grid">
        <ParsedDiaryPreview items={diary.items} rawText={diary.text} />
        <ParsedPayslipPreview lines={payslip.lines} rawText={payslip.text} />
      </section>
      <p style={{display:'flex',justifyContent:'center',alignItems:'center'}}>SCAPayrollFsChecker Version 0.1</p>
    </main>
  );
}

export default PayrollCheckerPage;
