import { useState, type FormEvent } from "react";
import { activateDevice } from "./deviceApi";
import type { DeviceTokenStorage } from "./deviceTokenStorage";

export default function DeviceActivationScreen({
  storage,
  onActivated,
}: {
  storage?: DeviceTokenStorage;
  onActivated: () => void;
}) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await activateDevice(code, { storage });
      onActivated();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Attivazione non riuscita.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="ns-login">
      <p className="ns-eyebrow">NEWSTYLE PARRUCCHIERE</p>
      <h2>Attiva questo dispositivo</h2>
      <p>Inserisci il codice di attivazione fornito dal gestore.</p>
      {error && <p className="ns-error" role="alert">{error}</p>}
      <form onSubmit={submit}>
        <label>
          Codice di attivazione
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            autoComplete="one-time-code"
            maxLength={256}
            required
          />
        </label>
        <button disabled={busy} type="submit">
          {busy ? "Attivazione in corso…" : "Attiva dispositivo"}
        </button>
      </form>
    </main>
  );
}