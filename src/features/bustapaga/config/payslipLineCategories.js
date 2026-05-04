export const figurativeCodes = new Set(["0E99"]);

export const fixedPayCodes = new Set(["3B01", "3B10", "3B20", "3B90"]);

export const deductionCodes = new Set([
  "/4W7",
  "/4C1",
  "/4N1",
  "/4N4",
  "6IDE",
  "0430",
  "9UNI",
]);

export const excludedCodes = new Map([
  ["0E99", "TICKET_ESENTE"],
  ["0RF5", "WELFARE"],
  ["9WLF", "WELFARE"],
  ["6HEA", "CONTRIBUTI_AZIENDA"],
  ["9UNI", "TRATTENUTA"],
  ["/4W7", "DETRAZIONE"],
  ["/4C1", "TRATTENUTA"],
  ["/4N1", "TRATTENUTA"],
  ["/4N4", "TRATTENUTA"],
  ["6IDE", "TRATTENUTA"],
  ["0430", "TRATTENUTA"],
  ["3B01", "VOCE_FISSA"],
  ["3B10", "VOCE_FISSA"],
  ["3B20", "VOCE_FISSA"],
  ["3B90", "VOCE_FISSA"],
]);

export const categoryKeywordRules = [
  { category: "TICKET_ESENTE", patterns: [/quota\s+esente/i] },
  { category: "WELFARE", patterns: [/voucher/i, /welfare/i, /contr\.\s*contrat\.\s*welfare/i] },
  { category: "CONTRIBUTI_AZIENDA", patterns: [/ctr\s+eurofer\s+annuale\s+c\.?az\.?/i] },
  { category: "DETRAZIONE", patterns: [/detraz/i] },
  { category: "TRATTENUTA", patterns: [/addiz/i, /fondo\s+sol\./i, /ass\.?\s*sanit/i] },
  {
    category: "VOCE_FISSA",
    patterns: [/minimo\s+contrattuale/i, /salario\s+professionale/i, /aum\.?\s*per\.?\s*anzianita/i, /sal\.?\s*prod/i],
  },
];
