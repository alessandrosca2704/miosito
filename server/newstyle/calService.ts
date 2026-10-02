import type {
  Booking,
  BookingPage,
  MutationResult,
} from "../../src/shared/newstyle/types";
import {
  isCursor,
  isRecord,
  isUid,
} from "../../src/shared/newstyle/contracts";
import { HttpError } from "./errors";
import { eventScope } from "./scope";
import { calRequest, requestBudget, type RequestBudget } from "./calClient";
import {
  parseCalBooking,
  mapCalBookingToBooking,
  type CalBooking,
} from "./calBooking";
import { serviceTitles } from "./serviceTitles";
export { mapCalBookingToBooking } from "./calBooking";
function inScope(b: CalBooking, ids: number[]) {
  return !ids.length || ids.includes(b.eventType?.id ?? b.eventTypeId ?? -1);
}
async function readBooking(
  uid: string,
  ids: number[],
  budget: RequestBudget,
): Promise<Booking> {
  if (!isUid(uid)) throw new HttpError(400, "Appuntamento non valido.");
  const result = await calRequest(
    `/bookings/${uid}`,
    "2026-02-25",
    "GET",
    undefined,
    budget,
  );
  const raw = parseCalBooking(result.data);
  if (raw.uid !== uid)
    throw new HttpError(502, "Risposta appuntamento non valida.");
  if (!inScope(raw, ids))
    throw new HttpError(
      403,
      "Operazione non consentita su questo appuntamento.",
    );
  return mapCalBookingToBooking(raw);
}
export function getBooking(uid: string) {
  return readBooking(uid, eventScope(), requestBudget());
}
export async function listBookings(
  params: URLSearchParams,
): Promise<BookingPage> {
  const ids = eventScope();
  const budget = requestBudget();
  const status = params.get("status");
  const history = status === "history";
  const historyStatus = params.get("historyStatus");
  if (
    historyStatus &&
    (!history || !["accepted", "rejected", "cancelled"].includes(historyStatus))
  )
    throw new HttpError(400, "Filtro storico non valido.");
  const query = new URLSearchParams({
    limit: "100",
    sortStart: history ? "desc" : "asc",
  });
  if (status && !["pending", "history"].includes(status))
    throw new HttpError(400, "Filtro non valido.");
  if (status === "pending") query.set("status", "unconfirmed");
  const from = params.get("from"),
    to = params.get("to");
  if ((!from || !to) && status !== "pending" && !history)
    throw new HttpError(400, "Seleziona un periodo.");
  if (from || to) {
    if (
      !from ||
      !to ||
      !Number.isFinite(Date.parse(from)) ||
      !Number.isFinite(Date.parse(to)) ||
      Date.parse(to) <= Date.parse(from) ||
      Date.parse(to) - Date.parse(from) > 45 * 86400000
    )
      throw new HttpError(400, "Periodo non valido (massimo 45 giorni).");
    // Cal filters start AND end, so pad the bounds to include appointments crossing midnight.
    query.set(
      "afterStart",
      new Date(Date.parse(from) - 86400000).toISOString(),
    );
    query.set("beforeEnd", new Date(Date.parse(to) + 86400000).toISOString());
  }
  const cursor = params.get("cursor");
  if (cursor) {
    if (cursor.length > 4096 || !/^[a-zA-Z0-9_+=/.-]+$/.test(cursor))
      throw new HttpError(400, "Pagina non valida.");
    query.set("cursor", cursor);
  }
  if (ids.length) query.set("eventTypeIds", ids.join(","));
  const result = await calRequest(
    "/bookings?" + query,
    "2026-05-01",
    "GET",
    undefined,
    budget,
  );
  if (
    !Array.isArray(result.data) ||
    !isRecord(result.pagination) ||
    typeof result.pagination.hasMore !== "boolean" ||
    (result.pagination.hasMore && !isCursor(result.pagination.nextCursor))
  )
    throw new HttpError(502, "Risposta appuntamenti non valida.");
  const raw = result.data.map(parseCalBooking);
  const selected = raw.filter(
    (b) =>
      inScope(b, ids) &&
      (!from || Date.parse(b.end) > Date.parse(from)) &&
      (!to || Date.parse(b.start) < Date.parse(to)) &&
      (status !== "pending" || ["pending", "unconfirmed"].includes(b.status)) &&
      (!history || ["accepted", "rejected", "cancelled"].includes(b.status)) &&
      (!historyStatus || b.status === historyStatus),
  );
  const titles = await serviceTitles(
    selected
      .map((b) => b.eventType?.id ?? b.eventTypeId)
      .filter((id): id is number => id !== undefined),
    budget,
  );
  return {
    bookings: selected
      .map((b) =>
        mapCalBookingToBooking(
          b,
          titles.get(b.eventType?.id ?? b.eventTypeId ?? -1),
        ),
      )
      .sort(
        (a, b) =>
          (history ? -1 : 1) * (Date.parse(a.start) - Date.parse(b.start)),
      ),
    nextCursor: result.pagination.hasMore
      ? (result.pagination.nextCursor as string)
      : null,
  };
}

export async function changeBooking(
  uid: string,
  action: "confirm" | "reject",
  reason?: string,
): Promise<MutationResult> {
  const ids = eventScope(),
    budget = requestBudget(25_000);
  const desired = action === "confirm" ? "accepted" : "rejected";
  const current = await readBooking(uid, ids, budget);
  if (current.status === desired)
    return { success: true, booking: current, reconciled: true };
  if (current.status !== "pending")
    throw new HttpError(
      409,
      "Appuntamento già aggiornato. Ricarica l’agenda.",
      "BOOKING_CONFLICT",
    );
  try {
    const result = await calRequest(
      `/bookings/${uid}/${action === "confirm" ? "confirm" : "decline"}`,
      "2026-02-25",
      "POST",
      action === "reject" ? (reason ? { reason } : {}) : undefined,
      budget,
    );
    const raw = parseCalBooking(result.data);
    if (raw.uid !== uid || !inScope(raw, ids))
      throw new HttpError(502, "Risposta appuntamento non valida.");
    const booking = mapCalBookingToBooking(raw);
    if (booking.status !== desired)
      throw new HttpError(
        409,
        "Verifica dello stato necessaria.",
        "BOOKING_CONFLICT",
      );
    return { success: true, booking, reconciled: false };
  } catch (error) {
    if (
      !(error instanceof HttpError) ||
      (error.status < 500 && error.status !== 409)
    )
      throw error;
    // Never replay the POST. A lost response can still mean the write succeeded.
    try {
      const booking = await readBooking(uid, ids, budget);
      if (booking.status === desired)
        return { success: true, booking, reconciled: true };
      if (booking.status !== "pending")
        throw new HttpError(
          409,
          "L’appuntamento ha uno stato diverso. Ricarica l’agenda.",
          "BOOKING_CONFLICT",
        );
    } catch (check) {
      if (check instanceof HttpError && check.code === "BOOKING_CONFLICT")
        throw check;
    }
    throw new HttpError(
      503,
      "Non è stato possibile verificare l’esito. Controlla lo stato prima di riprovare.",
      "OUTCOME_UNKNOWN",
    );
  }
}
