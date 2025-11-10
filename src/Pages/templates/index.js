import ProServicesTemplate from "./ProServicesTemplate";
import CraftsmenTemplate from "./CraftsmenTemplate";
import NonProfitTemplate from "./NonProfitTemplate";
import SmeTemplate from "./SmeTemplate";
import RetailTemplate from "./RetailTemplate";

export { ProServicesTemplate, CraftsmenTemplate, NonProfitTemplate, SmeTemplate, RetailTemplate };

export const templatePages = [
  { id: "pro-services", path: "/templates/pro-services", Component: ProServicesTemplate },
  { id: "craftsmen", path: "/templates/craftsmen", Component: CraftsmenTemplate },
  { id: "nonprofit", path: "/templates/nonprofit", Component: NonProfitTemplate },
  { id: "sme", path: "/templates/sme", Component: SmeTemplate },
  { id: "retail", path: "/templates/retail", Component: RetailTemplate }
];
