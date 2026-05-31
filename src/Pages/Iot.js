import { Link } from "react-router-dom";
import "../Css/secondary-pages.css";
import { paths } from "../data/navigation";
import useDocumentMeta from "../hooks/useDocumentMeta";

const IOT_META_TITLE = "Soluzioni IoT | Alessandro Scarimbolo";
const IOT_META_DESCRIPTION =
  "Prototipi e soluzioni IoT con ESP32, dashboard, raccolta dati e integrazioni per monitoraggio operativo.";

function Iot() {
  useDocumentMeta(IOT_META_TITLE, IOT_META_DESCRIPTION);

  return (
    <main className="secondary-page">
      <header className="secondary-hero">
        <div className="secondary-container reveal">
          <p className="secondary-kicker">Soluzioni IoT</p>
          <h1>Prototipi IoT concreti, dal sensore alla dashboard.</h1>
          <p>
            Realizzo proof of concept e strumenti di monitoraggio con microcontrollori,
            raccolta dati e dashboard leggibili per validare rapidamente un caso d'uso.
          </p>
          <div className="services-hero__actions">
            <Link to={paths.contact} className="btn">Parliamo del progetto</Link>
            <Link to={paths.portfolio} className="btn secondary">Vedi portfolio</Link>
          </div>
        </div>
      </header>
    </main>
  );
}

export default Iot;
