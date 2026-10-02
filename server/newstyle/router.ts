import { credentials, beginLogin, session, sessionCookie } from "./auth";
import { changeBooking, getBooking, listBookings } from "./calService";
import { activateDevice, authenticateDevice } from "./deviceAuth";
import { HttpError } from "./errors";

function allowedOrigins(): Set<string> {
  return new Set(
    [process.env.NEWSTYLE_ALLOWED_ORIGINS, process.env.NEWSTYLE_DEV_ALLOWED_ORIGINS]
      .filter(Boolean)
      .flatMap((value) => value!.split(","))
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

export type NewStyleEvent = {
  httpMethod: string;
  path: string;
  rawUrl?: string;
  headers: Record<string, string | undefined>;
  body: string | null;
  isBase64Encoded?: boolean;
  queryStringParameters?: Record<string, string | undefined> | null;
};
export async function routeNewStyle(
  event: NewStyleEvent,
  allowLogin = false,
  allowDeviceActivation = false,
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  const reply = (statusCode: number, body: object) => ({
    statusCode,
    headers,
    body: JSON.stringify(body),
  });
  try {
    const h = Object.fromEntries(
      Object.entries(event.headers).map(([k, v]) => [k.toLowerCase(), v]),
    );
    const path = event.path
      .replace(/^\/\.netlify\/functions\/newstyle/, "")
      .replace(/^\/api\/newstyle/, "")
      .replace(/\/$/, "");
    const post = event.httpMethod === "POST";
    const origin = h.origin;
    const host = h.host;
    let originHost = "";
    try {
      originHost = origin ? new URL(origin).host : "";
    } catch {
      /* Invalid origin remains forbidden. */
    }
    const sameOrigin = !!origin && !!host && originHost === host;
    const originAllowed =
      (!!origin && sameOrigin) || (!!origin && allowedOrigins().has(origin));
    if (origin && !originAllowed)
      throw new HttpError(403, "Richiesta non consentita.");
    if (origin && originAllowed) {
      headers["Access-Control-Allow-Origin"] = origin;
      headers.Vary = "Origin";
      headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type";
      headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
    }
    if (event.httpMethod === "OPTIONS") return reply(204, {});
    if (!["GET", "POST"].includes(event.httpMethod))
      return reply(405, { error: "Metodo non consentito." });
    if (post) {
      if (
        !origin ||
        !host ||
        !originAllowed ||
        (!sameOrigin && h["sec-fetch-site"] === "cross-site" && !allowedOrigins().has(origin))
      )
        throw new HttpError(403, "Richiesta non consentita.");
      if (!h["content-type"]?.toLowerCase().startsWith("application/json"))
        throw new HttpError(415, "Formato non valido.");
    }
    const secure = process.env.NETLIFY_DEV !== "true";
    if (path === "/auth/session" && !post)
      return reply(200, { authenticated: session(h.cookie) });
    if (path === "/auth/logout" && post) {
      headers["Set-Cookie"] = sessionCookie(secure, true);
      return reply(200, { authenticated: false });
    }
    const readBody = (): Record<string, unknown> => {
      if ((event.body?.length || 0) > 8192)
        throw new HttpError(413, "Richiesta troppo grande.");
      try {
        const b = JSON.parse(
          event.isBase64Encoded
            ? Buffer.from(event.body || "", "base64").toString()
            : event.body || "{}",
        );
        if (!b || typeof b !== "object" || Array.isArray(b)) throw Error();
        return b;
      } catch {
        throw new HttpError(400, "Dati non validi.");
      }
    };
    if (path === "/auth/login" && post) {
      if (!allowLogin) return reply(404, { error: "Operazione non trovata." });
      const { username, password } = readBody();
      if (
        typeof username !== "string" ||
        username.length > 100 ||
        typeof password !== "string" ||
        Buffer.byteLength(password) > 72 ||
        !password.length
      )
        throw new HttpError(400, "Inserisci nome utente e password validi.");
      const finish = beginLogin(h["x-nf-client-connection-ip"] || "local");
      let valid = false;
      try {
        valid = await credentials(username, password);
      } finally {
        finish(valid);
      }
      if (!valid)
        throw new HttpError(401, "Nome utente o password non corretti.");
      headers["Set-Cookie"] = sessionCookie(secure);
      return reply(200, { authenticated: true });
    }
    if (path === "/device/activate" && post) {
      if (!allowDeviceActivation)
        return reply(404, { error: "Operazione non trovata." });
      const { activationCode } = readBody();
      if (typeof activationCode !== "string")
        throw new HttpError(400, "Codice di attivazione non valido.");
      return reply(
        200,
        await activateDevice(activationCode, h["x-nf-client-connection-ip"] || "unknown"),
      );
    }
    if (h.authorization) await authenticateDevice(h.authorization);
    else if (!session(h.cookie))
      throw new HttpError(401, "Sessione scaduta. Accedi di nuovo.");
    if (path === "/bookings" && !post) {
      const params = new URLSearchParams();
      Object.entries(event.queryStringParameters || {}).forEach(([k, v]) => {
        if (v !== undefined) params.set(k, v);
      });
      return reply(200, await listBookings(params));
    }
    const detail = path.match(/^\/bookings\/([^/]+)$/);
    if (detail && !post)
      return reply(200, { booking: await getBooking(detail[1]) });
    const match = path.match(/^\/bookings\/([^/]+)\/(confirm|reject)$/);
    if (match && post) {
      const { reason } = readBody();
      if (
        reason !== undefined &&
        (typeof reason !== "string" || reason.length > 500)
      )
        throw new HttpError(400, "Motivo non valido.");
      return reply(
        200,
        await changeBooking(
          match[1],
          match[2] as "confirm" | "reject",
          reason as string | undefined,
        ),
      );
    }
    return reply(404, { error: "Operazione non trovata." });
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    if (status >= 500) console.error("[newstyle] request_failed", { status });
    if (status === 429)
      headers["Retry-After"] = String(
        error instanceof HttpError ? error.retryAfter || 60 : 60,
      );
    return reply(status, {
      ...(error instanceof HttpError && error.code ? { code: error.code } : {}),
      error:
        error instanceof HttpError
          ? error.message
          : "Si è verificato un errore. Riprova.",
    });
  }
}
