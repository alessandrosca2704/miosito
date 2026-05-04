/**
 * @typedef {"CONFRONTO" | "FIGURATIVA" | "WELFARE" | "TICKET_ESENTE" | "CONTRIBUTI_AZIENDA" | "TRATTENUTA" | "DETRAZIONE" | "VOCE_FISSA" | "ALTRO_ESCLUSO"} PayslipLineCategory
 */

/**
 * @typedef {Object} DiaryMonthlyItem
 * @property {string} code
 * @property {string} description
 * @property {number} quantity
 * @property {string} rawLine
 */

/**
 * @typedef {Object} PayslipLine
 * @property {string} code
 * @property {string} description
 * @property {number | null} quantity
 * @property {number | null} rate
 * @property {number | null} debit
 * @property {number | null} credit
 * @property {boolean=} hasF
 * @property {boolean=} hasP
 * @property {boolean=} hasFig
 * @property {PayslipLineCategory} category
 * @property {string} rawLine
 */

/**
 * @typedef {Object} AggregatedPayslipLine
 * @property {string} code
 * @property {string} description
 * @property {number | null} quantity
 * @property {number | null} rate
 * @property {number} totalDebit
 * @property {number} totalCredit
 * @property {PayslipLineCategory} category
 * @property {PayslipLine[]} originalLines
 */

/**
 * @typedef {"OK" | "DIFFERENZA" | "MANCANTE_IN_CEDOLINO" | "EXTRA_IN_CEDOLINO"} ReconciliationStatus
 */

/**
 * @typedef {Object} ReconciliationResult
 * @property {string} code
 * @property {string} description
 * @property {number | null} diaryQuantity
 * @property {number | null} payslipQuantity
 * @property {number | null} difference
 * @property {number | null} payslipRate
 * @property {number | null} payslipAmount
 * @property {ReconciliationStatus} status
 */

/**
 * @typedef {Object} ExcludedPayslipGroup
 * @property {PayslipLineCategory} category
 * @property {PayslipLine[]} lines
 * @property {number} totalCredit
 * @property {number} totalDebit
 */

/**
 * @typedef {Object} PayrollSimulationInput
 * @property {number} minimoContrattuale
 * @property {number} apa
 * @property {number} salarioProfessionale
 * @property {number} salarioProduttivita
 * @property {number} eurofer
 * @property {number} detrazioniLavoroDipendente
 * @property {number} aliquotaINPS
 * @property {number} aliquotaAddizionaleRegionale
 * @property {number} aliquotaAddizionaleComunale
 * @property {"BORDO" | "MACCHINA"} payrollRole
 */

/**
 * @typedef {Object} PayrollSimulationResult
 * @property {number} baseUtile
 * @property {Record<string, number>} rates
 * @property {Array<{key: string, label: string, quantity: number, rate: number | null, amount: number}>} variableAmounts
 * @property {number} totaleLordo
 * @property {number} diariaNoTax
 * @property {number} totaleImponibile
 * @property {number} contributiINPS
 * @property {number} eurofer
 * @property {number} imponibileIRPEF
 * @property {number} irpef
 * @property {number} imposteStimate
 * @property {number} detrazioniLavoroDipendente
 * @property {number} addizionaleRegionale
 * @property {number} addizionaleComunale
 * @property {number} totaleTrattenuteStimate
 * @property {number} totaleNetto
 */

export {};
