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
import ExcludedPayslipLinesAccordion from "./components/ExcludedPayslipLinesAccordion";
import PayrollTotalCalculatorModal from "./components/PayrollTotalCalculatorModal";
import { extractPdfText } from "./parsers/pdfText";
import {
  extractDiaryPeriod,
  getDiaryMonthlySection,
  parseDiaryMonthlyItems,
} from "./parsers/diaryParser";
import {
  aggregatePayslipLines,
  extractPayslipPeriod,
  extractPayslipTotals,
  groupExcludedPayslipLines,
  parsePayslipLines,
} from "./parsers/payslipParser";
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
  totals: null,
  sensitiveLabels: [],
  error: "",
  isLoading: false,
};

function PayrollCheckerPage() {
  const [diary, setDiary] = useState(emptyDiary);
  const [payslip, setPayslip] = useState(emptyPayslip);
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(true);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [payrollSimulation, setPayrollSimulation] = useState({ input: null, result: null });

  const aggregatedPayslipLines = useMemo(
    () => aggregatePayslipLines(payslip.lines),
    [payslip.lines]
  );
  const excludedPayslipGroups = useMemo(
    () => groupExcludedPayslipLines(payslip.lines),
    [payslip.lines]
  );
  const excludedPayslipCount = useMemo(
    () => excludedPayslipGroups.reduce((total, group) => total + group.lines.length, 0),
    [excludedPayslipGroups]
  );

  const reconciliationResults = useMemo(
    () => reconcileDiaryWithPayslip(diary.items, aggregatedPayslipLines),
    [aggregatedPayslipLines, diary.items]
  );
  const anomalies = useMemo(
    () => reconciliationResults.filter((result) => result.status !== "OK"),
    [reconciliationResults]
  );
  const canUploadPdf = privacyConfirmed && privacyChecked;

  function acceptPrivacyNotice() {
    if (!privacyChecked) {
      return;
    }

    setPrivacyConfirmed(true);
    setPrivacyModalOpen(false);
  }

  async function handleDiaryUpload(file) {
    if (!canUploadPdf) {
      return;
    }

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
        text: "",
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
    if (!canUploadPdf) {
      return;
    }

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
        text: "",
        period: extractPayslipPeriod(text),
        lines,
        totals: extractPayslipTotals(text),
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
      aggregatedLines: aggregatedPayslipLines,
      excludedLines: excludedPayslipGroups,
      totals: payslip.totals,
    },
    reconciliationResults,
    diaryItems: diary.items,
    payslipLines: aggregatedPayslipLines,
    excludedPayslipLines: excludedPayslipGroups,
    payrollSimulationInput: payrollSimulation.input,
    payrollSimulationResult: payrollSimulation.result,
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
        <div className="payroll-action-bar">
          <button
            type="button"
            className="payroll-secondary-button"
            onClick={() => setPrivacyModalOpen(true)}
          >
            Privacy e sicurezza
          </button>
          <ExportJsonButton data={exportData} disabled={reconciliationResults.length === 0} />
          {/* TODO: riattivare quando la simulazione totale busta paga sara' consolidata.
          <button
            type="button"
            className="payroll-secondary-button"
            disabled={diary.items.length === 0 && payslip.lines.length === 0}
            onClick={() => setIsCalculatorOpen(true)}
          >
            Calcola totale busta paga
          </button>
          */}
        </div>
      </section>

      {privacyModalOpen && (
        <div className="payroll-privacy-backdrop" role="presentation">
          <section
            className="payroll-privacy-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payroll-privacy-title"
          >
            <div>
              <span className="payroll-kicker">Prima di caricare i PDF</span>
              <h2 id="payroll-privacy-title">Privacy e sicurezza</h2>
              <p>
                I PDF della busta paga contengono dati personali e retributivi. In questa
                pagina vengono letti localmente nel browser con PDF.js: non risultano upload
                verso server o API della sezione bustapaga.
              </p>
              <p>
                Il testo estratto viene usato solo per il confronto in pagina e resta nello
                stato temporaneo del browser. Non viene salvato in localStorage o
                sessionStorage; l'export JSON viene generato solo su richiesta manuale.
              </p>
              <p>
                Il sito non puo' proteggerti da spyware, malware, keylogger o software
                malevoli presenti sul tuo dispositivo. Evita computer pubblici, condivisi o
                sospetti.
              </p>
            </div>

            <label className="payroll-confirmation">
              <input
                type="checkbox"
                checked={privacyChecked}
                onChange={(event) => {
                  setPrivacyChecked(event.target.checked);
                  if (!event.target.checked) {
                    setPrivacyConfirmed(false);
                  }
                }}
              />
              <span>Confermo di usare un dispositivo sicuro e di essere autorizzato a caricare questo documento.</span>
            </label>

            <div className="payroll-privacy-actions">
              {privacyConfirmed && (
                <button
                  type="button"
                  className="payroll-secondary-button"
                  onClick={() => setPrivacyModalOpen(false)}
                >
                  Chiudi
                </button>
              )}
              <button
                type="button"
                className="payroll-primary-button"
                disabled={!privacyChecked}
                onClick={acceptPrivacyNotice}
              >
                Accetto e continuo
              </button>
            </div>
          </section>
        </div>
      )}

      <section className="payroll-upload-grid">
        <PdfUploadCard
          title="Carica Diario dei servizi PDF"
          description="Il parser legge periodo e sezione Riepilogo mensile delle voci."
          fileName={diary.fileName}
          isLoading={diary.isLoading}
          error={diary.error}
          disabled={!canUploadPdf}
          disabledReason="Conferma prima la nota Privacy e sicurezza."
          onFileSelected={handleDiaryUpload}
        />
        <PdfUploadCard
          title="Carica Cedolino PDF"
          description="Il parser legge Cod. Voce, Parametro, Aliquota, Trattenute e Competenze."
          fileName={payslip.fileName}
          isLoading={payslip.isLoading}
          error={payslip.error}
          disabled={!canUploadPdf}
          disabledReason="Conferma prima la nota Privacy e sicurezza."
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
        comparedCount={reconciliationResults.length}
        anomalyCount={anomalies.length}
        excludedCount={excludedPayslipCount}
      />

      <ReconciliationTable results={reconciliationResults} />
      {/* TODO: riattivare quando la simulazione totale busta paga sara' consolidata.
      <div className="payroll-bottom-actions">
        <button
          type="button"
          className="payroll-primary-button"
          disabled={diary.items.length === 0 && payslip.lines.length === 0}
          onClick={() => setIsCalculatorOpen(true)}
        >
          Calcola totale busta paga
        </button>
      </div>
      */}
      <ExcludedPayslipLinesAccordion groups={excludedPayslipGroups} />
      <AnomalyList anomalies={anomalies} />

     {/* <section className="payroll-preview-grid">
        <ParsedDiaryPreview items={diary.items} rawText={diary.text} />
        <ParsedPayslipPreview lines={aggregatedPayslipLines} rawText={payslip.text} />
      </section>
      {isCalculatorOpen && (
        <PayrollTotalCalculatorModal
          diaryItems={diary.items}
          payslipLines={aggregatedPayslipLines}
          payslipTotals={payslip.totals}
          onClose={() => setIsCalculatorOpen(false)}
          onCalculated={(input, result) => setPayrollSimulation({ input, result })}
        />
      )}*/}
      <p style={{display:'flex',justifyContent:'center',alignItems:'center'}}>SCAPayrollFsChecker Version 0.1.1</p>
    </main>
  );
}

export default PayrollCheckerPage;
