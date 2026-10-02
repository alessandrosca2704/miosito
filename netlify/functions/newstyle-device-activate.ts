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
  if (request.method !== "POST")
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
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
      httpMethod: "POST",
      path: "/api/newstyle/device/activate",
      headers,
      body: Buffer.concat(chunks).toString("utf8"),
    },
    false,
    true,
  );
  return new Response(result.body, { status: result.statusCode, headers: result.headers });
}