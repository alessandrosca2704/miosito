import { useState } from "react";
import "../Css/Contatti.css";

export default function Contatti() {
  const YOUR_EMAIL = "alessandro.scarimbolo2704@gmail.com";     // 🔁 Cambia qui
  const YOUR_PHONE = "+39 3661876647";             // 🔁 Cambia qui
  const YOUR_WHATSAPP = "393661876647";              // 🔁 Senza "+"

  const [data, setData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const onChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // validazione semplice
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    if (!data.name || !emailOk || !data.message) {
      setStatus({ type: "error", msg: "Compila tutti i campi correttamente." });
      return;
    }
    // costruisco mailto
    const subject = encodeURIComponent(`Richiesta da ${data.name}`);
    const body = encodeURIComponent(
      `Nome: ${data.name}\nEmail: ${data.email}\n\nMessaggio:\n${data.message}`
    );
    window.location.href = `mailto:${YOUR_EMAIL}?subject=${subject}&body=${body}`;
    setStatus({ type: "ok", msg: "Sto aprendo il client email…" });
  };

  const waText = encodeURIComponent(
    "Ciao! Ti scrivo dal sito per un progetto IoT / web app."
  );

  return (
    <section className="contact">
      <div className="container contact-grid">
        {/* Colonna info */}
        <aside className="contact-info reveal delay-1">
          <h1>Contatti</h1>
          <p>Raccontami il tuo progetto: ti rispondo il prima possibile.</p>

          <ul className="info-list" role="list">
            <li>
              <span className="icon">✉️</span>
              <a href={`mailto:${YOUR_EMAIL}`}>{YOUR_EMAIL}</a>
            </li>
            <li>
              <span className="icon">📞</span>
              <a href={`tel:${YOUR_PHONE.replace(/\s+/g, "")}`}>{YOUR_PHONE}</a>
            </li>
            <li>
              <span className="icon">💬</span>
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
            <p><strong>Disponibilità:</strong> Lun–Ven, 9:00–18:00</p>
            <p><strong>Base:</strong> Italia Bari — Remoto / On-site su accordo</p>
          </div>
        </aside>

        {/* Colonna form */}
        <div className="contact-form reveal delay-2">
          <h2>Scrivimi</h2>

          <form onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Il tuo nome"
                value={data.name}
                onChange={onChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="nome@azienda.it"
                value={data.email}
                onChange={onChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="message">Messaggio</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                placeholder="Parlami del progetto, obiettivi, tempi…"
                value={data.message}
                onChange={onChange}
                required
              />
            </div>

            {status && (
              <p className={`form-status ${status.type}`}>{status.msg}</p>
            )}

            <div className="actions">
              <button type="submit" className="btn">Invia</button>
              <a href="/files/CV-SITO.pdf" className="btn secondary">Scarica CV / PDF</a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
