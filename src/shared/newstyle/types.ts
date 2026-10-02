export type Booking = {
  uid: string;
  title: string;
  attendeeName: string;
  attendeeEmail?: string;
  attendeePhone?: string;
  serviceName: string;
  start: string;
  end: string;
  status: "pending" | "accepted" | "cancelled" | "rejected" | string;
};
export type BookingPage = { bookings: Booking[]; nextCursor: string | null };
export type MutationResult = {
  success: true;
  booking: Booking;
  reconciled: boolean;
};
export type CalendarPosition = { view: string; date: string };
export type DeviceActivationResponse = { deviceToken: string };
