import { act, fireEvent, render, screen, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { getCalApi } from "@calcom/embed-react";

jest.mock("@calcom/embed-react", () => ({ getCalApi: jest.fn() }));
process.env.REACT_APP_CALCOM_EVENT_URL = "https://cal.com/test-profile/test-event";
const { default: CalBooking, getBookingConfig } = require("./CalBooking");

afterEach(() => {
  cleanup();
  jest.useRealTimers();
  jest.clearAllMocks();
});

test("accepts event links only on the expected HTTPS origin", () => {
  for (const value of [undefined, "", "https://cal.com/user", "https://cal.com.evil.test/user/event", "ftp://cal.com/user/event", "http://cal.com/user/event"]) {
    expect(getBookingConfig(value)).toBeNull();
  }
  expect(getBookingConfig("https://cal.com/user/event/")).toEqual({ calLink: "user/event", url: "https://cal.com/user/event" });
});

test("loads on interaction, opens the official modal and removes event handlers", async () => {
  const cal = jest.fn();
  getCalApi.mockResolvedValue(cal);
  const { unmount } = render(<CalBooking />);
  expect(getCalApi).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button"));
  await waitFor(() => expect(getCalApi).toHaveBeenCalled());
  expect(cal).toHaveBeenCalledWith("modal", expect.objectContaining({ calLink: "test-profile/test-event" }));
  const ready = cal.mock.calls.find(([command, options]) => command === "on" && options.action === "linkReady")[1].callback;
  act(() => ready());
  expect(screen.getByRole("button")).toBeEnabled();
  expect(cal).toHaveBeenCalledWith("off", { action: "linkReady", callback: ready });
  unmount();
});

test("failed SDK loading keeps the direct booking alternative available", async () => {
  getCalApi.mockRejectedValue(new Error("offline"));
  render(<CalBooking />);
  fireEvent.click(screen.getByRole("button"));
  await waitFor(() => expect(getCalApi).toHaveBeenCalled());
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Il calendario non risponde"));
  expect(screen.getByRole("link")).toHaveAttribute("href", process.env.REACT_APP_CALCOM_EVENT_URL);
});

test("a late SDK response cannot open a popup after the timeout", async () => {
  jest.useFakeTimers();
  let resolveApi;
  getCalApi.mockReturnValue(new Promise(resolve => { resolveApi = resolve; }));
  render(<CalBooking />);
  fireEvent.click(screen.getByRole("button"));
  await waitFor(() => expect(getCalApi).toHaveBeenCalled());
  act(() => jest.advanceTimersByTime(15000));
  const cal = jest.fn();
  await act(async () => resolveApi(cal));
  expect(cal).not.toHaveBeenCalled();
  await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Il calendario non risponde"));
});
