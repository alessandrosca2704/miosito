const SENSITIVE_PATTERNS = [
  { label: "codice fiscale", pattern: /\b[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]\b/i },
  { label: "IBAN", pattern: /\bIT\d{2}[A-Z0-9]{1,30}\b/i },
  { label: "CID o matricola", pattern: /\b(?:cid|matricola)\s*[:-]?\s*[A-Z0-9]{4,}\b/i },
];

export function detectSensitiveData(text) {
  return SENSITIVE_PATTERNS.filter(({ pattern }) => pattern.test(text)).map(({ label }) => label);
}

export function redactSensitiveText(text) {
  return text
    .replace(/\b[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]\b/gi, "[codice fiscale oscurato]")
    .replace(/\bIT\d{2}[A-Z0-9]{1,30}\b/gi, "[IBAN oscurato]")
    .replace(/\b((?:cid|matricola)\s*[:-]?\s*)[A-Z0-9]{4,}\b/gi, "$1[dato oscurato]");
}
