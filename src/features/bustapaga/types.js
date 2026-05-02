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
 * @property {string} rawLine
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

export {};
