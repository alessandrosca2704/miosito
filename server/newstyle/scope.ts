import { HttpError } from "./errors";

// Missing configuration must never silently grant access to the entire account.
export function eventScope(): number[] {
  const raw = process.env.NEWSTYLE_CAL_EVENT_TYPE_IDS?.trim();
  if (raw) {
    const parts = raw.split(",").map((value) => value.trim());
    const ids = parts.map(Number);
    if (
      parts.length > 100 ||
      parts.some((value) => !/^\d+$/.test(value)) ||
      ids.some((id) => !Number.isSafeInteger(id) || id <= 0)
    ) {
      throw new HttpError(
        503,
        "Configurazione agenda non valida. Contatta il gestore.",
      );
    }
    return [...new Set(ids)];
  }
  if (process.env.NEWSTYLE_CAL_ALLOW_ALL_EVENTS === "true") return [];
  throw new HttpError(503, "Agenda non configurata. Contatta il gestore.");
}
