import { BrowserRouter as Router, Navigate, Routes, Route, useLocation, StaticRouter } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './Pages/Home';
import Chisono from './Pages/Chisono';
import Contatti from './Pages/Contatti';
import Portfolio from './Pages/Portfolio';
import Servizi from './Pages/Servizi';
import Webapp from './Pages/Web-app';
import StickyContactBar from './components/StickyContactBar';
import { lazy, Suspense, useCallback, useState } from 'react';
import ScrollToTop from './components/ScrollToTop';
import Templates from './Pages/Templates';
import ProServicesTemplate from './Pages/templates/ProServicesTemplate';
import CraftsmenTemplate from './Pages/templates/CraftsmenTemplate';
import NonProfitTemplate from './Pages/templates/NonProfitTemplate';
import SmeTemplate from './Pages/templates/SmeTemplate';
import RetailTemplate from './Pages/templates/RetailTemplate';
import ChatAssistant from './components/ChatAssistant';
import NotFound from './Pages/NotFound';
import ServiceDetail from './Pages/ServiceDetail';
import useDocumentMeta from './hooks/useDocumentMeta';
import { paths } from './data/navigation';
import useScrollReveal from './hooks/useScrollReveal';

const PayrollCheckerPage = lazy(() => import('./features/bustapaga/PayrollCheckerPage'));



function RevealOnRouteChange() {
  const { pathname } = useLocation();
  useScrollReveal(null, pathname);

  return null;
}

function AppLayout({ isMobileContactOpen, handleMobileContactState, payrollPage }) {
  const { pathname } = useLocation();
  useDocumentMeta(pathname);
  const hideOnTemplates = pathname.startsWith("/templates/")

  return (
    <>
      <ScrollToTop behavior="smooth" />
      <RevealOnRouteChange />
      {!hideOnTemplates && <Header />}
      <Suspense fallback={<main className="secondary-container" aria-busy="true"><p>Caricamento dello strumento…</p></main>}>
      <Routes>
          <Route path={paths.home} element={<Home />} />
          <Route path={paths.about} element={<Chisono />} />
          <Route path={paths.contact} element={<Contatti />} />
          <Route path="/iot" element={<Navigate to={paths.services} replace />} />
          <Route path={paths.portfolio} element={<Portfolio />} />
          <Route path={paths.services} element={<Servizi />} />
          <Route path={paths.webapp} element={<Webapp />} />
          <Route path={paths.templates} element={<Templates />} />
          <Route path="/sviluppo-siti-web" element={<ServiceDetail service="websites" />} />
          <Route path="/integrazione-ai" element={<ServiceDetail service="ai" />} />
          <Route path="/web-app" element={<Navigate to={paths.webapp} replace />} />
          <Route path="/portfolio/webapp" element={<Navigate to={paths.webapp} replace />} />
          <Route path='/templates/pro-services' element={<ProServicesTemplate />} />
          <Route path='/templates/craftsmen' element={<CraftsmenTemplate />} />
          <Route path='/templates/nonprofit' element={<NonProfitTemplate />} />
          <Route path='/templates/sme' element={<SmeTemplate />} />
          <Route path='/templates/retail' element={<RetailTemplate />} />
          <Route path='/bustapaga' element={payrollPage || <PayrollCheckerPage />} />
          <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>

      {!hideOnTemplates && <ChatAssistant isSuppressed={isMobileContactOpen} />}
      {!hideOnTemplates && (
        <StickyContactBar onMobilePanelToggle={handleMobileContactState} />
      )}
      {!hideOnTemplates && <Footer />}
    </>
  );
}



function App({ location, payrollPage }) {
  const Routing = location !== undefined ? StaticRouter : Router;
  const [isMobileContactOpen, setIsMobileContactOpen] = useState(false);
  const handleMobileContactState = useCallback((isVisible) => {
    setIsMobileContactOpen(isVisible);
  }, []);

  return (
    <div>
      <Routing location={location}>
        <AppLayout
          payrollPage={payrollPage}
          isMobileContactOpen={isMobileContactOpen}
          handleMobileContactState={handleMobileContactState}
        />
      </Routing>
    </div>
  );
}
export default App;
