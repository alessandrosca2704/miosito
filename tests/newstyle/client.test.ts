import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { request } from "../../src/features/newstyle/api";
import { performBookingAction } from "../../src/features/newstyle/bookingActions";
import { apiFetch, activateDevice } from "../../src/features/newstyle/deviceApi";
import type { DeviceTokenStorage } from "../../src/features/newstyle/deviceTokenStorage";
const originalFetch = global.fetch;
afterEach(() => {
  global.fetch = originalFetch;
});
const booking = {
  uid: "client123",
  title: "Taglio",
  attendeeName: "Mario",
  serviceName: "Taglio",
  start: "2026-09-28T08:00:00Z",
  end: "2026-09-28T08:15:00Z",
  status: "accepted",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
test("HTML 200, invalid JSON and unexpected mutation bodies are never success", async () => {
  for (const make of [
    () => new Response("<html>fallback</html>"),
    () =>
      new Response("{", { headers: { "Content-Type": "application/json" } }),
    () => json({}),
    () => json({ success: false }),
    () =>
      json({
        success: true,
        booking: { ...booking, attendeeName: {} },
        reconciled: false,
      }),
  ]) {
    global.fetch = async () => make();
    await assert.rejects(request("/bookings/client123/confirm", {}), {
      code: "INVALID_RESPONSE",
    });
  }
});
test("login requires authenticated true; logout requires false", async () => {
  global.fetch = async () => json({ authenticated: false });
  await assert.rejects(request("/auth/login", {}), {
    code: "INVALID_RESPONSE",
  });
  global.fetch = async () => json({ authenticated: true });
  await assert.rejects(request("/auth/logout", {}), {
    code: "INVALID_RESPONSE",
  });
});
test("invalid list payload cannot reach React", async () => {
  global.fetch = async () =>
    json({
      bookings: [{ ...booking, attendeeName: { unexpected: true } }],
      nextCursor: null,
    });
  await assert.rejects(request("/bookings?status=history"), {
    code: "INVALID_RESPONSE",
  });
});
test("timeout bounds fetch and response-body reads", async () => {
  for (const bodyHang of [false, true]) {
    global.fetch = async () =>
      bodyHang
        ? ({
            ok: true,
            status: 200,
            headers: new Headers({ "Content-Type": "application/json" }),
            json: () => new Promise(() => {}),
          } as Response)
        : new Promise(() => {});
    await assert.rejects(request("/auth/session", undefined, undefined, 15), {
      code: "TIMEOUT",
    });
  }
});
test("platform 429 HTML gives readable message, not a protocol error", async () => {
  global.fetch = async () => new Response("rate limited", { status: 429 });
  await assert.rejects(request("/auth/login", {}), {
    status: 429,
    message: "Troppi tentativi. Attendi qualche minuto e riprova.",
  });
});
test("lost client response triggers GET reconciliation, never a second POST", async () => {
  const methods: string[] = [];
  global.fetch = async (_input, options) => {
    methods.push(options!.method!);
    if (options?.method === "POST") throw new TypeError("offline");
    return json({ booking });
  };
  assert.equal(
    (await performBookingAction(booking.uid, "confirm")).kind,
    "done",
  );
  assert.deepEqual(methods, ["POST", "GET"]);
});
test("pending or unavailable recovery leaves outcome unverified", async () => {
  for (const pending of [true, false]) {
    global.fetch = async (_input, options) =>
      options?.method === "POST"
        ? json({ error: "ambiguous", code: "OUTCOME_UNKNOWN" }, 503)
        : pending
          ? json({ booking: { ...booking, status: "pending" } })
          : json({ error: "offline" }, 502);
    assert.equal(
      (await performBookingAction(booking.uid, "confirm")).kind,
      "unverified",
    );
  }
});
test("conflicting final state is surfaced and session expiry is not retried", async () => {
  global.fetch = async (_input, options) =>
    options?.method === "POST"
      ? json({ error: "conflict" }, 409)
      : json({ booking: { ...booking, status: "rejected" } });
  assert.equal(
    (await performBookingAction(booking.uid, "confirm")).kind,
    "different",
  );
  let calls = 0;
  global.fetch = async () => {
    calls++;
    return json({ error: "expired" }, 401);
  };
  await assert.rejects(performBookingAction(booking.uid, "confirm"), {
    status: 401,
  });
  assert.equal(calls, 1);
});

test("device API clears the token and reports a friendly activation error on 401", async () => {
  let token: string | null = "device-token";
  let unauthorized = 0;
  const storage: DeviceTokenStorage = {
    async getToken() {
      return token;
    },
    async setToken(value) {
      token = value;
    },
    async clearToken() {
      token = null;
    },
  };
  global.fetch = async (_input, options) => {
    assert.equal(
      (options?.headers as Record<string, string>).Authorization,
      "Bearer device-token",
    );
    return json({ error: "Dispositivo non attivato." }, 401);
  };
  await assert.rejects(
    apiFetch("/bookings", { storage, onUnauthorized: () => unauthorized++ }),
    { status: 401, code: "DEVICE_UNAUTHORIZED" },
  );
  assert.equal(token, null);
  assert.equal(unauthorized, 1);
});

test("impossible calendar dates are rejected before date formatting", async () => {
  const { isInstant } = await import("../../src/features/newstyle/contracts");
  for (const value of [
    "2026-02-30T10:00:00Z",
    "2026-04-31T10:00:00+02:00",
    "2026-09-29T24:30:00Z",
    "2026-09-29T10:00:00+25:00",
  ])
    assert.equal(isInstant(value), false);
  assert.equal(isInstant("2028-02-29T10:00:00+01:00"), true);
});


test("invalid activation code preserves existing storage and does not expire device", async () => {
  let token: string | null = "old-token";
  const storage: DeviceTokenStorage = {
    async getToken() { return token; },
    async setToken(value) { token = value; },
    async clearToken() { token = null; },
  };
  global.fetch = async (_input, options) => {
    assert.equal((options?.headers as Record<string, string>).Authorization, undefined);
    return json({ error: "Codice di attivazione non valido.", code: "ACTIVATION_CODE_INVALID" }, 401);
  };
  await assert.rejects(activateDevice("test-only-code", { storage }), { code: "ACTIVATION_CODE_INVALID" });
  assert.equal(token, "old-token");
});
