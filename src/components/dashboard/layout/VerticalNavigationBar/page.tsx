"use client";

import { getMenuItems } from "@/helpers/Manu";
import { useSession } from "next-auth/react";
import LogoBox from "../../LogoBox";
import SimplebarReactClient from "../../wrappers/SimplebarReactClient";
import AppMenu from "./components/AppMenu";
import HoverMenuToggle from "./components/HoverMenuToggle";

const VerticalNavigationBar = () => {
  const { data: session } = useSession();
  const userRole = session?.user?.role?.slug as
    | "dev"
    | "admin"
    | "staff"
    | "client"
    | undefined;

  // Get filtered menu items based on user role
  const menuItems = getMenuItems(userRole);

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

export default VerticalNavigationBar;
