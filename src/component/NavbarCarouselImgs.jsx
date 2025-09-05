import { useRef, useEffect, useState} from "react";
import { Link, useLocation } from "react-router-dom";
import "../Css/NavbarCarouselImgs.css";

const items = [
    
    { to: "/chi-sono", label: "Chi sono", img: "/images/nav/me.jpg" },
  { to: "/servizi", label: "Servizi", img: "/images/nav/servizi.jpg" },
  { to: "/iot", label: "Soluzioni IoT", img: "/images/nav/iot.jpg" },
  { to: "/web-app", label: "Web App", img: "/images/nav/webapp.jpg" },
  { to: "/portfolio", label: "Portfolio", img: "/images/nav/portfolio.jpg" },
  { to: "/blog", label: "Blog", img: "/images/nav/blog.jpg" },
  { to: "/contatti", label: "Contatti", img: "/images/nav/contact.jpg" },
    
];

export default function NavbarCarouselImgs(){
    const scrollerRef= useRef(null);
    const {pathname}= useLocation();
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);

    const updateArrows=()=>{
        const el=scrollerRef.current;
        if(!el) return;
        const max = el.scrollWidth- el.clientWidth-1;
        setCanLeft(el.scrollLeft>0);
        setCanRight(el.scrollLeft<max);
    };
    const scrollByAmount=(dir=1)=>{
        const el= scrollerRef.current;
        if(!el) return;
        const step= Math.max(160,Math.round(el.clientWidth*0.8));
        el.scrollBy({left:dir*step, behavior:"smooth"});
    };

    useEffect(()=>{
        const el= scrollerRef.current;
        if(!el) return;
        updateArrows();
        const onScroll=()=>updateArrows();
        el.addEventListener("scroll", onScroll,{passive:true});
        const ro = new ResizeObserver(updateArrows);
        ro.observe(el);
        return()=>{
            el.removeEventListener("scroll", onScroll);
            ro.disconnect();
        };
    }, []);
    //centra l'item attivo al cambio rotta
    useEffect(()=>{
        const el=scrollerRef.current;
        if(!el) return;
        const active= el.querySelector(".navcard.ative");
        if(active) active.scrollIntoView({inline : "center", block:"nearest", behavior:"smooth"});

    },[pathname]);
    return (
    <nav className="imgnav-wrap" aria-label="Navigazione principale">
      <button
        className="imgnav-arrow left"
        aria-label="Scorri a sinistra"
        onClick={() => scrollByAmount(-1)}
        disabled={!canLeft}
      >‹</button>

      <div className="imgnav-scroller" ref={scrollerRef}>
        <ul className="imgnav-list" role="list">
          {items.map((item) => {
            const active = pathname === item.to;
            return (
              <li className="imgnav-item" key={item.to}>
                <Link to={item.to} className={`navcard ${active ? "active" : ""}`} aria-label={item.label}>
                  <img
                    src={item.img}
                    alt={item.label}
                    loading="lazy"
                    className="navcard-img"
                  />
                  <span className="navcard-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        className="imgnav-arrow right"
        aria-label="Scorri a destra"
        onClick={() => scrollByAmount(1)}
        disabled={!canRight}
      >›</button>
    </nav>
  );
}

