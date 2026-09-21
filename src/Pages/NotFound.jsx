import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="secondary-page">
      <header className="secondary-hero secondary-container">
        <p className="secondary-kicker">Errore 404</p>
        <h1>Pagina non trovata</h1>
        <p>Questo indirizzo non corrisponde a una pagina del sito.</p>
        <div className="services-hero__actions">
          <Link to="/servizi" className="btn">Esplora i servizi</Link>
          <Link to="/" className="btn secondary">Torna alla home</Link>
        </div>
      </header>
    </main>
  );
}
