import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { sideMenuItems } from "../data/navigation";
import "../Css/SideMenu.css";

export default function SideMenu() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState({});

  const groupWithActive = useMemo(() => {
    for (const it of sideMenuItems) {
      if (it.children && it.children.some((c) => c.to === pathname)) return it.to;
    }
    return null;
  }, [pathname]);

  useEffect(() => {
    if (groupWithActive) {
      setOpenGroups((g) => ({ ...g, [groupWithActive]: true }));
    }
  }, [groupWithActive]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const toggleGroup = (key) =>
    setOpenGroups((g) => ({ ...g, [key]: !g[key] }));

  const onOverlayClick = (e) => {
    if (e.target.classList.contains("sidemenu-overlay")) setOpen(false);
  };

  const drawer = (
    <div className={`sidemenu-overlay ${open ? "show" : ""}`} onMouseDown={onOverlayClick}>
      <aside className={`sidemenu-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="sidemenu-header">
          <div className="sidemenu-brand">
            <span className="sidemenu-brandmark" aria-hidden="true">AS</span>
            <span className="sidemenu-brandcopy">
              <span className="brand">Alessandro Scarimbolo</span>
              <span className="sidemenu-subtitle">Web app, IA e automazioni</span>
            </span>
          </div>

          <button className="close-btn" aria-label="Chiudi menu" onClick={() => setOpen(false)}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <nav className="sidemenu-nav" aria-label="Navigazione laterale">
          <ul className="menu-root">
            {sideMenuItems.map((it) => {
              const hasActiveChild = it.children?.some((c) => c.to === pathname);
              const active = pathname === it.to;

              if (!it.children) {
                return (
                  <li key={it.to}>
                    <Link className={`navlink ${active ? "active" : ""}`} to={it.to} onClick={() => setOpen(false)}>
                      {it.label}
                    </Link>
                  </li>
                );
              }

              const expanded = !!openGroups[it.to];

              return (
                <li key={it.to} className={`group ${hasActiveChild ? "contains-active" : ""}`}>
                  <div className="group-row">
                    <Link className={`navlink ${active ? "active" : ""}`} to={it.to} onClick={() => setOpen(false)}>
                      {it.label}
                    </Link>
                    <button
                      className="chevron"
                      aria-label={expanded ? "Comprimi sezione" : "Espandi sezione"}
                      aria-expanded={expanded}
                      onClick={() => toggleGroup(it.to)}
                    >
                      <span className="chevron__icon" aria-hidden="true" />
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
                            onClick={() => setOpen(false)}
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
          <span className="sidemenu-status" aria-hidden="true" />
          <small>Disponibile per nuovi progetti</small>
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <button className="hamburger" aria-expanded={open} onClick={() => setOpen(true)}>
        <span className="hamburger__icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="hamburger__label">Menu</span>
      </button>
      {createPortal(drawer, document.body)}
    </>
  );
}
