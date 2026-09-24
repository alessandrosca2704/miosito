import "../Css/Contatti.css";
import CalBooking from "../components/contact/CalBooking";

export default function Contatti() {
  const YOUR_EMAIL = "alessandro.scarimbolo2704@gmail.com";
  const YOUR_PHONE = "+39 3661876647";
  const YOUR_WHATSAPP = "393661876647";

  const waText = encodeURIComponent(
    "Ciao! Ti scrivo dal sito per un progetto IoT / web app."
  );

  return (
    <main className="contact secondary-page">
      <div className="secondary-container contact-layout">
        <header className="contact-booking reveal">
          <p className="secondary-kicker">Contatti</p>
          <h1>Parliamo del tuo progetto</h1>
          <p className="contact-intro">Hai un’idea per un sito o una web app, cerchi una consulenza iniziale o vuoi valutare una collaborazione? Prenota un incontro per parlarne insieme.</p>
          <CalBooking contactEmail={YOUR_EMAIL} />
        </header>

        {/* Colonna info */}
        <aside className="contact-info reveal delay-1" aria-labelledby="contact-details-heading">
          <h2 id="contact-details-heading">Oppure scrivimi</h2>
          <p>Preferisci un contatto diretto? Puoi raggiungermi anche qui.</p>

          <ul className="info-list">
            <li className="contact-email">
              <span className="icon">@</span>
              <a href={`mailto:${YOUR_EMAIL}`}>{YOUR_EMAIL}</a>
            </li>
            <li>
              <span className="icon"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.62 10.79a15.53 15.53 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
              </svg></span>
              <a href={`tel:${YOUR_PHONE.replace(/\s+/g, "")}`}>{YOUR_PHONE}</a>
            </li>
            <li>
              <span className="icon"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.5 0 .21 5.29.21 11.85a11.7 11.7 0 0 0 1.58 5.93L0 24l6.4-1.67a11.94 11.94 0 0 0 5.67 1.45h.01c6.56 0 11.85-5.29 11.85-11.85 0-3.17-1.23-6.16-3.41-8.45ZM12.08 21.3h-.01a9.47 9.47 0 0 1-4.83-1.32l-.35-.21-3.79.99 1.01-3.69-.23-.38a9.45 9.45 0 0 1-1.45-5.06c0-5.23 4.26-9.48 9.49-9.48 2.54 0 4.92.99 6.71 2.78 1.79 1.79 2.77 4.17 2.77 6.71-.01 5.24-4.27 9.48-9.52 9.48Zm5.43-7.08c-.3-.15-1.79-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.23-.66.08-.3-.15-1.27-.47-2.42-1.5-.89-.8-1.49-1.78-1.67-2.08-.17-.3-.02-.47.13-.62.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.06 1.04-1.06 2.53s1.09 2.94 1.25 3.14c.15.2 2.14 3.27 5.17 4.59.72.31 1.27.49 1.71.63.72.23 1.38.2 1.9.12.58-.09 1.79-.73 2.04-1.44.25-.7.25-1.3.17-1.43-.08-.13-.28-.2-.58-.35Z" />
              </svg></span>
              <a
                href={`https://wa.me/${YOUR_WHATSAPP}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </li>
          </ul>

          <div className="small">
            <p><strong>Disponibilità:</strong> Lun-Ven, 9:00-18:00</p>
            <p><strong>Base:</strong> Italia Bari - Remoto / On-site su accordo</p>
          </div>
        </aside>


      </div>
    </main>
  );
}
