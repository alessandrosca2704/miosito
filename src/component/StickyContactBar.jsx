import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../Css/StickyContactBar.css";

const MOBILE_QUERY = "(max-width: 640px)";

export default function StickyContactBar() {
  const phone = "+393661876647";
  const wa = "393661876647";
  const waText = encodeURIComponent(
    "Ciao! Ti scrivo dal sito e vorrei maggiori informazioni."
  );

  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const barRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => {
      const mobile = mq.matches;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };
    update();
    const handler = () => update();
    mq.addEventListener ? mq.addEventListener("change", handler) : mq.addListener(handler);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", handler) : mq.removeListener(handler);
    };
  }, []);

  useEffect(() => {
    if (!isMobile || !isOpen) return;
    const handleOutside = (event) => {
      if (barRef.current && !barRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [isMobile, isOpen]);

  return (
    <>
      <div
        ref={barRef}
        className={`stickybar ${isMobile && !isOpen ? "stickybar--hidden" : ""}`}
        role="contentinfo"
        aria-label="Contatti rapidi"
      >
        <div className="stickybar__inner">
          <Link to="/" className="stickybar__logo" aria-label="Torna alla home">
            AS
          </Link>
          <div className="stickybar__copy">
            <span className="stickybar__eyebrow">Disponibile ora</span>
            <p className="stickybar__title">Parliamo del tuo prossimo progetto.</p>
          </div>
          <div className="stickybar__actions">
            <div className="stickbar__icons">
            <a
              className="sb-btn ghost"
              href={`https://wa.me/${wa}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Apri WhatsApp"
              title="WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .21 5.29.21 11.85a11.7 11.7 0 0 0 1.58 5.93L0 24l6.4-1.67a11.94 11.94 0 0 0 5.67 1.45h.01c6.56 0 11.85-5.29 11.85-11.85 0-3.17-1.23-6.16-3.41-8.45ZM12.08 21.3h-.01a9.47 9.47 0 0 1-4.83-1.32l-.35-.21-3.79.99 1.01-3.69-.23-.38a9.45 9.45 0 0 1-1.45-5.06c0-5.23 4.26-9.48 9.49-9.48 2.54 0 4.92.99 6.71 2.78 1.79 1.79 2.77 4.17 2.77 6.71-.01 5.24-4.27 9.48-9.52 9.48Zm5.43-7.08c-.3-.15-1.79-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.23-.66.08-.3-.15-1.27-.47-2.42-1.5-.89-.8-1.49-1.78-1.67-2.08-.17-.3-.02-.47.13-.62.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.06 1.04-1.06 2.53s1.09 2.94 1.25 3.14c.15.2 2.14 3.27 5.17 4.59.72.31 1.27.49 1.71.63.72.23 1.38.2 1.9.12.58-.09 1.79-.73 2.04-1.44.25-.7.25-1.3.17-1.43-.08-.13-.28-.2-.58-.35Z" />
              </svg>
            </a>

            <a
              className="sb-btn ghost"
              href={`tel:${phone}`}
              aria-label="Chiama"
              title="Telefono"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.62 10.79a15.53 15.53 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
              </svg>
            </a>
            </div>
            <Link
              className="sb-btn primary"
              to="/contatti"
              aria-label="Vai alla pagina contatti"
              title="Contatti"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m12 4 1.41 1.41L8.83 10H20v2H8.83l4.58 4.59L12 18l-8-8 8-8Z" />
              </svg>
              <span>Richiedi preventivo</span>
            </Link>
          </div>
        </div>
      </div>

      {isMobile && !isOpen && (
        <button
          type="button"
          className="stickybar-toggle"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3a9 9 0 0 0-9 9c0 4 2.64 7.37 6.28 8.51.5.09.69-.22.69-.48 0-.24-.01-.87-.01-1.71-2.56.56-3.1-1.09-3.1-1.09-.45-1.14-1.11-1.45-1.11-1.45-.9-.62.07-.6.07-.6 1 .07 1.52 1.02 1.52 1.02.89 1.53 2.33 1.09 2.9.83.09-.64.35-1.09.63-1.34-2.04-.23-4.19-1.02-4.19-4.54 0-1 .36-1.81.95-2.45-.1-.23-.41-1.16.09-2.42 0 0 .77-.25 2.52.93a8.7 8.7 0 0 1 4.6 0c1.75-1.18 2.52-.93 2.52-.93.5 1.26.19 2.19.09 2.42.6.64.95 1.45.95 2.45 0 3.53-2.16 4.3-4.21 4.53.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .26.18.57.69.48A9 9 0 0 0 12 3Z" />
          </svg>
          <span>Contatti</span>
        </button>
      )}
    </>
  );
}
