import { HttpError } from "./errors";
import { isRecord } from "../../src/shared/newstyle/contracts";

export type RequestBudget = { deadline: number };
export const requestBudget = (milliseconds = 20_000): RequestBudget => ({
  deadline: Date.now() + milliseconds,
});

export async function calRequest(
  path: string,
  version: string,
  method = "GET",
  body?: object,
  budget = requestBudget(),
  maximumMs = 8_000,
): Promise<{ data: unknown; pagination?: unknown }> {
  const key = process.env.CAL_API_KEY;
  if (!key) throw new HttpError(503, "Agenda temporaneamente non disponibile.");
  const base = process.env.CAL_API_BASE_URL || "https://api.cal.com/v2";
  let url: URL;
  try {
    url = new URL(base);
  } catch {
    throw new HttpError(503, "Configurazione agenda non valida.");
  }
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  )
    throw new HttpError(503, "Configurazione agenda non valida.");
  const remaining = Math.min(maximumMs, budget.deadline - Date.now());
  if (remaining <= 0)
    throw new HttpError(504, "L’agenda non risponde. Riprova.");
  try {
    const response = await fetch(base.replace(/\/$/, "") + path, {
      method,
      redirect: "error",
      headers: {
        Authorization: `Bearer ${key}`,
        "cal-api-version": version,
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(remaining),
    });
    if (!response.ok) {
      const messages: Record<number, string> = {
        401: "Collegamento agenda non autorizzato. Contatta il gestore.",
        403: "Operazione non consentita su questo appuntamento.",
        404: "Appuntamento non trovato.",
        409: "Appuntamento già aggiornato. Ricarica l’agenda.",
        429: "Troppe richieste. Attendi un momento e riprova.",
      };
      const retry = Number(response.headers.get("retry-after"));
      throw new HttpError(
        response.status === 401
          ? 502
          : messages[response.status]
            ? response.status
            : 502,
        messages[response.status] ||
          "Impossibile contattare l’agenda. Riprova.",
        undefined,
        response.status === 429 && Number.isFinite(retry) && retry > 0
          ? Math.min(retry, 3600)
          : undefined,
      );
    }
    const result: unknown = await response.json();
    if (
      !isRecord(result) ||
      result.status !== "success" ||
      result.data === undefined
    )
      throw new HttpError(502, "Risposta agenda non valida. Riprova.");
    return { data: result.data, pagination: result.pagination };
  } catch (error) {
    if (error instanceof HttpError) throw error;
    if (
      error instanceof Error &&
      ["TimeoutError", "AbortError"].includes(error.name)
    )
      throw new HttpError(504, "L’agenda non risponde. Riprova.");
    throw new HttpError(502, "Impossibile contattare l’agenda. Riprova.");
  }
}
