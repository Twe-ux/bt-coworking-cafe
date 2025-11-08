import React, { useState } from "react";
import { menuData } from "@/db/menuData";
import Link from "next/link";

const Navbar = ({ activeNavbar }) => {
    const [activeDropDownId, setActiveDropdownId] = useState(null);
    const handeDropDown = (index, isDropdown) => {
        if (isDropdown?.length) {
            setActiveDropdownId(activeDropDownId === index ? null : index)
        }
    }
    return (
        <nav
            className={`header__bottom_navbar ${activeNavbar ? "header__bottom_navbar-active" : ""} `}
        >
            <ul className="d-xl-flex menu__list">
                {menuData?.map((item, index) => (
                    <li key={index} className="dropdown__container">
                        <span
                            className="d-flex justify-content-between align-items-center gap-1"
                            onClick={() => handeDropDown(index, item.submenu)}
                        >
                            <Link href={item.link}>{item.title}</Link>
                            {item?.submenu && <i className="bi bi-chevron-down" />}
                        </span>
                        {item?.submenu && (
                            <ul
                                className={`dropdown__container_menu ${activeDropDownId === index ? "dropdown__container_menu-active" : ""} `}
                            >
                                {item?.submenu?.map((subItem, subIndex) => (
                                    <li key={subIndex}>
                                        <Link href={subItem.link}>{subItem.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;
