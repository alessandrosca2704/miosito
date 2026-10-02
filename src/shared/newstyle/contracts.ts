import type {
  Booking,
  BookingPage,
  DeviceActivationResponse,
  MutationResult,
} from "./types";
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
export const isText = (value: unknown, max = 2000): value is string =>
  typeof value === "string" && value.length <= max;
export function isInstant(value: unknown): value is string {
  if (!isText(value, 50)) return false;
  const parts =
    /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(?:\.\d+)?)?(?:Z|([+-])(\d\d):(\d\d))$/.exec(
      value,
    );
  if (!parts) return false;
  const [
    ,
    year,
    month,
    day,
    hour,
    minute,
    second = "0",
    ,
    offsetHour = "0",
    offsetMinute = "0",
  ] = parts;
  const y = Number(year),
    m = Number(month),
    d = Number(day);
  const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return (
    m >= 1 &&
    m <= 12 &&
    d >= 1 &&
    d <= days[m - 1] &&
    Number(hour) <= 23 &&
    Number(minute) <= 59 &&
    Number(second) <= 59 &&
    Number(offsetHour) <= 23 &&
    Number(offsetMinute) <= 59 &&
    Number.isFinite(Date.parse(value))
  );
}
export const isUid = (value: unknown): value is string =>
  isText(value, 128) && /^[a-zA-Z0-9_-]{1,128}$/.test(value);
export const isCursor = (value: unknown): value is string =>
  isText(value, 4096) && /^[a-zA-Z0-9_+=/.-]+$/.test(value);
const optionalText = (value: unknown, max: number) =>
  value === undefined || isText(value, max);
export function isBooking(value: unknown): value is Booking {
  return (
    isRecord(value) &&
    isUid(value.uid) &&
    isText(value.title) &&
    isText(value.attendeeName, 300) &&
    optionalText(value.attendeeEmail, 320) &&
    optionalText(value.attendeePhone, 80) &&
    isText(value.serviceName) &&
    isInstant(value.start) &&
    isInstant(value.end) &&
    Date.parse(value.end) > Date.parse(value.start) &&
    isText(value.status, 40) &&
    /^[a-z_]+$/i.test(value.status)
  );
}
export const isBookingPage = (value: unknown): value is BookingPage =>
  isRecord(value) &&
  Array.isArray(value.bookings) &&
  value.bookings.length <= 100 &&
  value.bookings.every(isBooking) &&
  (value.nextCursor === null || isCursor(value.nextCursor));
export const isSessionResponse = (
  value: unknown,
): value is { authenticated: boolean } =>
  isRecord(value) && typeof value.authenticated === "boolean";
export const isMutationResult = (value: unknown): value is MutationResult =>
  isRecord(value) &&
  value.success === true &&
  isBooking(value.booking) &&
  typeof value.reconciled === "boolean";
export const isDeviceActivationResponse = (
  value: unknown,
): value is DeviceActivationResponse =>
  isRecord(value) && isText(value.deviceToken, 512) && value.deviceToken.length >= 40;
