import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../../styles/Layout.css";
import { getUserMenu } from "./Menus/UserMenu";

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const fullName = user ? `${user.name} ${user.lastName}` : "Guest";
  const role = user?.role || "user";
  const sidebarMenu = getUserMenu(role);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout Successfully");
    navigate("/login");
  };

  return (
    <div className="row">
      <div className="col-md-3 sidebar">
        <div className="logo">
          <h6>JOB PORTAL</h6>
        </div>
        <hr />
        <p className="text-center text-warning">Welcome: {fullName}</p>
        <hr />
        <div className="menu">
          {sidebarMenu.map((menu, index) => {
            const isActive = location.pathname === menu.path;
            return (
              <div key={index} className={`menu-item ${isActive ? "active" : ""}`}>
                <i className={menu.icon}></i>
                <Link to={menu.path}>{menu.name}</Link>
              </div>
            );
          })}
          <div className="menu-item" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <Link to="/login">Logout</Link>
          </div>
        </div>
      </div>

      <div className="col-md-9">{children}</div>
    </div>
  );
};

export default Layout;
