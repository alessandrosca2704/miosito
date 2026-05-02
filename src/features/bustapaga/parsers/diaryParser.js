import { parseItalianNumber } from "./numbers";

const MONTHS =
  "gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre";
const CODE_PATTERN = "[0-9][A-Z0-9]{3}";
const codeFinder = new RegExp(`\\b(${CODE_PATTERN})\\b`, "gi");

function normalizeLine(line) {
  return line.replace(/\s+/g, " ").trim();
}

export function extractDiaryPeriod(text) {
  const normalized = text.replace(/\s+/g, " ");
  const explicitPeriod = normalized.match(
    new RegExp(`(?:periodo|competenza|mese)\\s*(?:di|del|:)?\\s*(${MONTHS})\\s+(20\\d{2})`, "i")
  );

  if (explicitPeriod) {
    return `${explicitPeriod[1][0].toUpperCase()}${explicitPeriod[1].slice(1).toLowerCase()} ${explicitPeriod[2]}`;
  }

  const monthYear = normalized.match(new RegExp(`\\b(${MONTHS})\\s+(20\\d{2})\\b`, "i"));
  if (!monthYear) {
    return "";
  }

  return `${monthYear[1][0].toUpperCase()}${monthYear[1].slice(1).toLowerCase()} ${monthYear[2]}`;
}

export function getDiaryMonthlySection(text) {
  const lines = text.split(/\r?\n/).map(normalizeLine).filter(Boolean);
  const startIndex = lines.findIndex((line) =>
    /riepilogo\s+mensile\s+delle\s+voci/i.test(line)
  );

  if (startIndex === -1) {
    return { lines: [], found: false };
  }

  const stopPatterns = [
    /riepilogo\s+mensile/i,
    /dettaglio\s+giornaliero/i,
    /legenda/i,
    /totale\s+ore\s+di\s+lavoro/i,
    /monte\s+ora\s+assenza/i,
    /firma/i,
  ];
  const sectionLines = [];

  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];

    if (sectionLines.length > 0 && stopPatterns.some((pattern) => pattern.test(line))) {
      break;
    }

    sectionLines.push(line);
  }

  return { lines: sectionLines, found: true };
}

function splitMonthlyItems(line) {
  const matches = [...line.matchAll(codeFinder)].filter((match) => /[0-9]/.test(match[1]));

  if (matches.length === 0) {
    return [line];
  }

  return matches.map((match, index) => {
    const nextMatch = matches[index + 1];
    return line.slice(match.index, nextMatch ? nextMatch.index : line.length).trim();
  });
}

export function parseDiaryMonthlyItems(text) {
  const { lines } = getDiaryMonthlySection(text);
  const itemRegex = new RegExp(
    `^(${CODE_PATTERN})\\s+(.+?)\\s+(-?\\d+(?:[.,]\\d{1,5})?)$`,
    "i"
  );
  const itemsByCode = new Map();

  lines.flatMap(splitMonthlyItems).forEach((line) => {
    if (/^cod(?:ice)?\b|descrizione|qta|quantit/i.test(line)) {
      return;
    }

    const match = line.match(itemRegex);
    if (!match) {
      return;
    }

    const quantity = parseItalianNumber(match[3]);
    if (quantity === null) {
      return;
    }

    const code = match[1].toUpperCase();
    const existing = itemsByCode.get(code);
    if (existing) {
      existing.quantity += quantity;
      existing.rawLine = `${existing.rawLine}\n${line}`;
      return;
    }

    itemsByCode.set(code, {
      code,
      description: match[2].trim(),
      quantity,
      rawLine: line,
    });
  });

  return [...itemsByCode.values()].sort((a, b) => a.code.localeCompare(b.code));
}
