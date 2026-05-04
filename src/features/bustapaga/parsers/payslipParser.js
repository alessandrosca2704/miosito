import { parseItalianNumber } from "./numbers";
import {
  categoryKeywordRules,
  excludedCodes,
  figurativeCodes,
} from "../config/payslipLineCategories";

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

function isNumberToken(token) {
  return NUMBER_TOKEN_REGEX.test(token.replace(/[€]/g, ""));
}

function findFirstValueIndex(tokens) {
  const lastMarkerIndex = tokens.reduce(
    (lastIndex, token, index) => (/^x$/i.test(token) ? index : lastIndex),
    -1
  );

  if (lastMarkerIndex !== -1) {
    return tokens.findIndex((token, index) => index > lastMarkerIndex && isNumberToken(token));
  }

  return tokens.findIndex(isNumberToken);
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

export function extractPayslipTotals(text) {
  const lines = text.split(/\r?\n/).map(normalizeLine).filter(Boolean);
  const totalsIndex = lines.reduce(
    (lastIndex, line, index) =>
      /totale\s+competenze.*totale\s+trattenute.*netto\s+a\s+pagare/i.test(line)
        ? index
        : lastIndex,
    -1
  );

  if (totalsIndex === -1) {
    return null;
  }

  const numberLine = lines.slice(totalsIndex + 1, totalsIndex + 5).find((line) => {
    const values = line.match(/-?\d{1,3}(?:\.\d{3})*,\d{2}|-?\d+,\d{2}/g) || [];
    return values.length >= 3;
  });

  if (!numberLine) {
    return null;
  }

  const values = (numberLine.match(/-?\d{1,3}(?:\.\d{3})*,\d{2}|-?\d+,\d{2}/g) || [])
    .map(parseItalianNumber)
    .filter((value) => value !== null);

  return {
    totalCredit: values[0] ?? null,
    totalDebit: values[1] ?? null,
    taxes: values[2] ?? null,
    deductions: values[3] ?? null,
    previousRounding: values[4] ?? null,
    currentRounding: values[5] ?? null,
    netPay: values[values.length - 1] ?? null,
  };
}

export function classifyPayslipLine(line) {
  if (line.code === "0299") {
    return "CONFRONTO";
  }

  if (line.hasFig || figurativeCodes.has(line.code)) {
    return "FIGURATIVA";
  }

  const configuredCategory = excludedCodes.get(line.code);
  if (configuredCategory) {
    return configuredCategory;
  }

  const matchedRule = categoryKeywordRules.find((rule) =>
    rule.patterns.some((pattern) => pattern.test(line.description || ""))
  );

  return matchedRule?.category || "CONFRONTO";
}

export function isFigurativeOrExcludedLine(line) {
  return line.category !== "CONFRONTO";
}

function parsePayslipLine(line) {
  const codeMatch = line.match(CODE_REGEX);
  if (!codeMatch) {
    return null;
  }

  const code = codeMatch[1].toUpperCase();
  const rest = line.slice(codeMatch[0].length).trim();
  const tokens = rest.split(/\s+/).filter(Boolean);
  const firstNumberIndex = findFirstValueIndex(tokens);
  const descriptionTokens = firstNumberIndex === -1 ? [...tokens] : tokens.slice(0, firstNumberIndex);
  const markerTokens = [];
  while (/^x$/i.test(descriptionTokens[descriptionTokens.length - 1])) {
    markerTokens.unshift(descriptionTokens.pop());
  }

  const description = descriptionTokens.join(" ").trim();
  const values =
    firstNumberIndex === -1
      ? []
      : tokens
          .slice(firstNumberIndex)
          .filter(isNumberToken)
          .map(parseItalianNumber)
          .filter((value) => value !== null);

  if (!description) {
    return null;
  }

  const parsed = {
    code,
    description,
    quantity: values[0] ?? null,
    rate: values.length >= 2 ? values[1] : null,
    debit: values.length >= 4 ? values[values.length - 2] : null,
    credit: values.length >= 4 ? values[values.length - 1] : null,
    hasF: markerTokens.length >= 1,
    hasP: markerTokens.length >= 2,
    hasFig: markerTokens.length >= 3,
    rawLine: line,
  };
  const category = classifyPayslipLine(parsed);

  if (values.length === 0 && category === "CONFRONTO") {
    return null;
  }

  return {
    ...parsed,
    quantity: category === "VOCE_FISSA" && values.length === 1 ? null : parsed.quantity,
    rate: category === "VOCE_FISSA" && values.length === 1 ? null : parsed.rate,
    category,
  };
}

export function parsePayslipLines(text) {
  const lines = text.split(/\r?\n/).map(normalizeLine).filter(Boolean);
  const parsedLines = [];

  lines.forEach((line) => {
    if (!isCodeLine(line) || /cod\.\s*voce|descrizione|competenze/i.test(line)) {
      return;
    }

    const parsed = parsePayslipLine(line);
    if (parsed) {
      parsedLines.push(parsed);
    }
  });

  return parsedLines.sort((a, b) => a.code.localeCompare(b.code));
}

function sumNullable(lines, key) {
  const values = lines.map((line) => line[key]).filter((value) => value !== null && value !== undefined);
  return values.length === 0 ? null : values.reduce((total, value) => total + value, 0);
}

export function aggregatePayslipLines(lines) {
  const byCode = new Map();

  lines.forEach((line) => {
    byCode.set(line.code, [...(byCode.get(line.code) || []), line]);
  });

  return [...byCode.entries()]
    .map(([code, originalLines]) => {
      const first = originalLines[0];
      const category = originalLines.some((line) => line.category === "CONFRONTO")
        ? "CONFRONTO"
        : first.category;

      return {
        code,
        description: first.description,
        quantity: sumNullable(originalLines, "quantity"),
        rate: first.rate,
        totalDebit: sumNullable(originalLines, "debit") ?? 0,
        totalCredit: sumNullable(originalLines, "credit") ?? 0,
        category,
        originalLines,
      };
    })
    .sort((a, b) => a.code.localeCompare(b.code));
}

export function groupExcludedPayslipLines(lines) {
  const groups = new Map();

  lines.filter(isFigurativeOrExcludedLine).forEach((line) => {
    const current = groups.get(line.category) || {
      category: line.category,
      lines: [],
      totalCredit: 0,
      totalDebit: 0,
    };

    current.lines.push(line);
    current.totalCredit += line.credit || 0;
    current.totalDebit += line.debit || 0;
    groups.set(line.category, current);
  });

  return [...groups.values()].sort((a, b) => a.category.localeCompare(b.category));
}
