import { routeNewStyle } from "../../server/newstyle/router";

// Include the default function URL, so direct calls cannot bypass the edge rule.
export const config = {
  path: ["/api/newstyle/auth/login", "/.netlify/functions/newstyle-login"],
  rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ["ip", "domain"] },
};

export default async function login(
  request: Request,
  context: { ip: string },
): Promise<Response> {
  const path = new URL(request.url).pathname.replace(/\/$/, "");
  if (!config.path.includes(path)) return new Response(null, { status: 404 });
  if (request.method !== "POST")
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
  // Bound the streamed body before buffering; never trust Content-Length alone.
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  if (reader) {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) {
        await reader.cancel();
        return new Response(
          JSON.stringify({ error: "Richiesta troppo grande." }),
          {
            status: 413,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
            },
          },
        );
      }
      chunks.push(value);
    }
  }
  const headers = Object.fromEntries(request.headers.entries());
  headers.host = new URL(request.url).host;
  // Do not accept a client-supplied IP header on this endpoint.
  headers["x-nf-client-connection-ip"] = context.ip || "local";
  const result = await routeNewStyle(
    {
      httpMethod: "POST",
      path: "/api/newstyle/auth/login",
      headers,
      body: Buffer.concat(chunks).toString("utf8"),
    },
    true,
  );
  return new Response(result.body, {
    status: result.statusCode,
    headers: result.headers,
  });
}
