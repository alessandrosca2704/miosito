import { test } from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { setEnvironmentContext } from "@netlify/blobs";
import activate from "../../netlify/functions/newstyle-device-activate";
import bookings from "../../netlify/functions/newstyle";
import { deviceTokenHash } from "../../server/newstyle/deviceAuth";

test("modern functions share device hashes with strong reads and preserve query and Bearer", async () => {
  const originalFetch = global.fetch;
  const originalHash = process.env.NEWSTYLE_ACTIVATION_CODE_HASH;
  const originalOrigins = process.env.NEWSTYLE_ALLOWED_ORIGINS;
  const originalContext = process.env.NETLIFY_BLOBS_CONTEXT;
  const originalCal = process.env.CAL_API_KEY;
  const originalScope = process.env.NEWSTYLE_CAL_EVENT_TYPE_IDS;
  const records = new Map<string, string>();
  let strongReads = 0;
  let revoked = false;
  process.env.NEWSTYLE_ACTIVATION_CODE_HASH = bcrypt.hashSync("test-only-code", 4);
  process.env.NEWSTYLE_ALLOWED_ORIGINS = "https://localhost,http://localhost:8888";
  process.env.CAL_API_KEY = "test-only-key";
  process.env.NEWSTYLE_CAL_EVENT_TYPE_IDS = "42";
  setEnvironmentContext({ siteID: "test-site", token: "test-only-blobs", edgeURL: "https://edge.example.test", uncachedEdgeURL: "https://strong.example.test" });
  global.fetch = async (input, options) => {
    const url = new URL(String(input));
    if (url.host.endsWith("example.test")) {
      if (options?.method?.toUpperCase() === "PUT") {
        records.set(url.pathname, String(options.body));
        return new Response(null, { status: 200 });
      }
      assert.equal(url.host, "strong.example.test");
      strongReads++;
      const record = records.get(url.pathname);
      if (!record) return new Response(null, { status: 404 });
      return new Response(revoked ? JSON.stringify({ ...JSON.parse(record), revokedAt: new Date().toISOString() }) : record);
    }
    assert.equal(url.host, "api.cal.com");
    if (url.pathname.endsWith("/bookings")) {
      assert.equal(url.searchParams.get("status"), "unconfirmed");
      return new Response(JSON.stringify({ status: "success", data: [], pagination: { hasMore: false } }));
    }
    return new Response(JSON.stringify({ status: "success", data: { eventTypes: [] } }));
  };
  const base = "https://www.alessandroscarimbolo.it/api/newstyle";
  try {
    for (const origin of ["https://localhost", "http://localhost:8888"]) {
      for (const [path, fn] of [["/device/activate", activate], ["/bookings", bookings]] as const) {
        const response = await fn(new Request(base + path, { method: "OPTIONS", headers: { Origin: origin, "Access-Control-Request-Method": path.includes("activate") ? "POST" : "GET", "Access-Control-Request-Headers": "authorization,content-type" } }), { ip: "192.0.2.10" });
        assert.equal(response.status, 204);
        assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
        assert.equal(response.headers.get("Access-Control-Allow-Headers"), "Authorization, Content-Type");
      }
    }
    const response = await activate(new Request(base + "/device/activate", { method: "POST", headers: { Origin: "https://localhost", "Content-Type": "application/json" }, body: JSON.stringify({ activationCode: "test-only-code" }) }), { ip: "192.0.2.10" });
    assert.equal(response.status, 200);
    const { deviceToken } = await response.json();
    assert.equal(records.size, 1);
    assert.equal(JSON.parse([...records.values()][0]).tokenHash === deviceTokenHash(deviceToken), true);
    assert.equal([...records.values()][0].includes(deviceToken), false);
    const get = (token?: string) => bookings(new Request(base + "/bookings?status=pending", { headers: { Origin: "https://localhost", ...(token ? { Authorization: "Bearer " + token } : {}) } }), { ip: "192.0.2.10" });
    assert.equal((await get(deviceToken)).status, 200);
    assert.equal(strongReads, 1);
    const missing = await get();
    assert.equal(missing.status, 401);
    assert.equal((await missing.json()).code, "DEVICE_TOKEN_MISSING");
    const invalid = await get("test-only-invalid");
    assert.equal(invalid.status, 401);
    assert.equal((await invalid.json()).code, "DEVICE_UNAUTHORIZED");
    revoked = true;
    const revokedResponse = await get(deviceToken);
    assert.equal(revokedResponse.status, 401);
    assert.equal((await revokedResponse.json()).code, "DEVICE_UNAUTHORIZED");
    const bad = await activate(new Request(base + "/device/activate", { method: "POST", headers: { Origin: "https://localhost", "Content-Type": "application/json" }, body: JSON.stringify({ activationCode: "wrong-test-code" }) }), { ip: "192.0.2.11" });
    assert.equal(bad.status, 401);
    assert.equal((await bad.json()).code, "ACTIVATION_CODE_INVALID");
  } finally {
    global.fetch = originalFetch;
    for (const [key, value] of Object.entries({ NEWSTYLE_ACTIVATION_CODE_HASH: originalHash, NEWSTYLE_ALLOWED_ORIGINS: originalOrigins, NETLIFY_BLOBS_CONTEXT: originalContext, CAL_API_KEY: originalCal, NEWSTYLE_CAL_EVENT_TYPE_IDS: originalScope })) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});


test("missing Blobs context is a service error, never a revoked device", async () => {
  const previous = process.env.NETLIFY_BLOBS_CONTEXT;
  setEnvironmentContext({});
  try {
    const response = await bookings(new Request("https://example.test/api/newstyle/bookings", {
      headers: { Origin: "https://example.test", Authorization: "Bearer test-only-token" },
    }), { ip: "192.0.2.12" });
    assert.equal(response.status, 503);
    assert.notEqual((await response.json()).code, "DEVICE_UNAUTHORIZED");
  } finally {
    if (previous === undefined) delete process.env.NETLIFY_BLOBS_CONTEXT;
    else process.env.NETLIFY_BLOBS_CONTEXT = previous;
  }
});
