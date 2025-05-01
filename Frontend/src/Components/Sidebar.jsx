import React from "react";
import {
  FaHome,
  FaChartBar,
  FaRobot,
  FaEnvelope,
  FaUserFriends,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "../Styles/Sidebar.css";
import logo from "../images/logo.png";
import { useAuth } from "./context";
import { FaTicket } from "react-icons/fa6";

const menuItems = [
  { to: "/dashboard", icon: <FaHome />, roles: ["admin", "user", "employee"] },
  { to: "/ContactCenter", icon: <FaEnvelope />, roles: ["admin", "user", "employee"] },
  { to: "/graph", icon: <FaChartBar />, roles: ["admin"] },
  { to: "/team", icon: <FaUserFriends />, roles: ["admin"] },
  { to: "/chatbot", icon: <FaRobot />, roles: ["admin","employee","user"] },
  { to: "/request", icon: <FaTicket />, roles: ["user"] },
  { to: "/update", icon: <FaCog />, roles: ["admin","user"] },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  const filteredMenu = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <ul className="sidebar-menu">
        {filteredMenu.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              {item.icon}
            </NavLink>
          </li>
        ))}
        <li>
          <button className="sidebar-link logout-button" onClick={logout}>
            <FaSignOutAlt />
          </button>
        </li>
      </ul>
      <div className="sidebar-profile">
        <img
          src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
          alt="User Profile"
          className="profile-icon"
        />
        <span>{user.name}</span>
      </div>
    </div>
  );
};

export default Sidebar;
