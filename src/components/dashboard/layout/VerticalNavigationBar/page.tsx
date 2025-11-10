import HoverMenuToggle from "./components/HoverMenuToggle";
import { getMenuItems } from "@/helpers/Manu";
import LogoBox from "../../LogoBox";
import SimplebarReactClient from "../../wrappers/SimplebarReactClient";
import AppMenu from "./components/AppMenu";

const page = () => {
  const menuItems = getMenuItems();
  return (
    <div className="main-nav" id="leftside-menu-container">
      <LogoBox />
      <HoverMenuToggle />
      <SimplebarReactClient className="scrollbar" data-simplebar>
        <AppMenu menuItems={menuItems} />
      </SimplebarReactClient>
    </div>
  );
};

export default page;
