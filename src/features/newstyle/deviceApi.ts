import { ApiError } from "./api";
import { isDeviceActivationResponse, isRecord, isText } from "./contracts";
import {
  memoryDeviceTokenStorage,
  type DeviceTokenStorage,
} from "./deviceTokenStorage";

const apiBaseUrl =
  process.env.VITE_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  "/api/newstyle";

export type DeviceApiOptions = {
  body?: object;
  signal?: AbortSignal;
  timeoutMs?: number;
  onUnauthorized?: () => void;
  storage?: DeviceTokenStorage;
};

function endpoint(path: string) {
  return `${apiBaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: DeviceApiOptions = {},
): Promise<T> {
  const storage = options.storage || memoryDeviceTokenStorage;
  const controller = new AbortController();
  const abort = () => controller.abort();
  options.signal?.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 30_000);
  try {
    const activation = path.split("?")[0] === "/device/activate";
    const token = activation ? null : await storage.getToken();
    const headers: Record<string, string> = {};
    if (options.body !== undefined) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;
    let response: Response;
    try {
      response = await fetch(endpoint(path), {
        method: options.body === undefined ? "GET" : "POST",
        headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        cache: "no-store",
        signal: controller.signal,
      });
    } catch {
      throw new ApiError(0, "Connessione non disponibile. Riprova.", "NETWORK");
    }
    const data: unknown = await response.json().catch(() => undefined);
    if (response.status === 401 && !activation) {
      await storage.clearToken();
      options.onUnauthorized?.();
      throw new ApiError(401, token
        ? "Token del dispositivo non valido o revocato. Attiva nuovamente il dispositivo."
        : "Token del dispositivo assente. Attiva il dispositivo.",
        token ? "DEVICE_UNAUTHORIZED" : "DEVICE_TOKEN_MISSING");
    }
    if (!response.ok) {
      throw new ApiError(
        response.status,
        isRecord(data) && isText(data.error, 500)
          ? data.error
          : response.status === 429
            ? "Troppi tentativi. Attendi un momento e riprova."
            : "Si è verificato un errore. Riprova.",
        isRecord(data) && isText(data.code, 80) ? data.code : undefined,
      );
    }
    return data as T;
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", abort);
  }
}

export async function activateDevice(
  activationCode: string,
  options: Omit<DeviceApiOptions, "body"> = {},
) {
  const result = await apiFetch<unknown>("/device/activate", {
    ...options,
    body: { activationCode },
  });
  if (!isDeviceActivationResponse(result))
    throw new ApiError(502, "Risposta di attivazione non valida.", "INVALID_RESPONSE");
  const storage = options.storage || memoryDeviceTokenStorage;
  await storage.setToken(result.deviceToken);
  return result;
}