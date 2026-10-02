import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { routeNewStyle } from "../../server/newstyle/router";
import { session, sessionCookie } from "../../server/newstyle/auth";
import { mapCalBookingToBooking } from "../../server/newstyle/calService";
import { todayRange, localDate } from "../../src/features/newstyle/dates";
const handler = (event: Parameters<typeof routeNewStyle>[0]) =>
  routeNewStyle(event, true);
let testAccount = 0;
const originalFetch = global.fetch;
const fixture = {
  uid: "abc_123",
  title: "Taglio con Mario",
  status: "pending",
  start: "2026-09-28T08:00:00Z",
  end: "2026-09-28T08:30:00Z",
  eventType: { id: 42, slug: "taglio" },
  attendees: [
    { name: "Mario", email: "mario@example.test", phoneNumber: "+3900000000" },
  ],
};
beforeEach(() => {
  process.env.NEWSTYLE_ADMIN_USERNAME = "admin";
  process.env.NEWSTYLE_ADMIN_PASSWORD_HASH = bcrypt.hashSync(
    "test-password",
    4,
  );
  process.env.NEWSTYLE_SESSION_SECRET = "s".repeat(40);
  process.env.CAL_API_KEY = "test-only-" + ++testAccount;
  delete process.env.NEWSTYLE_CAL_ALLOW_ALL_EVENTS;
  process.env.NEWSTYLE_CAL_EVENT_TYPE_IDS = "42";
  process.env.NETLIFY_DEV = "true";
});
afterEach(() => {
  global.fetch = originalFetch;
});
function event(
  path: string,
  method = "GET",
  body?: object,
  authenticated = false,
) {
  return {
    path: "/api/newstyle" + path,
    httpMethod: method,
    headers: {
      host: "localhost:8888",
      origin: "http://localhost:8888",
      "content-type": "application/json",
      cookie: authenticated ? sessionCookie(false).split(";")[0] : "",
      "x-nf-client-connection-ip": path,
    } as Record<string, string>,
    body: body ? JSON.stringify(body) : null,
  };
}
function mock(data: unknown, status = 200) {
  global.fetch = async () => new Response(JSON.stringify(data), { status });
}
test("failed login does not set cookie", async () => {
  const r = await handler(
    event("/auth/login", "POST", { username: "admin", password: "wrong" }),
  );
  assert.equal(r.statusCode, 401);
  assert.equal(r.headers["Set-Cookie"], undefined);
});
test("valid login, refresh session, logout, secure cookie", async () => {
  const r = await handler(
    event("/auth/login", "POST", {
      username: "admin",
      password: "test-password",
    }),
  );
  assert.equal(r.statusCode, 200);
  assert.match(r.headers["Set-Cookie"], /HttpOnly; SameSite=Strict/);
  assert.ok(session(r.headers["Set-Cookie"]));
  const e = event("/auth/session");
  e.headers.cookie = r.headers["Set-Cookie"];
  assert.deepEqual(JSON.parse((await handler(e)).body), {
    authenticated: true,
  });
  assert.match(
    (await handler(event("/auth/logout", "POST", {}))).headers["Set-Cookie"],
    /Max-Age=0/,
  );
  assert.match(sessionCookie(true), /; Secure/);
});
test("tampered and credential-rotated sessions rejected", () => {
  const cookie = sessionCookie(false);
  assert.equal(
    session(cookie.replace("newstyle_session=", "newstyle_session=x")),
    false,
  );
  process.env.NEWSTYLE_ADMIN_USERNAME = "changed";
  assert.equal(session(cookie), false);
});
test("netlify dev can whitelist a specific external device origin", async () => {
  process.env.NETLIFY_DEV = "true";
  process.env.NEWSTYLE_DEV_ALLOWED_ORIGINS = "http://192.168.1.20:3000";
  const e = event("/auth/login", "POST", {
    username: "admin",
    password: "test-password",
  });
  e.headers.host = "localhost:8888";
  e.headers.origin = "http://192.168.1.20:3000";
  e.headers["sec-fetch-site"] = "cross-site";
  const r = await handler(e);
  assert.equal(r.statusCode, 200);
  delete process.env.NEWSTYLE_DEV_ALLOWED_ORIGINS;
});
test("unauthenticated bookings and mutations are 401", async () => {
  for (const path of [
    "/bookings",
    "/bookings/abc_123/confirm",
    "/bookings/abc_123/reject",
  ])
    assert.equal(
      (await handler(event(path, path === "/bookings" ? "GET" : "POST", {})))
        .statusCode,
      401,
    );
});
test("cross origin mutation is rejected", async () => {
  const e = event("/auth/login", "POST", {});
  e.headers.origin = "https://evil.example";
  assert.equal((await handler(e)).statusCode, 403);
});
test("allowed device origin supports CORS preflight", async () => {
  process.env.NEWSTYLE_ALLOWED_ORIGINS = "https://localhost";
  const e = event("/bookings", "OPTIONS");
  e.headers.origin = "https://localhost";
  const r = await handler(e);
  assert.equal(r.statusCode, 204);
  assert.equal(r.headers["Access-Control-Allow-Origin"], "https://localhost");
  delete process.env.NEWSTYLE_ALLOWED_ORIGINS;
});
test("maps documented booking and attendee fields", () => {
  assert.deepEqual(mapCalBookingToBooking(fixture, "Taglio"), {
    uid: "abc_123",
    title: "Taglio con Mario",
    attendeeName: "Mario",
    attendeeEmail: "mario@example.test",
    attendeePhone: "+3900000000",
    serviceName: "Taglio",
    start: fixture.start,
    end: fixture.end,
    status: "pending",
  });
});
for (const action of ["confirm", "reject"])
  test(action + " uses verified endpoint, version and payload", async () => {
    const calls: { url: string; options?: RequestInit }[] = [];
    global.fetch = async (input, options) => {
      calls.push({ url: String(input), options });
      return new Response(
        JSON.stringify({
          status: "success",
          data: {
            ...fixture,
            status:
              options?.method === "POST"
                ? action === "confirm"
                  ? "accepted"
                  : "rejected"
                : "pending",
          },
        }),
      );
    };
    const r = await handler(
      event(
        "/bookings/abc_123/" + action,
        "POST",
        action === "reject" ? { reason: "Indisponibile" } : {},
        true,
      ),
    );
    assert.equal(r.statusCode, 200);
    assert.equal(calls.length, 2);
    assert.ok(
      calls[1].url.endsWith(action === "confirm" ? "/confirm" : "/decline"),
    );
    assert.equal(
      (calls[1].options?.headers as Record<string, string>)["cal-api-version"],
      "2026-02-25",
    );
    assert.equal(
      calls[1].options?.body,
      action === "confirm"
        ? undefined
        : JSON.stringify({ reason: "Indisponibile" }),
    );
  });
test("scope blocks foreign bookings and repeated confirmation is idempotent", async () => {
  mock({ status: "success", data: { ...fixture, eventType: { id: 99 } } });
  assert.equal(
    (await handler(event("/bookings/abc_123/confirm", "POST", {}, true)))
      .statusCode,
    403,
  );
  mock({ status: "success", data: { ...fixture, status: "accepted" } });
  assert.equal(
    (await handler(event("/bookings/abc_123/confirm", "POST", {}, true)))
      .statusCode,
    200,
  );
});
for (const status of [401, 403, 404, 409, 429, 500])
  test("upstream error " + status + " is sanitized", async () => {
    mock({ secret: "test-only", stack: "private" }, status);
    const r = await handler(
      event("/bookings/abc_123/confirm", "POST", {}, true),
    );
    assert.equal(r.statusCode, status === 401 || status === 500 ? 502 : status);
    assert.ok(!r.body.includes("test-only"));
    assert.ok(!r.body.includes("private"));
  });
test("network and timeout errors are sanitized", async () => {
  for (const [name, status] of [
    ["TypeError", 502],
    ["TimeoutError", 504],
  ] as const) {
    global.fetch = async () => {
      const e = new Error("secret");
      e.name = name;
      throw e;
    };
    assert.equal(
      (await handler(event("/bookings/abc_123/confirm", "POST", {}, true)))
        .statusCode,
      status,
    );
  }
});
test("list uses cursor pagination, server scope, event title and filters", async () => {
  const calls: string[] = [];
  global.fetch = async (input, options) => {
    const url = String(input);
    calls.push(url);
    return new Response(
      JSON.stringify(
        url.includes("event-types")
          ? { status: "success", data: { title: "Taglio" } }
          : {
              status: "success",
              data: [fixture],
              pagination: { hasMore: true, nextCursor: "next_page" },
            },
      ),
    );
  };
  const e = {
    ...event("/bookings", "GET", undefined, true),
    queryStringParameters: {
      from: "2026-09-28T00:00:00+02:00",
      to: "2026-09-29T00:00:00+02:00",
      cursor: "first_page",
    },
  };
  const r = await handler(e);
  assert.equal(r.statusCode, 200);
  assert.equal(JSON.parse(r.body).bookings[0].serviceName, "Taglio");
  assert.equal(JSON.parse(r.body).nextCursor, "next_page");
  assert.ok(calls[0].includes("eventTypeIds=42"));
  assert.ok(calls[0].includes("cursor=first_page"));
});
test("malformed body, UID and excessive range are rejected", async () => {
  const bad = { ...event("/auth/login", "POST"), body: "{" };
  assert.equal((await handler(bad)).statusCode, 400);
  assert.equal(
    (await handler(event("/bookings/a%20b/confirm", "POST", {}, true)))
      .statusCode,
    400,
  );
  const e = {
    ...event("/bookings", "GET", undefined, true),
    queryStringParameters: { from: "2026-01-01", to: "2026-12-31" },
  };
  assert.equal((await handler(e)).statusCode, 400);
});
test("Rome handles UTC midnight and daylight saving days", () => {
  assert.equal(localDate("2026-09-27T22:30:00Z").toISODate(), "2026-09-28");
  assert.equal(
    localDate("2026-03-29T00:00:00+01:00")
      .plus({ days: 1 })
      .diff(localDate("2026-03-29T00:00:00+01:00"), "hours").hours,
    23,
  );
  assert.equal(
    localDate("2026-10-25T00:00:00+02:00")
      .plus({ days: 1 })
      .diff(localDate("2026-10-25T00:00:00+02:00"), "hours").hours,
    25,
  );
  assert.ok(todayRange().from);
});
test("login rate limit returns 429", async () => {
  let last;
  for (let i = 0; i < 11; i++) {
    const e = event("/auth/login", "POST", {
      username: "admin",
      password: "wrong",
    });
    e.headers["x-nf-client-connection-ip"] = "rate-test";
    last = await handler(e);
  }
  assert.equal(last?.statusCode, 429);
});

test("history includes all decided requests without calendar date bounds and keeps pagination", async () => {
  let bookingUrl = "";
  global.fetch = async (input) => {
    const url = String(input);
    if (url.includes("event-types"))
      return new Response(
        JSON.stringify({ status: "success", data: { title: "Taglio" } }),
      );
    bookingUrl = url;
    return new Response(
      JSON.stringify({
        status: "success",
        data: [
          {
            ...fixture,
            uid: "old_accepted",
            status: "accepted",
            start: "2020-01-01T09:00:00Z",
            end: "2020-01-01T09:30:00Z",
          },
          { ...fixture, uid: "rejected", status: "rejected" },
          { ...fixture, uid: "cancelled", status: "cancelled" },
          { ...fixture, uid: "pending", status: "pending" },
          {
            ...fixture,
            uid: "outside_scope",
            status: "accepted",
            eventType: { id: 999 },
          },
        ],
        pagination: { hasMore: true, nextCursor: "next_history_page" },
      }),
    );
  };
  const response = await handler({
    ...event("/bookings", "GET", undefined, true),
    queryStringParameters: { status: "history" },
  });
  assert.equal(response.statusCode, 200);
  const body = JSON.parse(response.body);
  assert.deepEqual(
    body.bookings.map((b: { uid: string }) => b.uid),
    ["rejected", "cancelled", "old_accepted"],
  );
  assert.equal(body.nextCursor, "next_history_page");
  const query = new URL(bookingUrl).searchParams;
  assert.equal(query.has("status"), false);
  assert.equal(query.has("afterStart"), false);
  assert.equal(query.has("beforeEnd"), false);
  assert.equal(query.get("sortStart"), "desc");
  assert.equal(query.get("eventTypeIds"), "42");
  const filtered = await handler({
    ...event("/bookings", "GET", undefined, true),
    queryStringParameters: {
      status: "history",
      historyStatus: "cancelled",
      cursor: "next_history_page",
    },
  });
  assert.deepEqual(
    JSON.parse(filtered.body).bookings.map((b: { uid: string }) => b.uid),
    ["cancelled"],
  );
  assert.equal(
    new URL(bookingUrl).searchParams.get("cursor"),
    "next_history_page",
  );
});

test("history rejects unsupported state filters and unauthenticated access", async () => {
  assert.equal(
    (
      await handler({
        ...event("/bookings"),
        queryStringParameters: { status: "history" },
      })
    ).statusCode,
    401,
  );
  assert.equal(
    (
      await handler({
        ...event("/bookings", "GET", undefined, true),
        queryStringParameters: { status: "history", historyStatus: "pending" },
      })
    ).statusCode,
    400,
  );
});
