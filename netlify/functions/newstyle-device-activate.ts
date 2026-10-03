import { routeNewStyle } from "../../server/newstyle/router";

export const config = {
  path: [
    "/api/newstyle/device/activate",
    "/.netlify/functions/newstyle-device-activate",
  ],
  rateLimit: { windowLimit: 5, windowSize: 900, aggregateBy: ["ip", "domain"] },
};

export default async function activate(
  request: Request,
  context: { ip: string },
): Promise<Response> {
  const path = new URL(request.url).pathname.replace(/\/$/, "");
  if (!config.path.includes(path)) return new Response(null, { status: 404 });
  if (!['POST', 'OPTIONS'].includes(request.method))
    return new Response(null, {
      status: 405,
      headers: { Allow: "POST, OPTIONS" },
    });
  const reader = request.method === "POST" ? request.body?.getReader() : null;
  const chunks: Uint8Array[] = [];
  let size = 0;
  if (reader) {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) {
        await reader.cancel();
        return new Response(JSON.stringify({ error: "Richiesta troppo grande." }), {
          status: 413,
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        });
      }
      chunks.push(value);
    }
  }
  const headers = Object.fromEntries(request.headers.entries());
  headers.host = new URL(request.url).host;
  headers["x-nf-client-connection-ip"] = context.ip || "unknown";
  const result = await routeNewStyle(
    {
      httpMethod: request.method,
      path: "/api/newstyle/device/activate",
      headers,
      body: chunks.length ? Buffer.concat(chunks).toString("utf8") : null,
    },
    false,
    true,
  );
  return new Response(result.statusCode === 204 ? null : result.body, {
    status: result.statusCode,
    headers: result.headers,
  });
}