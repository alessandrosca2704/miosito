import { Children, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../Css/SideMenu.css";
import Header from "./Header";

const items = [
 
    {to:"/", label:"Home"},
    {to:"/chi-sono", label:"Chi sono"},
    {to:"/contatti", label:"Contatti"},
    {to:"/Servizi", label:"Servizi" ,
        children:[
   
    {to:"/portfolio", label:"Portfolio"},
  
        ],
    },
    
];

export default function SideMenu() {
    const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const[openGroups, setOpenGroups]=useState({});
  const drawerRef = useRef(null);
  //apri automaticamente il gruppo che contiene la rotta attiva
    const groupWithActive= useMemo(()=>{
        for(const it of items){
            if(it.children && it.children.some(c=> c.to === pathname)) return it.to;
        }
        return null;
    }, [pathname]);
    
    useEffect(()=>{
        if(groupWithActive){
            setOpenGroups(g=>({...g,[groupWithActive]:true}));
        }
    },[groupWithActive]);

  // Chiudi con ESC
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
//chiudi il gruppo
  const toggleGroup=(key)=>
    setOpenGroups(g=>({...g, [key]: !g[key]}));

  const closeDrawer=()=>setOpen(false);
  // Chiudi quando cambia rotta
  useEffect(() => { setOpen(false); }, [pathname]);

  // Chiudi cliccando fuori
  const onOverlayClick = (e) => {
    if (e.target.classList.contains("sidemenu-overlay")) setOpen(false);
  };

return (
    <>
      <button className="hamburger" aria-expanded={open} onClick={() => setOpen(true)}>Menu</button>
     {/* <button className="bottons" aria-expanded={open} onClick={() => setOpen(true)}><Header/></button>*/}
      <div className={`sidemenu-overlay ${open ? "show" : ""}`} onMouseDown={(e)=> e.target.classList.contains("sidemenu-overlay") && closeDrawer()}>
        <aside className={`sidemenu-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
          <div className="sidemenu-header">
            <span className="brand">Il Mio Sito</span>
            <button className="close-btn" aria-label="Chiudi" onClick={closeDrawer}>×</button>
          </div>

          <nav className="sidemenu-nav" aria-label="Navigazione laterale">
            <ul className="menu-root">
              {items.map((it) => {
                const active = pathname === it.to;
                if (!it.children) {
                  return (
                    <li key={it.to}>
                      <Link className={`navlink ${active ? "active" : ""}`} to={it.to} onClick={closeDrawer}>
                        {it.label}
                      </Link>
                    </li>
                  );
                }
                const expanded = !!openGroups[it.to];
                return (
                  <li key={it.to} className="group">
                    <div className="group-row">
                      <Link className={`navlink ${active ? "active" : ""}`} to={it.to} onClick={closeDrawer}>
                        {it.label}
                      </Link>
                      <button
                        className="chevron"
                        aria-label={expanded ? "Comprimi" : "Espandi"}
                        aria-expanded={expanded}
                        onClick={() => toggleGroup(it.to)}
                      >
                        {expanded ? "▾" : "▸"}
                      </button>
                    </div>

                    <ul className={`submenu ${expanded ? "open" : ""}`}>
                      {it.children.map((ch) => {
                        const childActive = pathname === ch.to;
                        return (
                          <li key={ch.to}>
                            <Link
                              className={`subnavlink ${childActive ? "active" : ""}`}
                              to={ch.to}
                              onClick={closeDrawer}
                            >
                              {ch.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="sidemenu-footer">
            <small>© {new Date().getFullYear()}</small>
          </div>
        </aside>
      </div>
    </>
  );
}
