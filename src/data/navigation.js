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

export const sideMenuItems = [
  navItems.home,
  navItems.about,
  navItems.contact,
  {
    ...navItems.services,
    children: [navItems.portfolio],
  },
];
