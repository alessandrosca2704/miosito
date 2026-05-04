import {
  diarySimulationCodeMap,
  payrollSimulationDefaults,
  simulationFieldLabels,
  variablePayrollRates,
} from "../config/payrollSimulationDefaults";

const zeroVariableFields = {
  vettureEccedenti: 0,
  scortaDiurnaAgenteDoppio: 0,
  scortaNotturnaAgenteDoppio: 0,
  scortaDiurnaAgenteUnico: 0,
  scortaNotturnaAgenteUnico: 0,
  iupRiservaFormazione: 0,
  iupAssenze: 0,
  indennitaPernottazione: 0,
  festivitaDicembreAnnoPrecedente: 0,
  straordinarioFerialeDiurno: 0,
  straordinarioFerialeNotturnoFestivoDiurno: 0,
  straordinarioFestivoNotturno: 0,
  straordinarioMensile: 0,
  indennitaTurnoB: 0,
  indennitaLavoroNotturno: 0,
  indennitaLavoroFestivo: 0,
  completamentoFineCorsa: 0,
  indennitaDomenicale: 0,
  assResAR: 0,
  assResRFR: 0,
  ticket: 0,
  pieDiLista: 0,
  biglietteria: 0,
};

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function amount(quantity, rate) {
  return roundMoney((Number(quantity) || 0) * (Number(rate) || 0));
}

export function buildSimulationInputFromDiary(diaryItems) {
  const input = {
    ...payrollSimulationDefaults,
    ...zeroVariableFields,
  };

  diaryItems.forEach((item) => {
    const key = diarySimulationCodeMap[item.code];
    if (key) {
      input[key] = (input[key] || 0) + item.quantity;
    }
  });

  return input;
}

function findByCode(lines, code) {
  return lines.find((line) => line.code === code);
}

function lineAmount(line) {
  return line ? line.totalCredit || line.totalDebit || line.credit || line.debit || 0 : 0;
}

export function buildSimulationInputFromPayslip(payslipLines) {
  return {
    minimoContrattuale: lineAmount(findByCode(payslipLines, "3B01")) || undefined,
    apa: lineAmount(findByCode(payslipLines, "3B20")) || undefined,
    salarioProfessionale: lineAmount(findByCode(payslipLines, "3B10")) || undefined,
    salarioProduttivita: lineAmount(findByCode(payslipLines, "3B90")) || undefined,
    eurofer: lineAmount(findByCode(payslipLines, "6HEA")) || undefined,
  };
}

export function calculateProgressiveMonthlyIrpef(imponibile) {
  if (imponibile <= 0) {
    return 0;
  }

  if (imponibile <= 2333.33) {
    return roundMoney(imponibile * 0.23);
  }

  if (imponibile <= 4166.67) {
    return roundMoney(536.67 + (imponibile - 2333.33) * 0.33);
  }

  return roundMoney(1142 + (imponibile - 4166.67) * 0.43);
}

export function calculatePayrollSimulation(input) {
  const baseUtile = roundMoney(
    (Number(input.minimoContrattuale) || 0) +
      (Number(input.apa) || 0) +
      (Number(input.salarioProfessionale) || 0)
  );
  const rates = {
    ...variablePayrollRates,
    strFerialeDiurnoRate: baseUtile / 160 * 1.18,
    strFerialeNotturnoFestivoDiurnoRate: baseUtile / 160 * 1.35,
    strFestivoNotturnoRate: baseUtile / 160 * 1.5,
    indennitaOrariaFestivoRate: baseUtile / 160 * 0.35,
    straordinarioMensile20Rate: baseUtile / 160 * 1.2,
  };

  const variableDefinitions = [
    ["vettureEccedenti", variablePayrollRates.vettureEccedenti],
    ["scortaDiurnaAgenteDoppio", variablePayrollRates.scortaDiurnaAgenteDoppio],
    ["scortaNotturnaAgenteDoppio", variablePayrollRates.scortaNotturnaAgenteDoppio],
    ["scortaDiurnaAgenteUnico", variablePayrollRates.scortaDiurnaAgenteUnico],
    ["scortaNotturnaAgenteUnico", variablePayrollRates.scortaNotturnaAgenteUnico],
    ["iupRiservaFormazione", variablePayrollRates.iupRiservaFormazione],
    ["iupAssenze", variablePayrollRates.iupAssenze],
    ["indennitaPernottazione", variablePayrollRates.indennitaPernottazione],
    ["festivitaDicembreAnnoPrecedente", variablePayrollRates.festivitaDicembreAnnoPrecedente],
    ["straordinarioFerialeDiurno", rates.strFerialeDiurnoRate],
    ["straordinarioFerialeNotturnoFestivoDiurno", rates.strFerialeNotturnoFestivoDiurnoRate],
    ["straordinarioFestivoNotturno", rates.strFestivoNotturnoRate],
    ["straordinarioMensile", rates.straordinarioMensile20Rate],
    ["indennitaTurnoB", variablePayrollRates.indennitaTurnoB],
    ["indennitaLavoroNotturno", variablePayrollRates.indennitaLavoroNotturno],
    ["indennitaLavoroFestivo", rates.indennitaOrariaFestivoRate],
    ["completamentoFineCorsa", variablePayrollRates.completamentoFineCorsa],
    ["indennitaDomenicale", variablePayrollRates.indennitaDomenicale],
    ["assResAR", variablePayrollRates.assResAR],
    ["assResRFR", variablePayrollRates.assResRFR],
    ["ticket", null],
    ["pieDiLista", null],
    ["biglietteria", null],
  ];

  const variableAmounts = variableDefinitions.map(([key, rate]) => ({
    key,
    label: simulationFieldLabels[key],
    quantity: Number(input[key]) || 0,
    rate,
    amount: rate === null ? roundMoney(Number(input[key]) || 0) : amount(input[key], rate),
  }));

  const competenzeVariabiliCalcolate = variableAmounts.reduce((total, item) => total + item.amount, 0);
  const totaleLordo = roundMoney(
    (Number(input.minimoContrattuale) || 0) +
      (Number(input.apa) || 0) +
      (Number(input.salarioProfessionale) || 0) +
      (Number(input.salarioProduttivita) || 0) +
      competenzeVariabiliCalcolate
  );
  const assResARAmount = amount(input.assResAR, variablePayrollRates.assResAR);
  const assResRFRAmount = amount(input.assResRFR, variablePayrollRates.assResRFR);
  const diariaNoTax = roundMoney(assResARAmount + assResRFRAmount);
  const totaleImponibile = roundMoney(totaleLordo - diariaNoTax);
  const contributiINPS = roundMoney(totaleImponibile * (Number(input.aliquotaINPS) || 0));
  const eurofer = Number(input.eurofer) || 0;
  const imponibileIRPEF = roundMoney(totaleImponibile - contributiINPS - eurofer);
  const irpef = calculateProgressiveMonthlyIrpef(imponibileIRPEF);
  const addizionaleRegionale = roundMoney(imponibileIRPEF * (Number(input.aliquotaAddizionaleRegionale) || 0));
  const addizionaleComunale = roundMoney(imponibileIRPEF * (Number(input.aliquotaAddizionaleComunale) || 0));
  const totaleTrattenuteStimate = roundMoney(contributiINPS + eurofer + addizionaleRegionale + addizionaleComunale);
  const imposteStimate = irpef;
  const totaleNetto = roundMoney(
    totaleLordo -
      contributiINPS -
      eurofer -
      irpef -
      addizionaleRegionale -
      addizionaleComunale +
      (Number(input.detrazioniLavoroDipendente) || 0)
  );

  return {
    baseUtile,
    rates,
    variableAmounts,
    totaleLordo,
    diariaNoTax,
    totaleImponibile,
    contributiINPS,
    eurofer,
    imponibileIRPEF,
    irpef,
    imposteStimate,
    detrazioniLavoroDipendente: Number(input.detrazioniLavoroDipendente) || 0,
    addizionaleRegionale,
    addizionaleComunale,
    totaleTrattenuteStimate,
    totaleNetto,
  };
}
