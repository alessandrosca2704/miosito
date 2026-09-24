import { useEffect, useRef, useState } from "react";

export function getBookingConfig(value) {
  try {
    const url = new URL(value);
    const calLink = url.pathname.replace(/^\/+|\/+$/g, "");
    if (url.origin !== "https://cal.com" || url.username || url.password || calLink.split("/").length < 2) return null;
    return { calLink, url: `https://cal.com/${calLink}` };
  } catch {
    return null;
  }
}

const booking = getBookingConfig(process.env.REACT_APP_CALCOM_EVENT_URL);

export default function CalBooking({ contactEmail }) {
  const [status, setStatus] = useState("idle");
  const active = useRef(null);

  useEffect(() => () => {
    active.current?.dispose();
    active.current = null;
  }, []);

  const openBooking = async () => {
    if (active.current || !booking) return;
    setStatus("loading");
    const attempt = { dispose: () => clearTimeout(timer) };
    active.current = attempt;
    const finish = (nextStatus) => {
      if (active.current !== attempt) return;
      attempt.dispose();
      active.current = null;
      setStatus(nextStatus);
    };
    const timer = setTimeout(() => finish("error"), 15000);
    try {
      const { getCalApi } = await import("@calcom/embed-react");
      if (active.current !== attempt) return;
      const cal = await getCalApi({ namespace: "site-contact" });
      if (active.current !== attempt) return;
      const ready = () => finish("ready");
      const failed = () => finish("error");
      attempt.dispose = () => {
        clearTimeout(timer);
        cal("off", { action: "linkReady", callback: ready });
        cal("off", { action: "linkFailed", callback: failed });
      };
      cal("on", { action: "linkReady", callback: ready });
      cal("on", { action: "linkFailed", callback: failed });
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: { light: { "cal-brand": "#312e81" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
      cal("modal", {
        calLink: booking.calLink,
        config: { theme: "light", layout: "month_view" },
      });
    } catch {
      finish("error");
    }
  };

  if (!booking) {
    return <p className="booking-note">Vuoi organizzare una call? <a href={`mailto:${contactEmail}`}>Scrivimi per concordare un incontro.</a></p>;
  }

  return (
    <div className="cal-booking">
      <button type="button" className="btn" onClick={openBooking} disabled={status === "loading"} aria-haspopup="dialog">
        {status === "loading" ? "Apertura calendario…" : "Prenota una call"}
      </button>
      <p className="booking-note">Scegli giorno e orario, direttamente qui sul sito.</p>
      <p className="booking-status" role="status">
        {status === "error" && "Il calendario non risponde. Puoi aprire la pagina di prenotazione oppure contattarmi via email."}
      </p>
      {status === "error" && <a className="booking-fallback" href={booking.url} target="_blank" rel="noopener noreferrer">Apri la pagina di prenotazione (nuova scheda)</a>}
    </div>
  );
}
