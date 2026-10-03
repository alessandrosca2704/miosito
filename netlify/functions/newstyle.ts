import { routeNewStyle } from "../../server/newstyle/router";

// Modern Functions initialize Blobs automatically, including strong reads.
// Login and activation remain exclusive to their rate-limited functions.
export default async function newstyle(
  request: Request,
  context: { ip: string },
): Promise<Response> {
  const url = new URL(request.url);
  const headers = Object.fromEntries(request.headers.entries());
  headers.host = url.host;
  headers["x-nf-client-connection-ip"] = context.ip || "unknown";
  const chunks: Uint8Array[] = [];
  const reader = request.method === "POST" ? request.body?.getReader() : null;
  let size = 0;
  if (reader) {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) {
        await reader.cancel();
        break;
      }
      chunks.push(value);
    }
  }
  const result = await routeNewStyle({
    httpMethod: request.method,
    path: url.pathname,
    headers,
    queryStringParameters: Object.fromEntries(url.searchParams.entries()),
    // Let the router return the size error with its normal CORS headers.
    body: size > 8192 ? " ".repeat(8193) : chunks.length ? Buffer.concat(chunks).toString("utf8") : null,
  });
  return new Response(result.statusCode === 204 ? null : result.body, {
    status: result.statusCode,
    headers: result.headers,
  });
}
