import { Link } from "react-router-dom";
import "../Css/StickyContactBar.css";

/**
 * Sostituisci:
 * - YOUR_EMAIL con la tua email
 * - +39XXXXXXXXXX con il tuo numero
 * - 39XXXXXXXXXX (senza +) nel link WhatsApp
 */
export default function StickyContactBar() {
  const email = "alessandro.scarimbolo2704@gmail.com";
  const phone = "+393661876647";         // tel: deve avere il +
  const wa = "393661876647";             // wa.me senza il + (prefisso paese incluso)

  // Messaggio precompilato per WhatsApp (URL encoded)
  const waText = encodeURIComponent(
    "Ciao! Ti scrivo dal sito: vorrei info su una soluzione IoT / web app."
  );

  return (
    <div className="stickybar" role="contentinfo" aria-label="Barra contatti rapidi">
      <div className="stickybar-track">
      <a
        className="sb-btn"
        href={`https://wa.me/${wa}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Apri WhatsApp"
        title="WhatsApp"
      >
        {/* WA icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .21 5.29.21 11.85a11.7 11.7 0 0 0 1.58 5.93L0 24l6.4-1.67a11.94 11.94 0 0 0 5.67 1.45h.01c6.56 0 11.85-5.29 11.85-11.85 0-3.17-1.23-6.16-3.41-8.45ZM12.08 21.3h-.01a9.47 9.47 0 0 1-4.83-1.32l-.35-.21-3.79.99 1.01-3.69-.23-.38a9.45 9.45 0 0 1-1.45-5.06c0-5.23 4.26-9.48 9.49-9.48 2.54 0 4.92.99 6.71 2.78 1.79 1.79 2.77 4.17 2.77 6.71-.01 5.24-4.27 9.48-9.52 9.48Zm5.43-7.08c-.3-.15-1.79-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.23-.66.08-.3-.15-1.27-.47-2.42-1.5-.89-.8-1.49-1.78-1.67-2.08-.17-.3-.02-.47.13-.62.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.06 1.04-1.06 2.53s1.09 2.94 1.25 3.14c.15.2 2.14 3.27 5.17 4.59.72.31 1.27.49 1.71.63.72.23 1.38.2 1.9.12.58-.09 1.79-.73 2.04-1.44.25-.7.25-1.3.17-1.43-.08-.13-.28-.2-.58-.35Z"/></svg>
        <span>WhatsApp</span>
      </a>

      <a
        className="sb-btn"
        href={`mailto:${email}`}
        aria-label="Invia email"
        title="Email"
      >
        {/* Mail icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"/></svg>
        <span>Email</span>
      </a>

      <a
        className="sb-btn"
        href={`tel:${phone}`}
        aria-label="Chiama"
        title="Telefono"
      >
        {/* Phone icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.53 15.53 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z"/></svg>
        <span>Chiama</span>
      </a>

      <Link
        className="sb-btn primary"
        to="/contatti"
        aria-label="Vai alla pagina contatti"
        title="Contatti"
      >
        {/* Arrow icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l1.41 1.41L8.83 10H20v2H8.83l4.58 4.59L12 18l-8-8 8-8Z"/></svg>
        <span>Richiedi preventivo</span>
      </Link>
      </div>
    </div>
  );
}
