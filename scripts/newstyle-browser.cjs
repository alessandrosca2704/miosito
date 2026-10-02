const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const puppeteer = require("puppeteer");
const { DateTime } = require("luxon");
require("tsx/cjs");
const bcrypt = require("bcryptjs");
const { handler } = require("../netlify/functions/newstyle.ts");
const login = require("../netlify/functions/newstyle-login.ts").default;
(async () => {
  process.env.NETLIFY_DEV = "true";
  process.env.NEWSTYLE_ADMIN_USERNAME = "admin";
  process.env.NEWSTYLE_ADMIN_PASSWORD_HASH = bcrypt.hashSync("test", 4);
  process.env.NEWSTYLE_SESSION_SECRET = "integration-test-secret-".repeat(3);
  process.env.NEWSTYLE_CAL_EVENT_TYPE_IDS = "42";
  process.env.CAL_API_KEY = "integration-test-only";
  delete process.env.CAL_API_BASE_URL;
  delete process.env.NEWSTYLE_CAL_ALLOW_ALL_EVENTS;
  const start = DateTime.now()
    .setZone("Europe/Rome")
    .startOf("day")
    .plus({ hours: 10 });
  const bookings = [
    {
      uid: "test_one",
      title: "Taglio",
      serviceName: "Taglio",
      attendeeName: "Mario Rossi",
      start: start.toISO(),
      end: start.plus({ minutes: 15 }).toISO(),
      status: "pending",
    },
    {
      uid: "test_two",
      title: "Barba",
      serviceName: "Barba",
      attendeeName: "Luca Bianchi",
      start: start.plus({ hours: 1 }).toISO(),
      end: start.plus({ hours: 1, minutes: 15 }).toISO(),
      status: "pending",
    },
  ];
  bookings.push({
    ...bookings[0],
    uid: "test_cancelled",
    attendeeName: "Cliente annullato",
    status: "cancelled",
  });

  const historyRequests = [];
  let pageSize = 100,
    malformed = false,
    postCount = 0;
  let failNextWrite = false,
    detailUnavailable = false;
  const originalFetch = global.fetch;
  global.fetch = async (input, init = {}) => {
    const url = new URL(String(input));
    assert.equal(
      url.hostname,
      "api.cal.com",
      "No external network in this test",
    );
    const reply = (data, pagination) =>
      new Response(JSON.stringify({ status: "success", data, pagination }), {
        headers: { "Content-Type": "application/json" },
      });
    if (url.pathname.includes("/event-types/"))
      return reply({ title: "Taglio" });
    const raw = (b) => ({
      ...b,
      eventType: { id: 42 },
      attendees: [{ name: b.attendeeName }],
    });
    if (url.pathname.endsWith("/bookings")) {
      let rows = bookings.filter(
        (b) =>
          (url.searchParams.get("status") !== "unconfirmed" ||
            b.status === "pending") &&
          (!url.searchParams.get("afterStart") ||
            Date.parse(b.start) >
              Date.parse(url.searchParams.get("afterStart"))) &&
          (!url.searchParams.get("beforeEnd") ||
            Date.parse(b.end) < Date.parse(url.searchParams.get("beforeEnd"))),
      );
      rows.sort(
        (a, b) =>
          (url.searchParams.get("sortStart") === "desc" ? -1 : 1) *
          (Date.parse(a.start) - Date.parse(b.start)),
      );
      const offset = Number(url.searchParams.get("cursor") || 0);
      const hasMore = rows.length > offset + pageSize;
      return reply(rows.slice(offset, offset + pageSize).map(raw), {
        hasMore,
        nextCursor: hasMore ? String(offset + pageSize) : null,
      });
    }
    const b = bookings.find((b) => url.pathname.split("/").includes(b.uid));
    assert.ok(b, "Expected fixture booking");
    if (detailUnavailable)
      throw new TypeError("Simulated unavailable verification");
    if (init.method === "POST") {
      postCount++;
      if (failNextWrite) {
        failNextWrite = false;
        detailUnavailable = true;
        throw new TypeError("Simulated uncertain write");
      }
      b.status = url.pathname.endsWith("/confirm") ? "accepted" : "rejected";
      if (b.uid === "test_one")
        throw new TypeError("Simulated lost response after successful write");
    }
    return reply(raw(b));
  };
  const root = path.resolve(__dirname, "../build");
  const server = http.createServer(async (req, res) => {
    if (
      req.url.startsWith("/api/newstyle") ||
      req.url.startsWith("/.netlify/functions/newstyle")
    ) {
      try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const body = Buffer.concat(chunks).toString() || null;
        if (url.searchParams.get("status") === "history")
          historyRequests.push(url.search);
        if (malformed && url.pathname.endsWith("/bookings")) {
          res.writeHead(200, { "Content-Type": "text/html" });
          return res.end("<html>gateway fallback</html>");
        }
        if (
          [
            "/api/newstyle/auth/login",
            "/.netlify/functions/newstyle-login",
          ].includes(url.pathname)
        ) {
          const result = await login(
            new Request(url, {
              method: req.method,
              headers: req.headers,
              ...(body ? { body } : {}),
            }),
            { ip: "127.0.0.1" },
          );
          res.writeHead(result.status, Object.fromEntries(result.headers));
          return res.end(await result.text());
        }
        const result = await handler({
          path: url.pathname,
          httpMethod: req.method,
          headers: req.headers,
          body,
          queryStringParameters: Object.fromEntries(url.searchParams),
        });
        res.writeHead(result.statusCode, result.headers);
        return res.end(result.body);
      } catch (error) {
        res.writeHead(500);
        res.end(String(error));
        return;
      }
    }
    const pathname = new URL(req.url, "http://localhost").pathname;
    const filename = path.join(
      root,
      pathname === "/newstyleparrucchiere"
        ? "newstyleparrucchiere.html"
        : pathname === "/"
          ? "index.html"
          : pathname,
    );
    if (
      !filename.startsWith(root + "/") ||
      !fs.existsSync(filename) ||
      !fs.statSync(filename).isFile()
    ) {
      res.writeHead(404);
      return res.end();
    }
    res.setHeader(
      "Content-Type",
      {
        ".js": "application/javascript",
        ".css": "text/css",
        ".html": "text/html",
        ".json": "application/json",
      }[path.extname(filename)] || "application/octet-stream",
    );
    fs.createReadStream(filename).pipe(res);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 390,
      height: 844,
      isMobile: false,
      deviceScaleFactor: 1,
    });
    await page.emulateTimezone("America/New_York");
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const base = `http://127.0.0.1:${server.address().port}`;
    const click = async (text) => {
      await page.waitForFunction(
        (text) =>
          [...document.querySelectorAll("button")].some(
            (b) => b.textContent.trim() === text && !b.disabled,
          ),
        {},
        text,
      );
      await page.evaluate(
        (text) =>
          [...document.querySelectorAll("button")]
            .find((b) => b.textContent.trim() === text)
            .click(),
        text,
      );
    };
    await page.goto(base + "/newstyleparrucchiere", {
      waitUntil: "networkidle0",
    });
    await page.waitForSelector("input[name=username]");
    assert.equal(await page.$(".site-header"), null);
    await page.type("input[name=username]", "admin");
    await page.type("input[name=password]", "test");
    await click("Accedi all’agenda");
    await page.waitForSelector(".ns-card");
    const cookie = (await page.cookies()).find(
      (c) => c.name === "newstyle_session",
    );
    assert.ok(cookie?.httpOnly);
    assert.equal(cookie.sameSite, "Strict");
    assert.equal(
      await page.evaluate(() => document.cookie.includes("newstyle_session")),
      false,
    );
    await click("Conferma");
    await page.waitForFunction(() =>
      document.body.textContent.includes("Prenotazione confermata"),
    );
    assert.equal(postCount, 1, "Lost response must not replay confirmation");
    await page.evaluate(() =>
      document.querySelectorAll(".ns-bottom button")[2].click(),
    );
    await page.waitForFunction(
      () => document.querySelectorAll(".ns-card").length === 1,
    );
    await click("Rifiuta");
    await page.waitForSelector("dialog[open]");
    await click("Annulla");
    assert.equal(bookings[1].status, "pending");
    await click("Rifiuta");
    await click("Rifiuta prenotazione");
    await page.waitForFunction(() =>
      document.body.textContent.includes("Nessun appuntamento da confermare."),
    );
    await page.evaluate(() =>
      document.querySelectorAll(".ns-bottom button")[1].click(),
    );
    await page.waitForSelector(".fc-listDay-view");
    await page.waitForSelector(".fc-event");
    assert.ok(
      await page.evaluate(() =>
        [...document.querySelectorAll(".fc-event")].some((el) =>
          el.textContent.includes("10:00"),
        ),
      ),
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    );
    assert.equal(await page.$$eval(".fc-event", (events) => events.length), 1);
    assert.equal(
      await page.$$eval(".fc-event", (events) =>
        events.some((e) =>
          /Luca Bianchi|Cliente annullato/.test(e.textContent),
        ),
      ),
      false,
    );
    assert.ok(
      await page.$eval(
        ".ns-calendar-appointment strong",
        (e) => parseFloat(getComputedStyle(e).fontSize) >= 20,
      ),
    );
    await page.screenshot({ path: "/tmp/newstyle-mobile.png", fullPage: true });
    pageSize = 1;
    await click("Storico richieste →");
    await page.waitForSelector(".ns-more button");
    await click("Carica altri appuntamenti");
    await page.waitForFunction(
      () => document.querySelectorAll(".ns-card").length === 2,
    );
    await click("Carica altri appuntamenti");
    await page.waitForFunction(
      () => document.querySelectorAll(".ns-card").length === 3,
    );
    await page.screenshot({
      path: "/tmp/newstyle-history.png",
      fullPage: true,
    });
    assert.ok(historyRequests.length);
    assert.ok(
      historyRequests.every(
        (q) =>
          !new URLSearchParams(q).has("from") &&
          !new URLSearchParams(q).has("to"),
      ),
    );
    pageSize = 100;
    await page.select("select", "rejected");
    await page.waitForFunction(
      () =>
        document.querySelectorAll(".ns-card").length === 1 &&
        document.querySelector(".ns-card").textContent.includes("Luca Bianchi"),
    );
    await page.select("select", "cancelled");
    await page.waitForFunction(
      () =>
        document.querySelectorAll(".ns-card").length === 1 &&
        document
          .querySelector(".ns-card")
          .textContent.includes("Cliente annullato"),
    );
    await click("← Torna al calendario");
    await page.waitForSelector(".fc-listDay-view");
    await click("Orari");
    await page.waitForSelector(".fc-timeGridDay-view");
    await page.waitForSelector(".fc-event");
    assert.equal(await page.$$eval(".fc-event", (events) => events.length), 1);
    bookings.push({
      ...bookings[0],
      uid: "test_overlap",
      attendeeName: "Cliente sovrapposto",
    });
    await click("Aggiorna");
    await page.waitForFunction(
      () => document.querySelectorAll(".fc-event").length === 2,
    );
    const clipped = await page.$$eval(".fc-timegrid-event", (events) =>
      events.some((e) => {
        const content = e.querySelector(".ns-calendar-compact");
        return (
          !content ||
          content.getBoundingClientRect().bottom >
            e.getBoundingClientRect().bottom + 1
        );
      }),
    );
    assert.equal(
      clipped,
      false,
      "15 minute appointments must fit all three text rows",
    );
    for (const width of [320, 434]) {
      await page.setViewport({ width, height: 844 });
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      );
      assert.ok(
        await page.$$eval(".fc-timegrid-event", (events) =>
          events.every((e) => {
            const content = e.querySelector(".ns-calendar-compact");
            return (
              content &&
              content.getBoundingClientRect().bottom <=
                e.getBoundingClientRect().bottom + 1
            );
          }),
        ),
      );
    }
    await page.$eval(".fc-timegrid-event", e => e.scrollIntoView({block:"center"}));
    await page.screenshot({
      path: "/tmp/newstyle-mobile-grid.png",
      fullPage: false,
    });

    await page.setViewport({ width: 1280, height: 900 });
    await page.waitForSelector(".fc-timeGridWeek-view");
    await click("Mese");
    await page.waitForSelector(".fc-dayGridMonth-view");
    await page.click(".fc-next-button");
    const monthTitle = await page.$eval(
      ".fc-toolbar-title",
      (el) => el.textContent,
    );
    await click("Storico richieste →");
    await page.waitForSelector(".ns-history-controls");
    await click("← Torna al calendario");
    await page.waitForSelector(".fc-dayGridMonth-view");
    assert.equal(
      await page.$eval(".fc-toolbar-title", (el) => el.textContent),
      monthTitle,
    );
    await page.reload({ waitUntil: "networkidle0" });
    await page.waitForSelector(".ns-card");
    bookings.push({
      ...bookings[0],
      uid: "test_uncertain",
      attendeeName: "Cliente da verificare",
      status: "pending",
    });
    await click("Aggiorna");
    await page.waitForFunction(
      () => document.querySelectorAll(".ns-card").length === 3,
    );
    const beforeUncertain = postCount;
    failNextWrite = true;
    await click("Conferma");
    await page.waitForFunction(() =>
      [...document.querySelectorAll("button")].some(
        (b) => b.textContent === "Verifica esito" && !b.disabled,
      ),
    );
    assert.equal(postCount, beforeUncertain + 1);
    assert.ok(
      await page.$$eval("button", (buttons) =>
        buttons
          .filter((b) => b.textContent === "Conferma")
          .every((b) => b.disabled),
      ),
    );
    detailUnavailable = false;
    await click("Verifica esito");
    await page.waitForFunction(() =>
      [...document.querySelectorAll("button")].some(
        (b) => b.textContent === "Conferma" && !b.disabled,
      ),
    );
    assert.equal(postCount, beforeUncertain + 1, "Verification must only read");
    await click("Conferma");
    await page.waitForFunction(
      () =>
        ![...document.querySelectorAll("button")].some(
          (b) => b.textContent === "Conferma",
        ),
    );
    assert.equal(postCount, beforeUncertain + 2);
    malformed = true;
    await click("Aggiorna");
    await page.waitForSelector(".ns-error");
    assert.ok(
      await page.$(".ns-card"),
      "A failed refresh must preserve the last verified appointments",
    );
    malformed = false;
    await click("Riprova");
    await page.waitForFunction(() => !document.querySelector(".ns-error"));
    await click("Esci");
    await page.waitForSelector("input[name=username]");
    assert.equal(
      await page.evaluate(
        async () => (await fetch("/api/newstyle/bookings")).status,
      ),
      401,
    );
    assert.equal(
      (await page.cookies()).some((c) => c.name === "newstyle_session"),
      false,
    );
    assert.deepEqual(errors, []);
    console.log(
      "NewStyle browser checks passed: real handlers/cookie, lost and uncertain writes, paginated history, month restoration, malformed responses, mobile overlap/15-minute layout, Rome timezone and logout.",
    );
  } finally {
    global.fetch = originalFetch;
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
