import ServicesHero from "../components/services/ServicesHero";
import ServicesProcess from "../components/services/ServicesProcess";
import ServicesRecentProjects from "../components/services/ServicesRecentProjects";
import useDocumentMeta from "../hooks/useDocumentMeta";
import "../Css/Portfolio.css";
import "../Css/Servizi.css";

const SERVICES_META_TITLE = "Servizi | Web App, IA e Siti Web per PMI";
const SERVICES_META_DESCRIPTION =
  "Servizi digitali su misura per PMI: sviluppo web, web app, integrazioni IA, prototipi rapidi e supporto post-lancio.";

function Servizi() {
  useDocumentMeta(SERVICES_META_TITLE, SERVICES_META_DESCRIPTION);

  return (
    <main className="services-page secondary-page">
      <ServicesHero />
      <ServicesProcess />
      <ServicesRecentProjects />
    </main>
  );
}

export default Servizi;
