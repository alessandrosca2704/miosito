import { createHmac, timingSafeEqual, createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { HttpError } from "./errors";
const AGE = 7 * 24 * 60 * 60;
const NAME = "newstyle_session";
function config() {
  const {
    NEWSTYLE_ADMIN_USERNAME: username,
    NEWSTYLE_ADMIN_PASSWORD_HASH: hash,
    NEWSTYLE_SESSION_SECRET: secret,
  } = process.env;
  if (
    !username ||
    !hash ||
    !/^\$2[aby]\$\d\d\$/.test(hash) ||
    !secret ||
    secret.length < 32
  )
    throw new HttpError(503, "Accesso temporaneamente non disponibile.");
  return { username, hash, secret };
}
function sign(value: string) {
  return createHmac("sha256", config().secret)
    .update(value)
    .digest("base64url");
}
function equal(a: string, b: string) {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
function revision() {
  const c = config();
  return createHash("sha256")
    .update(c.username + c.hash)
    .digest("hex");
}
export async function credentials(username: string, password: string) {
  const c = config();
  const valid = await bcrypt.compare(password, c.hash);
  return equal(username, c.username) && valid;
}
export function session(cookie = "") {
  const token = cookie
    .split(";")
    .map((x) => x.trim())
    .find((x) => x.startsWith(NAME + "="))
    ?.slice(NAME.length + 1);
  if (!token || token.length > 2048) return false;
  try {
    const [payload, signature, extra] = token.split(".");
    if (extra || !signature || !equal(sign(payload), signature)) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return (
      data.rev === revision() &&
      Number.isInteger(data.exp) &&
      data.exp > Date.now() / 1000 &&
      data.exp <= Date.now() / 1000 + AGE
    );
  } catch {
    return false;
  }
}
export function sessionCookie(secure: boolean, clear = false) {
  const payload = Buffer.from(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + AGE,
      rev: clear ? "" : revision(),
    }),
  ).toString("base64url");
  return `${NAME}=${clear ? "" : payload + "." + sign(payload)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${clear ? 0 : AGE}${secure ? "; Secure" : ""}`;
}
// Immediate per-instance backstop; the login function also has Netlify edge rate limiting.
const attempts = new Map<
  string,
  { failed: number; active: number; until: number }
>();
export function beginLogin(ip: string): (success: boolean) => void {
  const now = Date.now();
  for (const [key, value] of attempts)
    if (value.until <= now && value.active === 0) attempts.delete(key);
  const key = createHash("sha256").update(ip).digest("hex");
  const entry = attempts.get(key) || {
    failed: 0,
    active: 0,
    until: now + 15 * 60_000,
  };
  if (
    entry.failed + entry.active >= 10 ||
    (!attempts.has(key) && attempts.size >= 5000)
  )
    throw new HttpError(
      429,
      "Troppi tentativi. Riprova tra qualche minuto.",
      "LOGIN_LIMIT",
      Math.max(1, Math.ceil((entry.until - now) / 1000)),
    );
  entry.active++;
  attempts.set(key, entry);
  let finished = false;
  return (success) => {
    if (finished) return;
    finished = true;
    entry.active--;
    if (success) entry.failed = 0;
    else entry.failed++;
    if (entry.failed === 0 && entry.active === 0) attempts.delete(key);
  };
}
