import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <nav className="footer-links" aria-label="Navigazione a piè di pagina">
        <Link to="/servizi">Servizi</Link>
        <Link to="/sviluppo-siti-web">Siti web</Link>
        <Link to="/webapp">Web app</Link>
        <Link to="/integrazione-ai">Integrazioni IA</Link>
        <Link to="/portfolio">Portfolio</Link>
        <Link to="/templates">Template</Link>
        <Link to="/chi-sono">Chi sono</Link>
        <Link to="/contatti">Contatti</Link>
      </nav>
      <p>Alessandro Scarimbolo · Bari, Italia · Da remoto e in presenza su accordo</p>
      <p>Realizzato da <b>Alessandro Scarimbolo</b> &copy; 2026 - Tutti i diritti riservati</p>
    </footer>
  );
}
