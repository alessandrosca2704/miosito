import { useCallback, useEffect, useRef, useState } from "react";
import { request } from "./api";
import type { Booking, BookingPage } from "./types";
export function useBookings(query: string, onError: (error: unknown) => void) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const controller = useRef<AbortController>();
  const previousQuery = useRef<string>();
  const load = useCallback(
    async (next?: string) => {
      controller.current?.abort();
      const active = new AbortController();
      controller.current = active;
      setLoading(true);
      setError("");
      try {
        const result = await request<BookingPage>(
          "/bookings?" +
            query +
            (next ? "&cursor=" + encodeURIComponent(next) : ""),
          undefined,
          active.signal,
        );
        if (active.signal.aborted) return;
        setBookings((previous) =>
          Array.from(
            new Map(
              (next ? [...previous, ...result.bookings] : result.bookings).map(
                (b) => [b.uid, b],
              ),
            ).values(),
          ).sort(
            (a, b) =>
              (new URLSearchParams(query).get("status") === "history"
                ? -1
                : 1) *
              (Date.parse(a.start) - Date.parse(b.start)),
          ),
        );
        setCursor(result.nextCursor);
      } catch (e) {
        if (!active.signal.aborted) {
          setError(
            e instanceof Error
              ? e.message
              : "Impossibile caricare gli appuntamenti.",
          );
          onError(e);
        }
      } finally {
        if (!active.signal.aborted) setLoading(false);
      }
    },
    [query, onError],
  );
  useEffect(() => {
    if (previousQuery.current !== query) {
      setBookings([]);
      setCursor(null);
    }
    previousQuery.current = query;
    if (query) void load();
    else {
      setLoading(false);
      setError("");
    }
    return () => controller.current?.abort();
  }, [query, load, revision]);
  return {
    bookings,
    loading,
    error,
    cursor,
    refresh: () => setRevision((x) => x + 1),
    more: () => cursor && load(cursor),
    update: (uid: string, status: string) =>
      setBookings((bs) =>
        bs.map((b) => (b.uid === uid ? { ...b, status } : b)),
      ),
  };
}
