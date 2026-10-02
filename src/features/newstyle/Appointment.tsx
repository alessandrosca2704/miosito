import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { Booking } from "./types";
import { day, time, statusLabel } from "./dates";
export function Dialog({
  children,
  close,
  label,
}: {
  children: ReactNode;
  close: () => void;
  label: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    ref.current?.showModal();
    return () => {
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      className="ns-dialog"
      ref={ref}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <div className="newstyle">
        {children}
        <button className="ns-secondary" onClick={close}>
          Chiudi
        </button>
      </div>
    </dialog>
  );
}
export function AppointmentCard({
  booking: b,
  busy,
  act,
  detail,
}: {
  booking: Booking;
  busy: boolean;
  act: (b: Booking, action: "confirm" | "reject") => void;
  detail?: () => void;
}) {
  return (
    <article className="ns-card">
      <div className="ns-card-top">
        <strong className="ns-time">{time(b.start)}</strong>
        <span className={"ns-status ns-" + b.status}>
          {statusLabel(b.status)}
        </span>
      </div>
      <h3>{b.attendeeName}</h3>
      <p>
        {b.serviceName} ·{" "}
        {Math.round((Date.parse(b.end) - Date.parse(b.start)) / 60000)} min
      </p>
      <p className="ns-muted">
        {day(b.start)} · {time(b.start)} – {time(b.end)}
      </p>
      {detail && (
        <button className="ns-link" onClick={detail}>
          Vedi dettagli
        </button>
      )}
      {b.status === "pending" && (
        <div className="ns-actions">
          <button disabled={busy} onClick={() => act(b, "confirm")}>
            {busy ? "Attendi…" : "Conferma"}
          </button>
          <button
            className="ns-secondary"
            disabled={busy}
            onClick={() => act(b, "reject")}
          >
            Rifiuta
          </button>
        </div>
      )}
    </article>
  );
}
