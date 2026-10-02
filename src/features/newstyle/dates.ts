import { DateTime } from "luxon";
export const ZONE = "Europe/Rome";
export const localDate = (iso: string) =>
  DateTime.fromISO(iso, { zone: ZONE }).setLocale("it");
export const time = (iso: string) => localDate(iso).toFormat("HH:mm");
export const day = (iso: string) => localDate(iso).toFormat("cccc d LLLL yyyy");
export function todayRange() {
  const start = DateTime.now().setZone(ZONE).startOf("day");
  return { from: start.toISO()!, to: start.plus({ days: 1 }).toISO()! };
}
export const statusLabel = (status: string) =>
  ({
    pending: "Da confermare",
    accepted: "Confermato",
    cancelled: "Annullato",
    rejected: "Rifiutato",
  })[status] || "Stato non disponibile";
