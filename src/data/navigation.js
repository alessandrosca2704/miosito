export const paths = {
  home: "/",
  about: "/chi-sono",
  contact: "/contatti",
  iot: "/iot",
  portfolio: "/portfolio",
  services: "/servizi",
  templates: "/templates",
  webapp: "/webapp",
};

const navItems = {
  home: { to: paths.home, label: "Home" },
  about: { to: paths.about, label: "Chi sono" },
  contact: { to: paths.contact, label: "Contatti" },
  iot: { to: paths.iot, label: "IoT" },
  portfolio: { to: paths.portfolio, label: "Portfolio" },
  services: { to: paths.services, label: "Servizi" },
  templates: { to: paths.templates, label: "Template" },
  webapp: { to: paths.webapp, label: "WebApp" },
};

export const navbarItems = [
  navItems.home,
  navItems.about,
  navItems.contact,
  navItems.iot,
  navItems.portfolio,
  navItems.services,
  navItems.webapp,
];

export const sideMenuItems = [
  navItems.home,
  navItems.about,
  navItems.contact,
  {
    ...navItems.services,
    children: [navItems.portfolio],
  },
];

export const carouselItems = [
  navItems.about,
  navItems.contact,
  navItems.iot,
  navItems.services,
  navItems.portfolio,
  { ...navItems.webapp, label: "Web-App" },
];

export const imageNavigationItems = [
  { ...navItems.about, img: "/images/nav/me.jpg" },
  { ...navItems.services, img: "/images/nav/servizi.jpg" },
  { ...navItems.iot, label: "Soluzioni IoT", img: "/images/nav/iot.jpg" },
  { ...navItems.webapp, label: "Web App", img: "/images/nav/webapp.jpg" },
  { ...navItems.portfolio, img: "/images/nav/portfolio.jpg" },
  { ...navItems.contact, img: "/images/nav/contact.jpg" },
];
