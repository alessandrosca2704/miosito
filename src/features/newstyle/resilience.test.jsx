import "@testing-library/jest-dom";
import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import NewStyleErrorBoundary from "./NewStyleErrorBoundary";
import { useBookings } from "./useBookings";
import { request } from "./api";
jest.mock("./api", () => ({ request: jest.fn() }));
const mockedRequest = request;
const booking = {
  uid: "test_one",
  title: "Taglio",
  serviceName: "Taglio",
  attendeeName: "Mario",
  status: "pending",
  start: "2026-09-29T08:00:00Z",
  end: "2026-09-29T08:15:00Z",
};
beforeEach(() => mockedRequest.mockReset());
test("render failure leaves a readable recovery action", () => {
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  function Broken() {
    throw new Error("render failed");
  }
  try {
    render(
      <NewStyleErrorBoundary>
        <Broken />
      </NewStyleErrorBoundary>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Agenda temporaneamente non disponibile",
    );
    expect(
      screen.getByRole("button", { name: "Ricarica la pagina" }),
    ).toBeVisible();
  } finally {
    log.mockRestore();
  }
});
test("pagination deduplicates and refresh failure preserves last verified state", async () => {
  mockedRequest.mockResolvedValueOnce({
    bookings: [booking],
    nextCursor: "page2",
  });
  const onError = jest.fn();
  const { result } = renderHook(() => useBookings("status=history", onError));
  await waitFor(() => expect(result.current.cursor).toBe("page2"));
  mockedRequest.mockResolvedValueOnce({
    bookings: [
      { ...booking, status: "accepted" },
      { ...booking, uid: "test_two" },
    ],
    nextCursor: null,
  });
  await act(async () => {
    await result.current.more();
  });
  expect(result.current.bookings).toHaveLength(2);
  expect(result.current.bookings[0].status).toBe("accepted");
  mockedRequest.mockRejectedValueOnce(new Error("Rete non disponibile"));
  act(() => result.current.refresh());
  await waitFor(() =>
    expect(result.current.error).toBe("Rete non disponibile"),
  );
  expect(result.current.bookings).toHaveLength(2);
  expect(onError).toHaveBeenCalledTimes(1);
});
test("late response from a previous filter cannot overwrite the active query", async () => {
  let resolveOld;
  mockedRequest.mockReturnValueOnce(
    new Promise((resolve) => {
      resolveOld = resolve;
    }),
  );
  const onError = jest.fn();
  const { result, rerender } = renderHook(
    ({ query }) => useBookings(query, onError),
    { initialProps: { query: "status=pending" } },
  );
  const oldSignal = mockedRequest.mock.calls[0][2];
  mockedRequest.mockResolvedValueOnce({
    bookings: [{ ...booking, status: "accepted" }],
    nextCursor: null,
  });
  rerender({ query: "status=history" });
  await waitFor(() =>
    expect(result.current.bookings[0]?.status).toBe("accepted"),
  );
  expect(oldSignal?.aborted).toBe(true);
  await act(async () => {
    resolveOld({ bookings: [booking], nextCursor: "stale" });
  });
  expect(result.current.bookings[0].status).toBe("accepted");
  expect(result.current.cursor).toBeNull();
});
