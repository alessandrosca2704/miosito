import type { Booking } from "../../src/shared/newstyle/types";
import {
  isInstant,
  isRecord,
  isText,
  isUid,
} from "../../src/shared/newstyle/contracts";
import { HttpError } from "./errors";
export interface CalBooking {
  uid: string;
  title: string;
  status: string;
  start: string;
  end: string;
  eventTypeId?: number;
  eventType?: { id: number };
  attendees?: { name?: string; email?: string; phoneNumber?: string }[];
}
const positiveId = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0;
const optional = (value: unknown, max: number) =>
  value === undefined || value === null || isText(value, max);
export function parseCalBooking(value: unknown): CalBooking {
  const bad = () =>
    new HttpError(502, "Risposta appuntamenti non valida. Riprova.");
  if (
    !isRecord(value) ||
    !isUid(value.uid) ||
    !isText(value.title) ||
    !isText(value.status, 40) ||
    !/^[a-z_]+$/i.test(value.status) ||
    !isInstant(value.start) ||
    !isInstant(value.end) ||
    Date.parse(value.end) <= Date.parse(value.start)
  )
    throw bad();
  if (value.eventTypeId != null && !positiveId(value.eventTypeId)) throw bad();
  if (
    value.eventType != null &&
    (!isRecord(value.eventType) || !positiveId(value.eventType.id))
  )
    throw bad();
  if (
    value.attendees != null &&
    (!Array.isArray(value.attendees) ||
      value.attendees.length > 1000 ||
      value.attendees.some(
        (a) =>
          !isRecord(a) ||
          !optional(a.name, 300) ||
          !optional(a.email, 320) ||
          !optional(a.phoneNumber, 80),
      ))
  )
    throw bad();
  const attendees = (
    value.attendees as Record<string, unknown>[] | undefined | null
  )?.map((a) => ({
    name: typeof a.name === "string" ? a.name : undefined,
    email: typeof a.email === "string" ? a.email : undefined,
    phoneNumber: typeof a.phoneNumber === "string" ? a.phoneNumber : undefined,
  }));
  return {
    uid: value.uid,
    title: value.title,
    status: value.status,
    start: value.start,
    end: value.end,
    eventTypeId: value.eventTypeId as number | undefined,
    eventType: value.eventType as { id: number } | undefined,
    attendees,
  };
}
export function mapCalBookingToBooking(
  value: unknown,
  serviceName?: string,
): Booking {
  const b = parseCalBooking(value),
    a = b.attendees?.[0];
  return {
    uid: b.uid,
    title: b.title,
    attendeeName: a?.name || "Cliente",
    attendeeEmail: a?.email,
    attendeePhone: a?.phoneNumber,
    serviceName: serviceName || b.title,
    start: b.start,
    end: b.end,
    status: b.status === "unconfirmed" ? "pending" : b.status,
  };
}
