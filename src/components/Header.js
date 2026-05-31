import { Link } from "react-router-dom";
import SideMenu from "./SideMenu";
import { paths } from "../data/navigation";

const AssistantIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M7.4 5.5h9.2a3 3 0 0 1 3 3v5.1a3 3 0 0 1-3 3h-3.3L9.2 20v-3.4H7.4a3 3 0 0 1-3-3V8.5a3 3 0 0 1 3-3Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
    <path
      d="m12 8.1.7 1.8 1.9.7-1.9.7-.7 1.8-.7-1.8-1.9-.7 1.9-.7.7-1.8Z"
      fill="currentColor"
    />
  </svg>
);

function Header(){
  const openAssistant = () => {
    window.dispatchEvent(new CustomEvent("open-chat-assistant"));
  };

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
            <span className="site-header__eyebrow">Web &amp; IA Engineer</span>
            <span className="site-header__name">Alessandro Scarimbolo</span>
          </div>
        </Link>
        <Link to={paths.services} className="site-header__cta">
          <span className="site-header__cta-full">Scopri i miei servizi</span>
          <span className="site-header__cta-short" aria-hidden="true">Servizi</span>
        </Link>
        <button
          type="button"
          className="site-header__assistant"
          aria-label="Apri assistente digitale IA"
          onClick={openAssistant}
        >
          <AssistantIcon />
        </button>
      </div>
    </header>
  );
}

export default Header;
