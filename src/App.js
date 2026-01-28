import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './component/Header';
import Navbar from './component/Navbar';
import Main from './component/Main';
import Footer from './component/Footer';
import Home from './Pages/Home';
import Chisono from './Pages/Chisono';
import Contatti from './Pages/Contatti';
import Iot from './Pages/Iot';
import Portfolio from './Pages/Portfolio';
import Servizi from './Pages/Servizi';
import Webapp from './Pages/Web-app';
import StickyContactBar from './component/StickyContactBar';
import { useEffect, useCallback, useState } from 'react';
import ScrollToTop from './component/ScrollToTop';
import Templates from './Pages/Templates';
import ProServicesTemplate from './Pages/templates/ProServicesTemplate';
import CraftsmenTemplate from './Pages/templates/CraftsmenTemplate';
import NonProfitTemplate from './Pages/templates/NonProfitTemplate';
import SmeTemplate from './Pages/templates/SmeTemplate';
import RetailTemplate from './Pages/templates/RetailTemplate';
import ChatAssistant from './component/ChatAssistant';


function AnimInitOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    // aspetta il render della nuova pagina
    const id = requestAnimationFrame(() => {
      const els = document.querySelectorAll(".reveal"); // elementi della pagina corrente

      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target); // anima una volta
          }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });

      // (opzionale) se vuoi che rianimini ogni volta che entri nella pagina:
      els.forEach(el => {
        el.classList.remove("in"); // rimuovi eventuale stato precedente
        io.observe(el);
      });
    });

    return () => {
      cancelAnimationFrame(id);
      // l'IntersectionObserver viene garbage-collectato quando non ci sono riferimenti
      // (se vuoi essere pignolo, salva 'io' in una var esterna e fai io.disconnect() qui)
    };
  }, [pathname]);

  return null; // non renderizza nulla
}

function AppLayout({ isMobileContactOpen, handleMobileContactState }) {
  const { pathname } = useLocation();
  const hideOnTemplates = pathname.startsWith("/templates/")

  return (
    <>
      <ScrollToTop behavior="smooth" />
      <AnimInitOnRouteChange />
      <Header />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chi-sono" element={<Chisono />} />
          <Route path="/contatti" element={<Contatti />} />
          <Route path="/iot" element={<Iot />} />
          <Route path='/portfolio' element={<Portfolio />} />
          <Route path='/Servizi' element={<Servizi />} />
          <Route path='/webapp' element={<Webapp />} />
          <Route path='/templates' element={<Templates />} />
          <Route path='/templates/pro-services' element={<ProServicesTemplate />} />
          <Route path='/templates/craftsmen' element={<CraftsmenTemplate />} />
          <Route path='/templates/nonprofit' element={<NonProfitTemplate />} />
          <Route path='/templates/sme' element={<SmeTemplate />} />
          <Route path='/templates/retail' element={<RetailTemplate />} />
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
