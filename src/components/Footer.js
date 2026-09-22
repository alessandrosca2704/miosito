import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <section className="footer-services" aria-labelledby="footer-services-heading">
        <div>
          <span className="footer-services__eyebrow">Dall’idea al progetto</span>
          <h2 id="footer-services-heading">Scopri cosa possiamo realizzare insieme.</h2>
          <p>Siti web, applicazioni su misura e integrazioni IA: trova il servizio adatto alla tua attività.</p>
        </div>
        <Link className="footer-services__button" to="/servizi">Esplora i miei servizi <span aria-hidden="true">↗</span></Link>
      </section>
      <p>Alessandro Scarimbolo · Bari, Italia · Da remoto e in presenza su accordo</p>
      <p>Realizzato da <b>Alessandro Scarimbolo</b> &copy; 2026 - Tutti i diritti riservati</p>
    </footer>
  );
}
