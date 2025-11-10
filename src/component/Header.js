import { Link } from "react-router-dom";
import SideMenu from "./SideMenu";

function Header(){
  return(
    <header className="site-header">
      <div className="site-header__inner">
        <SideMenu/>
        <Link to="/" className="site-header__brand">
          <img
            src="/images/poi.jpg"
            alt="Alessandro Scarimbolo"
            className="site-header__avatar"
          />
          <div>
            <span className="site-header__eyebrow">Web &amp; IoT Engineer</span>
            <h1 className="site-header__name">Alessandro Scarimbolo</h1>
          </div>
        </Link>
        <Link to="/contatti" className="site-header__cta">Contattami</Link>
      </div>
    </header>
  );
}

export default Header;
