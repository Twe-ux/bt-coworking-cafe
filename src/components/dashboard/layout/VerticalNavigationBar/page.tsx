"use client";

import { getMenuItems } from "@/helpers/Manu";
import { MenuItemType } from "@/types/menu";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
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

  const [unreadCount, setUnreadCount] = useState(0);

  // Get filtered menu items based on user role
  const baseMenuItems = getMenuItems(userRole);

  // Fetch unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/contact-mails/unread-count");
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.count || 0);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    if (userRole === "dev" || userRole === "admin") {
      fetchUnreadCount();

      // Listen for custom event to refresh count
      const handleRefresh = () => fetchUnreadCount();
      window.addEventListener("refreshUnreadCount", handleRefresh);

      // Refresh every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);

      return () => {
        clearInterval(interval);
        window.removeEventListener("refreshUnreadCount", handleRefresh);
      };
    }
  }, [userRole]);

  // Update menu items with dynamic badge count
  const menuItems = useMemo(() => {
    return baseMenuItems.map((item) => {
      if (item.key === "contact-mails") {
        return {
          ...item,
          badge:
            unreadCount > 0
              ? {
                  text: unreadCount.toString(),
                  variant: "danger",
                }
              : undefined,
        };
      }
      return item;
    });
  }, [baseMenuItems, unreadCount]);

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
