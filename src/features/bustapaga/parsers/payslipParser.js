import { parseItalianNumber } from "./numbers";

const MONTHS =
  "gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre";
const CODE_REGEX = /^([0-9A-Z/]{4})(?=\s)/i;
const NUMBER_TOKEN_REGEX = /^-?\d{1,3}(?:\.\d{3})*(?:,\d+)?$|^-?\d+(?:[.,]\d+)?$/;

function normalizeLine(line) {
  return line.replace(/\s+/g, " ").trim();
}

function isCodeLine(line) {
  const match = line.match(CODE_REGEX);
  return Boolean(match) && /[0-9/]/.test(match[1]);
}

export function extractPayslipPeriod(text) {
  const normalized = text.replace(/\s+/g, " ");
  const explicitPeriod = normalized.match(
    new RegExp(`(?:mese|competenza|periodo)\\s*(?:di|del|:)?\\s*(${MONTHS})\\s+(20\\d{2})`, "i")
  );

  if (explicitPeriod) {
    return `${explicitPeriod[1][0].toUpperCase()}${explicitPeriod[1].slice(1).toLowerCase()} ${explicitPeriod[2]}`;
  }

  const numericPeriod = normalized.match(/\b(?:mese|competenza|periodo)\s*:?\s*(\d{1,2})[/-](20\d{2})\b/i);
  if (numericPeriod) {
    return `${numericPeriod[1].padStart(2, "0")}/${numericPeriod[2]}`;
  }

  return "";
}

function parsePayslipLine(line) {
  const codeMatch = line.match(CODE_REGEX);
  if (!codeMatch) {
    return null;
  }

  const code = codeMatch[1].toUpperCase();
  const rest = line.slice(codeMatch[0].length).trim();
  const tokens = rest.split(/\s+/).filter(Boolean);
  const firstNumberIndex = tokens.findIndex((token) =>
    NUMBER_TOKEN_REGEX.test(token.replace(/[€]/g, ""))
  );

  if (firstNumberIndex === -1) {
    return null;
  }

  const descriptionTokens = tokens.slice(0, firstNumberIndex);
  while (descriptionTokens[descriptionTokens.length - 1] === "X") {
    descriptionTokens.pop();
  }

  const description = descriptionTokens.join(" ").trim();
  const values = tokens
    .slice(firstNumberIndex)
    .filter((token) => NUMBER_TOKEN_REGEX.test(token.replace(/[€]/g, "")))
    .map(parseItalianNumber)
    .filter((value) => value !== null);

  if (!description || values.length === 0) {
    return null;
  }

  return {
    code,
    description,
    quantity: values[0] ?? null,
    rate: values.length >= 3 ? values[1] : null,
    debit: values.length >= 4 ? values[values.length - 2] : null,
    credit: values.length >= 3 ? values[values.length - 1] : values[1] ?? null,
    rawLine: line,
  };
}

export function parsePayslipLines(text) {
  const lines = text.split(/\r?\n/).map(normalizeLine).filter(Boolean);
  const parsedByCode = new Map();

  lines.forEach((line) => {
    if (!isCodeLine(line) || /cod\.\s*voce|descrizione|competenze/i.test(line)) {
      return;
    }

    const parsed = parsePayslipLine(line);
    if (!parsed) {
      return;
    }

    const existing = parsedByCode.get(parsed.code);
    if (!existing) {
      parsedByCode.set(parsed.code, parsed);
      return;
    }

    parsedByCode.set(parsed.code, {
      ...existing,
      quantity:
        existing.quantity !== null || parsed.quantity !== null
          ? (existing.quantity || 0) + (parsed.quantity || 0)
          : null,
      debit:
        existing.debit !== null || parsed.debit !== null
          ? (existing.debit || 0) + (parsed.debit || 0)
          : null,
      credit:
        existing.credit !== null || parsed.credit !== null
          ? (existing.credit || 0) + (parsed.credit || 0)
          : null,
      rawLine: `${existing.rawLine}\n${parsed.rawLine}`,
    });
  });

  return [...parsedByCode.values()].sort((a, b) => a.code.localeCompare(b.code));
}
