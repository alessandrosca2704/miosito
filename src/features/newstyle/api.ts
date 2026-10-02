import {
  isBooking,
  isBookingPage,
  isMutationResult,
  isRecord,
  isSessionResponse,
  isText,
} from "./contracts";
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
  }
}
function validResponse(path: string, body: object | undefined, data: unknown) {
  const route = path.split("?")[0];
  if (route === "/auth/session") return isSessionResponse(data);
  if (route === "/auth/login")
    return isSessionResponse(data) && data.authenticated;
  if (route === "/auth/logout")
    return isSessionResponse(data) && !data.authenticated;
  if (route === "/bookings" && body === undefined) return isBookingPage(data);
  if (/^\/bookings\/[^/]+$/.test(route) && body === undefined)
    return (
      isRecord(data) &&
      isBooking(data.booking) &&
      data.booking.uid === decodeURIComponent(route.split("/")[2])
    );
  if (/^\/bookings\/[^/]+\/(confirm|reject)$/.test(route))
    return (
      isMutationResult(data) &&
      data.booking.uid === decodeURIComponent(route.split("/")[2]) &&
      data.booking.status ===
        (route.endsWith("/confirm") ? "accepted" : "rejected")
    );
  return false;
}
export async function request<T>(
  path: string,
  body?: object,
  signal?: AbortSignal,
  timeoutMs = 30_000,
): Promise<T> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  if (signal?.aborted) controller.abort();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(
        new ApiError(
          0,
          "La richiesta sta impiegando troppo tempo. Riprova.",
          "TIMEOUT",
        ),
      );
      controller.abort();
    }, timeoutMs);
  });
  const operation = async () => {
    let response: Response;
    try {
      response = await fetch("/api/newstyle" + path, {
        method: body === undefined ? "GET" : "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers:
          body === undefined ? {} : { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (error) {
      if (controller.signal.aborted) throw error;
      throw new ApiError(0, "Connessione non disponibile. Riprova.", "NETWORK");
    }
    const json =
      response.headers
        .get("content-type")
        ?.split(";")[0]
        .trim()
        .toLowerCase() === "application/json";
    let data: unknown;
    try {
      data = json ? await response.json() : undefined;
    } catch {
      data = undefined;
    }
    if (!response.ok) {
      const message =
        isRecord(data) && isText(data.error, 500)
          ? data.error
          : response.status === 429
            ? "Troppi tentativi. Attendi qualche minuto e riprova."
            : "Si è verificato un errore. Riprova.";
      throw new ApiError(
        response.status,
        message,
        isRecord(data) && isText(data.code, 80) ? data.code : undefined,
      );
    }
    if (!json || !validResponse(path, body, data))
      throw new ApiError(
        502,
        "Risposta non valida. Ricarica e riprova.",
        "INVALID_RESPONSE",
      );
    return data as T;
  };
  try {
    return await Promise.race([operation(), deadline]);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}
