import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  listBookings,
  getBooking,
  changeBooking,
  mapCalBookingToBooking,
} from "../../server/newstyle/calService";
import { calRequest } from "../../server/newstyle/calClient";
import { serviceTitles } from "../../server/newstyle/serviceTitles";
import { eventScope } from "../../server/newstyle/scope";
import { beginLogin } from "../../server/newstyle/auth";
import legacy from "../../netlify/functions/newstyle";
import login, { config } from "../../netlify/functions/newstyle-login";
import bcrypt from "bcryptjs";
const originalFetch = global.fetch;
let account = 0;
const b = {
  uid: "safe123",
  title: "Titolo prenotazione",
  status: "pending",
  start: "2026-09-28T08:00:00Z",
  end: "2026-09-28T08:15:00Z",
  eventType: { id: 42 },
  attendees: [{ name: "Mario", email: "mario@example.test" }],
};
const ok = (data: unknown, pagination?: object) =>
  new Response(
    JSON.stringify({
      status: "success",
      data,
      ...(pagination ? { pagination } : {}),
    }),
    { headers: { "Content-Type": "application/json" } },
  );
const query = () =>
  new URLSearchParams({
    from: "2026-09-28T00:00:00Z",
    to: "2026-09-29T00:00:00Z",
  });
beforeEach(() => {
  process.env.CAL_API_KEY = "safety-" + ++account;
  process.env.NEWSTYLE_CAL_EVENT_TYPE_IDS = "42";
  delete process.env.NEWSTYLE_CAL_ALLOW_ALL_EVENTS;
  delete process.env.CAL_API_BASE_URL;
});
afterEach(() => {
  global.fetch = originalFetch;
});
test("missing scope fails closed before any read or write", async () => {
  delete process.env.NEWSTYLE_CAL_EVENT_TYPE_IDS;
  let calls = 0;
  global.fetch = async () => {
    calls++;
    return ok(b);
  };
  for (const fn of [
    () => listBookings(query()),
    () => getBooking(b.uid),
    () => changeBooking(b.uid, "confirm"),
  ])
    await assert.rejects(async () => fn(), { status: 503 });
  assert.equal(calls, 0);
});
test("whole account requires explicit opt-in; invalid IDs never grant access", () => {
  delete process.env.NEWSTYLE_CAL_EVENT_TYPE_IDS;
  for (const value of ["false", "TRUE", "1", ""]) {
    process.env.NEWSTYLE_CAL_ALLOW_ALL_EVENTS = value;
    assert.throws(eventScope, { status: 503 });
  }
  process.env.NEWSTYLE_CAL_ALLOW_ALL_EVENTS = "true";
  assert.deepEqual(eventScope(), []);
  process.env.NEWSTYLE_CAL_EVENT_TYPE_IDS = "42, 43";
  assert.deepEqual(eventScope(), [42, 43]);
  for (const value of ["0", "42,", "-3", "999999999999999999999"]) {
    process.env.NEWSTYLE_CAL_EVENT_TYPE_IDS = value;
    assert.throws(eventScope, { status: 503 });
  }
});
for (const status of [403, 404, 429, 500])
  test(`service title ${status} cannot hide valid bookings`, async () => {
    global.fetch = async (input) =>
      String(input).includes("event-types")
        ? new Response("{}", { status })
        : ok([b], { hasMore: false, nextCursor: null });
    const page = await listBookings(query());
    assert.equal(page.bookings[0].serviceName, b.title);
  });
test("title cache avoids repeated calls and is isolated by account", async () => {
  let calls = 0;
  global.fetch = async () => {
    calls++;
    return ok({ title: "Servizio " + calls });
  };
  const budget = () => ({ deadline: Date.now() + 20000 });
  assert.equal((await serviceTitles([42, 42], budget())).get(42), "Servizio 1");
  await serviceTitles([42], budget());
  assert.equal(calls, 1);
  process.env.CAL_API_KEY = "different-account";
  assert.equal((await serviceTitles([42], budget())).get(42), "Servizio 2");
});
test("metadata concurrency is bounded; expired operation budget starts no request", async () => {
  let active = 0,
    peak = 0,
    calls = 0;
  global.fetch = async () => {
    calls++;
    active++;
    peak = Math.max(peak, active);
    await new Promise((r) => setTimeout(r, 5));
    active--;
    return ok({ title: "Servizio" });
  };
  await serviceTitles([1, 2, 3, 4, 5, 6, 7], { deadline: Date.now() + 1000 });
  assert.ok(peak <= 3);
  assert.equal(calls, 7);
  await serviceTitles([100], { deadline: Date.now() - 1 });
  assert.equal(calls, 7);
  await assert.rejects(
    calRequest("/bookings", "2026-05-01", "GET", undefined, {
      deadline: Date.now() - 1,
    }),
    { status: 504 },
  );
  assert.equal(calls, 7);
});
for (const action of ["confirm", "reject"] as const)
  test(`lost ${action} response is reconciled without replaying mutation`, async () => {
    let written = false,
      posts = 0,
      reads = 0;
    global.fetch = async (_input, options) => {
      if (options?.method === "POST") {
        posts++;
        written = true;
        throw Object.assign(new Error("lost"), { name: "TimeoutError" });
      }
      reads++;
      return ok({
        ...b,
        status: written
          ? action === "confirm"
            ? "accepted"
            : "rejected"
          : "pending",
      });
    };
    const result = await changeBooking(b.uid, action);
    assert.equal(result.success, true);
    assert.equal(result.reconciled, true);
    assert.equal(posts, 1);
    assert.equal(reads, 2);
    await changeBooking(b.uid, action);
    assert.equal(posts, 1);
  });
test("uncertain mutation reports OUTCOME_UNKNOWN when verification also fails", async () => {
  let calls = 0;
  global.fetch = async () => {
    if (++calls === 1) return ok(b);
    throw new TypeError("offline");
  };
  await assert.rejects(changeBooking(b.uid, "confirm"), {
    status: 503,
    code: "OUTCOME_UNKNOWN",
  });
  assert.equal(calls, 3);
});
test("concurrent opposite decision returns conflict, never success", async () => {
  let calls = 0;
  global.fetch = async () => {
    calls++;
    return ok({ ...b, status: calls === 1 ? "pending" : "rejected" });
  };
  await assert.rejects(changeBooking(b.uid, "confirm"), {
    status: 409,
    code: "BOOKING_CONFLICT",
  });
});
test("booking lookup validates UID and scope even for recovery", async () => {
  global.fetch = async () => ok({ ...b, eventType: { id: 99 } });
  await assert.rejects(getBooking(b.uid), { status: 403 });
  global.fetch = async () => ok({ ...b, uid: "different" });
  await assert.rejects(getBooking(b.uid), { status: 502 });
});
test("mapper rejects malformed contacts, invalid intervals and missing timezone", () => {
  for (const value of [
    { ...b, attendees: [{ name: { bad: true } }] },
    { ...b, attendees: [{ name: "Mario", email: [] }] },
    { ...b, attendees: "wrong" },
    { ...b, eventType: { id: "42" } },
    { ...b, end: b.start },
    { ...b, start: "2026-09-28T08:00:00" },
  ])
    assert.throws(() => mapCalBookingToBooking(value), { status: 502 });
  assert.equal(
    mapCalBookingToBooking({ ...b, attendees: [] }).attendeeName,
    "Cliente",
  );
});
test("successful logins do not consume failed-attempt allowance and clear failures", () => {
  const ip = "success-reset";
  for (let i = 0; i < 9; i++) beginLogin(ip)(false);
  beginLogin(ip)(true);
  for (let i = 0; i < 20; i++) beginLogin(ip)(true);
  for (let i = 0; i < 10; i++) beginLogin(ip)(false);
  assert.throws(() => beginLogin(ip), { status: 429 });
});
test("concurrent password checks are bounded", () => {
  const finish = Array.from({ length: 10 }, () =>
    beginLogin("parallel-checks"),
  );
  assert.throws(() => beginLogin("parallel-checks"), { status: 429 });
  finish.forEach((f) => f(true));
  assert.doesNotThrow(() => beginLogin("parallel-checks")(true));
});
test("legacy login aliases cannot bypass dedicated platform-limited endpoint", async () => {
  for (const path of [
    "/api/newstyle/auth/login",
    "/.netlify/functions/newstyle/auth/login",
  ]) {
    const result = await legacy(new Request("https://example.test" + path, {
      method: "POST",
      headers: { origin: "https://example.test", "content-type": "application/json" },
      body: "{}",
    }), { ip: "192.0.2.1" });
    assert.equal(result.status, 404);
  }
  assert.deepEqual(config.path, [
    "/api/newstyle/auth/login",
    "/.netlify/functions/newstyle-login",
  ]);
  assert.deepEqual(config.rateLimit, {
    windowLimit: 10,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  });
});
test("real login entry sets cookie, rejects CSRF and ignores spoofed IP header", async () => {
  process.env.NEWSTYLE_ADMIN_USERNAME = "admin";
  process.env.NEWSTYLE_ADMIN_PASSWORD_HASH = bcrypt.hashSync("password", 4);
  process.env.NEWSTYLE_SESSION_SECRET = "s".repeat(40);
  process.env.NETLIFY_DEV = "false";
  const req = (origin = "https://example.test") =>
    new Request("https://example.test/api/newstyle/auth/login", {
      method: "POST",
      headers: {
        origin,
        "Content-Type": "application/json",
        "x-nf-client-connection-ip": "forged",
      },
      body: JSON.stringify({ username: "admin", password: "password" }),
    });
  const response = await login(req(), { ip: "trusted-client" });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("set-cookie")!, /HttpOnly.*Secure/);
  assert.equal(
    (await login(req("https://evil.test"), { ip: "trusted-client" })).status,
    403,
  );
  assert.equal(
    (
      await login(
        new Request("https://example.test/other", { method: "POST" }),
        { ip: "trusted-client" },
      )
    ).status,
    404,
  );
});
