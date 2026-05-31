import { Link } from "react-router-dom";
import "../Css/secondary-pages.css";
import { paths } from "../data/navigation";
import useDocumentMeta from "../hooks/useDocumentMeta";

const WEBAPP_META_TITLE = "Web App | Alessandro Scarimbolo";
const WEBAPP_META_DESCRIPTION =
  "Web app su misura per processi, dashboard, strumenti interni e integrazioni IA per PMI e professionisti.";

function Webapp() {
  useDocumentMeta(WEBAPP_META_TITLE, WEBAPP_META_DESCRIPTION);

  return (
    <main className="secondary-page">
      <header className="secondary-hero">
        <div className="secondary-container reveal">
          <p className="secondary-kicker">Web app</p>
          <h1>Strumenti web su misura per processi reali.</h1>
          <p>
            Progetto dashboard, applicazioni operative e interfacce personalizzate
            per trasformare flussi complessi in strumenti semplici da usare.
          </p>
          <div className="services-hero__actions">
            <Link to={paths.contact} className="btn">Richiedi una valutazione</Link>
            <Link to={paths.services} className="btn secondary">Scopri i servizi</Link>
          </div>
        </div>
      </header>
    </main>
  );
}

export default Webapp;
