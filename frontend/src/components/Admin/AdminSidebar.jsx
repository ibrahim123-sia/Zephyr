import React from "react";
import { FaBoxOpen, FaClipboardList, FaSignOutAlt, FaStore, FaUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };

  const sidebarWrapper = "p-6 h-full";
  const navLinkActive = "bg-zephyr-gold text-zephyr-noir py-3 px-4 rounded-sm flex items-center space-x-2 uppercase text-sm tracking-widest";
  const navLinkInactive = "text-zephyr-ivory/70 hover:bg-zephyr-ivory/10 hover:text-zephyr-ivory py-3 px-4 rounded-sm flex items-center space-x-2 transition-colors duration-200 uppercase text-sm tracking-widest";
  const logoutButton = "w-full border border-zephyr-ivory/30 hover:border-zephyr-gold hover:text-zephyr-gold text-zephyr-ivory py-3 px-4 rounded-sm flex items-center justify-center space-x-2 transition-all duration-200 uppercase text-sm tracking-widest";

  return (
    <div className={sidebarWrapper}>
      <div className="mb-6">
        <Link to="/admin" className="font-display text-2xl text-zephyr-ivory tracking-wide">
          ZEPHYR
        </Link>
      </div>

      <h2 className="text-sm uppercase tracking-widest mb-6 text-zephyr-ivory/50">Admin Dashboard</h2>

      <nav className="flex flex-col space-y-3">
        <NavLink to="/admin/users" className={({ isActive }) => (isActive ? navLinkActive : navLinkInactive)}>
          <FaUser className="w-4 h-4" />
          <span>Users</span>
        </NavLink>

        <NavLink to="/admin/products" className={({ isActive }) => (isActive ? navLinkActive : navLinkInactive)}>
          <FaBoxOpen className="w-4 h-4" />
          <span>Products</span>
        </NavLink>

        <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? navLinkActive : navLinkInactive)}>
          <FaClipboardList className="w-4 h-4" />
          <span>Orders</span>
        </NavLink>

        <NavLink to="/" className={({ isActive }) => (isActive ? navLinkActive : navLinkInactive)}>
          <FaStore className="w-4 h-4" />
          <span>Shop</span>
        </NavLink>
      </nav>

      <div className="mt-8">
        <button onClick={handleLogout} className={logoutButton}>
          <FaSignOutAlt className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
