import { getStore } from "@netlify/blobs";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { HttpError } from "./errors";

type DeviceRecord = {
  id: string;
  tokenHash: string;
  createdAt: string;
  lastUsedAt: string;
  revokedAt?: string;
};

const STORE_NAME = "newstyle-devices";
const activationAttempts = new Map<string, { count: number; until: number }>();

function store() {
  try {
    return getStore({ name: STORE_NAME, consistency: "strong" });
  } catch {
    throw new HttpError(503, "Attivazione temporaneamente non disponibile.");
  }
}

function activationHash() {
  const value = process.env.NEWSTYLE_ACTIVATION_CODE_HASH;
  if (!value || !/^\$2[aby]\$\d\d\$/.test(value))
    throw new HttpError(503, "Attivazione non configurata. Contatta il gestore.");
  return value;
}

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function sameHash(left: string, right: string) {
  const a = Buffer.from(left, "hex");
  const b = Buffer.from(right, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

function checkActivationRate(ip: string) {
  const now = Date.now();
  for (const [key, value] of activationAttempts) {
    if (value.until <= now) activationAttempts.delete(key);
  }
  const key = createHash("sha256").update(ip || "unknown").digest("hex");
  const entry = activationAttempts.get(key) || { count: 0, until: now + 15 * 60_000 };
  if (entry.count >= 5)
    throw new HttpError(
      429,
      "Troppi tentativi. Riprova più tardi.",
      "ACTIVATION_LIMIT",
      Math.ceil((entry.until - now) / 1000),
    );
  entry.count++;
  activationAttempts.set(key, entry);
}

export async function activateDevice(activationCode: string, ip: string) {
  if (!activationCode || activationCode.length > 256)
    throw new HttpError(401, "Codice di attivazione non valido.");
  checkActivationRate(ip);
  if (!(await bcrypt.compare(activationCode, activationHash())))
    throw new HttpError(401, "Codice di attivazione non valido.");

  const token = randomBytes(32).toString("base64url");
  const hash = tokenHash(token);
  const now = new Date().toISOString();
  const record: DeviceRecord = {
    id: randomBytes(16).toString("hex"),
    tokenHash: hash,
    createdAt: now,
    lastUsedAt: now,
  };
  await store().setJSON(`devices/${hash}`, record, { onlyIfNew: true });
  return { deviceToken: token };
}

export async function authenticateDevice(authorization = "") {
  const match = /^Bearer\s+([^\s]+)$/i.exec(authorization);
  if (!match || match[1].length > 512)
    throw new HttpError(401, "Dispositivo non attivato.", "DEVICE_UNAUTHORIZED");
  const hash = tokenHash(match[1]);
  const record = (await store().get(`devices/${hash}`, {
    type: "json",
    consistency: "strong",
  })) as DeviceRecord | null;
  if (
    !record ||
    typeof record.tokenHash !== "string" ||
    !sameHash(record.tokenHash, hash) ||
    record.revokedAt
  )
    throw new HttpError(401, "Dispositivo non attivato.", "DEVICE_UNAUTHORIZED");
  await store().setJSON(
    `devices/${hash}`,
    { ...record, lastUsedAt: new Date().toISOString() },
    { onlyIfNew: false },
  );
  return record;
}

export function deviceTokenHash(token: string) {
  return tokenHash(token);
}