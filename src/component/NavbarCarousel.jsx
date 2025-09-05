import { useRef, useEffect, useState} from "react";
import { Link, useLocation } from "react-router-dom";
import "../Css/NavbarCarousel.css";

const items = [
    
    {to:"/chi-sono", label:"Chi sono"},
    {to:"/contatti", label:"Contatti"},
    {to:"/iot", label:"Iot"},
    {to:"/Servizi", label:"Servizi"},
    {to:"/portfolio", label:"Portfolio"},
    {to:"/webapp", label:"Web-App"}
    
];

export default function NavbarCarousel(){
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
    const scrollBy=(px)=>{ scrollerRef.current?.scrollBy({left:px, behavior:"smooth"});};

    return(
        <nav className="nav-wrap" aria-label="Navigazione principale">
            <button 
            className="nav-arrow left" 
            aria-label="Scorri a sinistra"
            onClick={()=>scrollBy(-250)}>‹</button>
            <div className="nav-scroller" ref={scrollerRef}>
                <ul>
                    {items.map((item)=>{
                        const active= pathname===item.to;
                        return(<li className="nav-item" key={item.to}>
                            <Link to={item.to} className={`nav-link${active ? "active":""}`}>
                            {item.label}
                            </Link>
                        </li>);
                    })}
                </ul>
            </div>
            <button 
                className="nav-arrow right"
                aria-label="Scorri a destra"
                onClick={()=>scrollBy(250)}
            >
                 ›   
            </button>
        </nav>
    );
}

