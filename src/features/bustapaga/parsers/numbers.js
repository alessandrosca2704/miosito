export function parseItalianNumber(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = String(value)
    .trim()
    .replace(/\s/g, "")
    .replace(/[€]/g, "");

  if (!normalized || normalized === "-") {
    return null;
  }

  const sign = normalized.startsWith("-") ? -1 : 1;
  const unsigned = normalized.replace(/^-/, "");
  let numberString = unsigned;

  if (unsigned.includes(",")) {
    numberString = unsigned.replace(/\./g, "").replace(",", ".");
  } else if ((unsigned.match(/\./g) || []).length > 1) {
    const parts = unsigned.split(".");
    numberString = `${parts.slice(0, -1).join("")}.${parts[parts.length - 1]}`;
  }

  const parsed = Number.parseFloat(numberString);
  return Number.isFinite(parsed) ? sign * parsed : null;
}

export function formatNumber(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }

  return new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(value);
}
