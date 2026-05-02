const TOLERANCE = 0.01;

function roundDifference(value) {
  return Math.round(value * 100) / 100;
}

export function reconcileDiaryWithPayslip(diaryItems, payslipLines) {
  const payslipByCode = new Map(payslipLines.map((line) => [line.code, line]));
  const diaryCodes = new Set();
  const results = [];

  diaryItems.forEach((item) => {
    diaryCodes.add(item.code);
    const payslipLine = payslipByCode.get(item.code);

    if (!payslipLine) {
      results.push({
        code: item.code,
        description: item.description,
        diaryQuantity: item.quantity,
        payslipQuantity: null,
        difference: null,
        payslipRate: null,
        payslipAmount: null,
        status: "MANCANTE_IN_CEDOLINO",
      });
      return;
    }

    const difference =
      payslipLine.quantity === null ? null : roundDifference(item.quantity - payslipLine.quantity);
    const status =
      difference !== null && Math.abs(difference) <= TOLERANCE ? "OK" : "DIFFERENZA";

    results.push({
      code: item.code,
      description: item.description || payslipLine.description,
      diaryQuantity: item.quantity,
      payslipQuantity: payslipLine.quantity,
      difference,
      payslipRate: payslipLine.rate,
      payslipAmount: payslipLine.credit ?? payslipLine.debit,
      status,
    });
  });

  payslipLines.forEach((line) => {
    if (diaryCodes.has(line.code)) {
      return;
    }

    results.push({
      code: line.code,
      description: line.description,
      diaryQuantity: null,
      payslipQuantity: line.quantity,
      difference: null,
      payslipRate: line.rate,
      payslipAmount: line.credit ?? line.debit,
      status: "EXTRA_IN_CEDOLINO",
    });
  });

  return results.sort((a, b) => a.code.localeCompare(b.code));
}
