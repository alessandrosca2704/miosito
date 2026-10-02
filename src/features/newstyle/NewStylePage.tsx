import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { FormEvent } from "react";
import { ApiError, request } from "./api";
import { todayRange, day } from "./dates";
import { useBookings } from "./useBookings";
import { AppointmentCard, Dialog } from "./Appointment";
import { performBookingAction } from "./bookingActions";
import type { Booking, CalendarPosition } from "./types";
import "./newstyle.css";
const AgendaView = lazy(() => import("./AgendaView"));
export default function NewStylePage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const expire = useCallback(() => setAuthenticated(false), []);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const check = useCallback(async () => {
    setError("");
    try {
      setAuthenticated(
        (await request<{ authenticated: boolean }>("/auth/session"))
          .authenticated,
      );
    } catch {
      setError("Impossibile verificare l’accesso. Riprova.");
    }
  }, []);
  useEffect(() => {
    void check();
  }, [check]);
  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await request("/auth/login", {
        username: values.get("username"),
        password: values.get("password"),
      });
      setAuthenticated(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Accesso non riuscito.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="newstyle">
      <header className="ns-header">
        <div>
          <span className="ns-brand">NEWSTYLE</span>
          <h1>Agenda</h1>
        </div>
        {authenticated && (
          <button
            className="ns-secondary"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await request("/auth/logout", {});
                setAuthenticated(false);
                setError("");
              } catch {
                setError("Impossibile uscire. Riprova.");
              } finally {
                setBusy(false);
              }
            }}
          >
            Esci
          </button>
        )}
      </header>
      {error && (
        <div className="ns-error" role="alert">
          {error}
          {authenticated === null && <button onClick={check}>Riprova</button>}
        </div>
      )}
      {authenticated === null ? (
        <main className="ns-content" aria-busy="true">
          Verifica accesso…
        </main>
      ) : authenticated ? (
        <Dashboard expired={expire} />
      ) : (
        <main className="ns-login">
          <p className="ns-eyebrow">NEWSTYLE PARRUCCHIERE</p>
          <h2>
            La tua giornata,
            <br />
            in ordine.
          </h2>
          <p>Accedi per consultare l’agenda e confermare gli appuntamenti.</p>
          <form onSubmit={login}>
            <label>
              Nome utente
              <input
                name="username"
                autoComplete="username"
                required
                maxLength={100}
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>
            <button disabled={busy} type="submit">
              {busy ? "Accesso in corso…" : "Accedi all’agenda"}
            </button>
          </form>
          <p className="ns-muted">Area riservata</p>
        </main>
      )}
    </div>
  );
}
function Dashboard({ expired }: { expired: () => void }) {
  const [view, setView] = useState("today");
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width: 700px)").matches,
  );
  const [historyStatus, setHistoryStatus] = useState("");
  const [position, setPosition] = useState<CalendarPosition>();
  const [uncertain, setUncertain] = useState<{
    booking: Booking;
    action: "confirm" | "reject";
  } | null>(null);
  const mutation = useRef(false);
  const monthRange = useCallback(() => {
    const start = new Date();
    const from = new Date(start.getFullYear(), start.getMonth(), 1).toISOString();
    const to = new Date(start.getFullYear(), start.getMonth() + 1, 1).toISOString();
    return { from, to };
  }, []);
  const [range, setRange] = useState<{ from: string; to: string } | null>(() =>
    window.matchMedia("(max-width: 700px)").matches ? monthRange() : null,
  );
  const [today, setToday] = useState(todayRange);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [reject, setReject] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");
  // Keep today's range correct across midnight and after returning to the browser.
  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const update = () => {
      setMobile(media.matches);
      setToday((previous) => {
        const next = todayRange();
        return previous.from === next.from ? previous : next;
      });
    };
    update();
    const timer = window.setInterval(update, 30_000);
    media.addEventListener("change", update);
    window.addEventListener("focus", update);
    return () => {
      clearInterval(timer);
      media.removeEventListener("change", update);
      window.removeEventListener("focus", update);
    };
  }, []);
  useEffect(() => {
    if (mobile && !range) setRange(monthRange());
    if (mobile && view === "agenda" && (!range || range.from === today.from)) {
      setRange(monthRange());
    }
  }, [mobile, view, range, monthRange, today.from]);
  const onError = useCallback(
    (e: unknown) => {
      if (e instanceof ApiError && e.status === 401) expired();
    },
    [expired],
  );
  const agendaRange = mobile ? range ?? monthRange() : range;
  const query =
    view === "history"
      ? new URLSearchParams({
          status: "history",
          ...(historyStatus ? { historyStatus } : {}),
        }).toString()
      : view === "pending"
        ? "status=pending"
        : view === "agenda" && !agendaRange
          ? ""
          : new URLSearchParams(view === "today" ? today : agendaRange!).toString();
  const data = useBookings(query, onError);
  const rememberPosition = useCallback(
    (next: CalendarPosition) =>
      setPosition((previous) =>
        previous?.view === next.view && previous.date === next.date
          ? previous
          : next,
      ),
    [],
  );
  const changeRange = useCallback(
    (from: string, to: string) =>
      setRange((r) => (r?.from === from && r?.to === to ? r : { from, to })),
    [],
  );
  async function change(b: Booking, action: "confirm" | "reject") {
    if (mutation.current || uncertain) return;
    mutation.current = true;
    setBusy(true);
    setActionError("");
    setNotice("");
    try {
      const result = await performBookingAction(b.uid, action);
      setSelected(null);
      setReject(null);
      if (result.kind === "unverified") {
        setUncertain({ booking: b, action });
        setActionError(
          "Esito non ancora verificato. Controlla lo stato prima di riprovare.",
        );
      } else {
        data.update(b.uid, result.booking.status);
        if (result.kind === "different")
          setActionError(
            "L’appuntamento è stato aggiornato con uno stato diverso. Controlla l’agenda.",
          );
        else
          setNotice(
            action === "confirm"
              ? "Prenotazione confermata"
              : "Prenotazione rifiutata",
          );
      }
      data.refresh();
    } catch (e) {
      onError(e);
      setActionError(
        e instanceof Error ? e.message : "Si è verificato un errore. Riprova.",
      );
    } finally {
      setBusy(false);
      mutation.current = false;
    }
  }
  async function verifyOutcome() {
    if (!uncertain || mutation.current) return;
    mutation.current = true;
    setBusy(true);
    try {
      const { booking } = await request<{ booking: Booking }>(
        `/bookings/${encodeURIComponent(uncertain.booking.uid)}`,
      );
      data.update(booking.uid, booking.status);
      setActionError("");
      setNotice(
        booking.status === "pending"
          ? "L’appuntamento risulta ancora da confermare. Puoi scegliere nuovamente l’operazione."
          : booking.status === "accepted"
            ? "L’appuntamento risulta confermato."
            : "Lo stato dell’appuntamento è stato aggiornato.",
      );
      setUncertain(null);
      data.refresh();
    } catch (e) {
      onError(e);
      setActionError(
        "Impossibile verificare lo stato. Riprova la verifica tra poco.",
      );
    } finally {
      setBusy(false);
      mutation.current = false;
    }
  }
  const act = (b: Booking, action: "confirm" | "reject") =>
    action === "reject"
      ? (setSelected(null), setReject(b))
      : void change(b, action);
  const bookings = data.bookings.filter((b) =>
    view === "history"
      ? ["accepted", "rejected", "cancelled"].includes(b.status)
      : view === "pending"
        ? b.status === "pending"
        : !["cancelled", "rejected"].includes(b.status),
  );
  return (
    <>
      <main className="ns-content">
        <div className="ns-section-heading">
          <div>
            <p className="ns-eyebrow">LA TUA AGENDA</p>
            <h2>
              {view === "today"
                ? "Oggi"
                : view === "agenda"
                  ? "Agenda"
                  : view === "history"
                    ? "Storico richieste"
                    : "Da confermare"}
            </h2>
            {view === "today" && <p>{day(today.from)}</p>}
          </div>
          <button
            className="ns-secondary"
            disabled={data.loading || busy}
            onClick={data.refresh}
          >
            Aggiorna
          </button>
        </div>
        {view === "agenda" && (
          <button
            className="ns-history-button ns-secondary"
            onClick={() => setView("history")}
          >
            Storico richieste <span aria-hidden="true">→</span>
          </button>
        )}
        {view === "history" && (
          <section className="ns-history-controls" aria-label="Filtri storico">
            <button className="ns-secondary" onClick={() => setView("agenda")}>
              ← Torna al calendario
            </button>
            <p>
              Tutte le richieste confermate, rifiutate e annullate, anche fuori
              dal periodo del calendario. Date degli appuntamenti dalla più
              recente.
            </p>
            <label>
              Mostra richieste
              <select
                value={historyStatus}
                onChange={(e) => setHistoryStatus(e.target.value)}
              >
                <option value="">Tutte</option>
                <option value="accepted">Confermate</option>
                <option value="rejected">Rifiutate</option>
                <option value="cancelled">Annullate</option>
              </select>
            </label>
          </section>
        )}
        {uncertain && (
          <section className="ns-error" aria-label="Verifica appuntamento">
            <p>
              Verifica l’esito per {uncertain.booking.attendeeName} prima di
              eseguire altre modifiche.
            </p>
            <button disabled={busy} onClick={verifyOutcome}>
              {busy ? "Verifica in corso…" : "Verifica esito"}
            </button>
          </section>
        )}
        {notice && (
          <p className="ns-success" role="status">
            {notice}
          </p>
        )}
        {actionError && (
          <p className="ns-error" role="alert">
            {actionError}
          </p>
        )}
        {data.error && (
          <div className="ns-error" role="alert">
            {data.error}
            <button onClick={data.refresh}>Riprova</button>
          </div>
        )}
        {data.loading && <p role="status">Caricamento appuntamenti…</p>}
        {view === "agenda" ? (
          <div className="ns-calendar">
            <Suspense fallback={<p>Caricamento calendario…</p>}>
              <AgendaView
                position={position}
                remember={rememberPosition}
                bookings={bookings}
                range={changeRange}
                select={setSelected}
              />
            </Suspense>
          </div>
        ) : (
          <div className="ns-cards">
            {bookings.map((b) => (
              <AppointmentCard
                key={b.uid}
                booking={b}
                busy={busy || !!uncertain}
                act={act}
                detail={() => setSelected(b)}
              />
            ))}
          </div>
        )}
        {!data.loading && !data.error && !data.cursor && !bookings.length && (
          <div className="ns-empty">
            {view === "today"
              ? "Nessun appuntamento previsto per oggi."
              : view === "pending"
                ? "Nessun appuntamento da confermare."
                : view === "history"
                  ? "Nessuna richiesta nello storico per questo filtro."
                  : "Nessun appuntamento in questo periodo."}
          </div>
        )}
        {data.cursor && (
          <div className="ns-more">
            <p>Ci sono altri appuntamenti da visualizzare.</p>
            <button disabled={data.loading} onClick={data.more}>
              Carica altri appuntamenti
            </button>
          </div>
        )}
      </main>
      <nav className="ns-bottom" aria-label="Navigazione agenda">
        {[
          ["today", "⌂", "Oggi"],
          ["agenda", "▦", "Agenda"],
          ["pending", "◷", "Da confermare"],
        ].map(([id, icon, label]) => (
          <button
            key={id}
            aria-current={
              view === id || (view === "history" && id === "agenda")
                ? "page"
                : undefined
            }
            disabled={busy}
            onClick={() => {
              setView(id);
              if (mobile && id === "agenda") setRange(monthRange());
              setNotice("");
              setActionError("");
            }}
          >
            <span aria-hidden="true">{icon}</span>
            {label}
          </button>
        ))}
      </nav>
      {selected && (
        <Dialog
          label="Dettaglio appuntamento"
          close={() => {
            if (!busy) setSelected(null);
          }}
        >
          <AppointmentCard
            booking={selected}
            busy={busy || !!uncertain}
            act={act}
          />
          <p>Telefono: {selected.attendeePhone || "Non indicato"}</p>
          <p>Email: {selected.attendeeEmail || "Non indicata"}</p>
          {actionError && <p role="alert">{actionError}</p>}
        </Dialog>
      )}
      {reject && (
        <Dialog
          label="Rifiuta appuntamento"
          close={() => {
            if (!busy) setReject(null);
          }}
        >
          <h2>Rifiutare la prenotazione di {reject.attendeeName}?</h2>
          <p>L’appuntamento verrà rifiutato.</p>
          {actionError && <p role="alert">{actionError}</p>}
          <div className="ns-actions">
            <button
              className="ns-secondary"
              disabled={busy}
              onClick={() => setReject(null)}
            >
              Annulla
            </button>
            <button disabled={busy} onClick={() => change(reject, "reject")}>
              {busy ? "Attendi…" : "Rifiuta prenotazione"}
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
