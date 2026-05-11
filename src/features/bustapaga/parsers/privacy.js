const SENSITIVE_PATTERNS = [
  { label: "codice fiscale", pattern: /\b[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]\b/i },
  { label: "IBAN", pattern: /\bIT\d{2}[A-Z0-9]{1,30}\b/i },
  { label: "posizione INAIL", pattern: /\bposizione\s+inail\s*[:-]?\s*[A-Z0-9./-]{4,}\b/i },
  { label: "matricola INPS", pattern: /\bmatricola\s+inps\s*[:-]?\s*[A-Z0-9./-]{4,}\b/i },
  { label: "CID o matricola", pattern: /\b(?:cid|matricola(?!\s+inps\b))\s*[:-]?\s*[A-Z0-9]{4,}\b/i },
  { label: "data di nascita", pattern: /\bdata\s+di\s+nascita\s*[:-]?\s*\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/i },
  { label: "data assunzione", pattern: /\bdata\s+ass\.?\s*[:-]?\s*\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/i },
];

export function detectSensitiveData(text) {
  return SENSITIVE_PATTERNS.filter(({ pattern }) => pattern.test(text)).map(({ label }) => label);
}

export function redactSensitiveText(text) {
  return text
    .replace(/\b[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]\b/gi, "[codice fiscale oscurato]")
    .replace(/\bIT\d{2}[A-Z0-9]{1,30}\b/gi, "[IBAN oscurato]")
    .replace(/\b(posizione\s+inail\s*[:-]?\s*)[A-Z0-9./-]{4,}\b/gi, "$1[dato oscurato]")
    .replace(/\b(matricola\s+inps\s*[:-]?\s*)[A-Z0-9./-]{4,}\b/gi, "$1[dato oscurato]")
    .replace(/\b((?:cid|matricola(?!\s+inps\b))\s*[:-]?\s*)[A-Z0-9]{4,}\b/gi, "$1[dato oscurato]")
    .replace(/\b(data\s+di\s+nascita\s*[:-]?\s*)\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/gi, "$1[data oscurata]")
    .replace(/\b(data\s+ass\.?\s*[:-]?\s*)\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/gi, "$1[data oscurata]");
}
