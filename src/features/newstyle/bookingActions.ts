import { ApiError, request } from "./api";
import type { Booking, MutationResult } from "./types";
export type ActionOutcome =
  | { kind: "done"; booking: Booking; reconciled: boolean }
  | { kind: "different"; booking: Booking }
  | { kind: "unverified" };
export async function performBookingAction(
  uid: string,
  action: "confirm" | "reject",
): Promise<ActionOutcome> {
  try {
    const result = await request<MutationResult>(
      `/bookings/${encodeURIComponent(uid)}/${action}`,
      {},
    );
    return {
      kind: "done",
      booking: result.booking,
      reconciled: result.reconciled,
    };
  } catch (error) {
    if (
      !(error instanceof ApiError) ||
      (error.status !== 0 && error.status !== 409 && error.status < 500)
    )
      throw error;
    try {
      const { booking } = await request<{ booking: Booking }>(
        `/bookings/${encodeURIComponent(uid)}`,
      );
      if (booking.status === (action === "confirm" ? "accepted" : "rejected"))
        return { kind: "done", booking, reconciled: true };
      if (booking.status !== "pending") return { kind: "different", booking };
    } catch (check) {
      if (check instanceof ApiError && [401, 403, 404].includes(check.status))
        throw check;
    }
    return { kind: "unverified" };
  }
}
