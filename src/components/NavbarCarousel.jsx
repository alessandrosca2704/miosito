import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { carouselItems } from "../data/navigation";
import "../Css/NavbarCarousel.css";

export default function NavbarCarousel() {
  const scrollerRef = useRef(null);
  const { pathname } = useLocation();

  const scrollBy = (px) => {
    scrollerRef.current?.scrollBy({ left: px, behavior: "smooth" });
  };

  return (
    <nav className="nav-wrap" aria-label="Navigazione principale">
      <button
        className="nav-arrow left"
        aria-label="Scorri a sinistra"
        onClick={() => scrollBy(-250)}
      >
        {"\u2039"}
      </button>
      <div className="nav-scroller" ref={scrollerRef}>
        <ul>
          {carouselItems.map((item) => {
            const active = pathname === item.to;
            return (
              <li className="nav-item" key={item.to}>
                <Link to={item.to} className={`nav-link ${active ? "active" : ""}`}>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <button
        className="nav-arrow right"
        aria-label="Scorri a destra"
        onClick={() => scrollBy(250)}
      >
        {"\u203a"}
      </button>
    </nav>
  );
}
