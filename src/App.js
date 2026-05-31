import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './Pages/Home';
import Chisono from './Pages/Chisono';
import Contatti from './Pages/Contatti';
import Iot from './Pages/Iot';
import Portfolio from './Pages/Portfolio';
import Servizi from './Pages/Servizi';
import Webapp from './Pages/Web-app';
import StickyContactBar from './components/StickyContactBar';
import { useCallback, useState } from 'react';
import ScrollToTop from './components/ScrollToTop';
import Templates from './Pages/Templates';
import ProServicesTemplate from './Pages/templates/ProServicesTemplate';
import CraftsmenTemplate from './Pages/templates/CraftsmenTemplate';
import NonProfitTemplate from './Pages/templates/NonProfitTemplate';
import SmeTemplate from './Pages/templates/SmeTemplate';
import RetailTemplate from './Pages/templates/RetailTemplate';
import ChatAssistant from './components/ChatAssistant';
import PayrollCheckerPage from './features/bustapaga/PayrollCheckerPage';
import { paths } from './data/navigation';
import useScrollReveal from './hooks/useScrollReveal';


function RevealOnRouteChange() {
  const { pathname } = useLocation();
  useScrollReveal(null, pathname);

  return null;
}

function AppLayout({ isMobileContactOpen, handleMobileContactState }) {
  const { pathname } = useLocation();
  const hideOnTemplates = pathname.startsWith("/templates/")

  return (
    <>
      <ScrollToTop behavior="smooth" />
      <RevealOnRouteChange />
      <Header />
      <Routes>
          <Route path={paths.home} element={<Home />} />
          <Route path={paths.about} element={<Chisono />} />
          <Route path={paths.contact} element={<Contatti />} />
          <Route path={paths.iot} element={<Iot />} />
          <Route path={paths.portfolio} element={<Portfolio />} />
          <Route path={paths.services} element={<Servizi />} />
          <Route path={paths.webapp} element={<Webapp />} />
          <Route path={paths.templates} element={<Templates />} />
          <Route path="/Servizi" element={<Navigate to={paths.services} replace />} />
          <Route path="/web-app" element={<Navigate to={paths.webapp} replace />} />
          <Route path="/portfolio/webapp" element={<Navigate to={paths.webapp} replace />} />
          <Route path='/templates/pro-services' element={<ProServicesTemplate />} />
          <Route path='/templates/craftsmen' element={<CraftsmenTemplate />} />
          <Route path='/templates/nonprofit' element={<NonProfitTemplate />} />
          <Route path='/templates/sme' element={<SmeTemplate />} />
          <Route path='/templates/retail' element={<RetailTemplate />} />
          <Route path='/bustapaga' element={<PayrollCheckerPage />} />
      </Routes>

      {!hideOnTemplates && <ChatAssistant isSuppressed={isMobileContactOpen} />}
      {!hideOnTemplates && (
        <StickyContactBar onMobilePanelToggle={handleMobileContactState} />
      )}
      {!hideOnTemplates && <Footer />}
    </>
  );
}



function App() {
  const [isMobileContactOpen, setIsMobileContactOpen] = useState(false);
  const handleMobileContactState = useCallback((isVisible) => {
    setIsMobileContactOpen(isVisible);
  }, []);

  return (
    <div>
      <Router>
        <AppLayout
          isMobileContactOpen={isMobileContactOpen}
          handleMobileContactState={handleMobileContactState}
        />
      </Router>
    </div>
  );
}
export default App;
