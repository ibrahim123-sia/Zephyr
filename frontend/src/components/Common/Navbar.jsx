import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);
  const toggleCartDrawer = () => setDrawerOpen(!drawerOpen);

  const navLink = "text-zephyr-umber hover:text-zephyr-gold text-xs uppercase tracking-widest transition-colors duration-200 border-b border-transparent hover:border-zephyr-gold pb-1";

  return (
    <>
      <nav className="bg-zephyr-ivory sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between py-5 px-6">
          <div className="flex-1">
            <button onClick={toggleNavDrawer} className="md:hidden text-zephyr-umber hover:text-zephyr-gold">
              <HiBars3BottomRight className="w-6 h-6" />
            </button>
          </div>

          <Link to="/" className="font-display text-2xl md:text-3xl text-zephyr-noir tracking-widest">
            ZEPHYR
          </Link>

          <div className="flex-1 flex items-center justify-end space-x-6">
            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className="hidden md:block border border-zephyr-gold text-zephyr-gold hover:bg-zephyr-gold hover:text-zephyr-noir px-3 py-1 rounded-sm text-xs uppercase tracking-widest transition-all duration-200"
              >
                Admin
              </Link>
            )}

            <Link to="/profile" className="text-zephyr-umber hover:text-zephyr-gold transition-colors duration-200">
              <HiOutlineUser className="w-5 h-5" />
            </Link>

            <button onClick={toggleCartDrawer} className="relative text-zephyr-umber hover:text-zephyr-gold transition-colors duration-200">
              <HiOutlineShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-zephyr-gold text-zephyr-noir text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="hidden md:flex justify-center space-x-10 pb-5">
          <Link to="/collections/all?gender=Men" className={navLink}>Men</Link>
          <Link to="/collections/all?gender=Women" className={navLink}>Women</Link>
          <Link to="/collections/all?gender=Unisex" className={navLink}>Unisex</Link>
          <Link to="/collections/all?category=Gift Set" className={navLink}>Gift Sets</Link>
        </div>

        <div className="hidden md:block max-w-md mx-auto pb-4 px-6">
          <SearchBar />
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile navigation drawer */}
      <div
        className={`fixed top-0 left-0 w-4/5 sm:w-2/3 md:w-1/3 h-full bg-zephyr-ivory shadow-xl
        transform transition-all duration-300 ease-in-out z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-zephyr-sand">
          <h3 className="font-display text-lg text-zephyr-noir">Menu</h3>
          <button onClick={toggleNavDrawer} className="text-zephyr-umber hover:text-zephyr-gold">
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <SearchBar />
          </div>

          {user && user.role === "admin" && (
            <Link
              to="/admin"
              onClick={toggleNavDrawer}
              className="block w-full bg-zephyr-noir text-zephyr-ivory px-4 py-2 rounded-sm text-sm uppercase tracking-widest mb-6 text-center"
            >
              Admin Dashboard
            </Link>
          )}

          <nav className="space-y-2">
            <Link to="/collections/all?gender=Men" onClick={toggleNavDrawer} className="block px-4 py-2 text-zephyr-umber hover:text-zephyr-gold hover:bg-zephyr-sand/30 rounded-sm transition-colors duration-200 uppercase text-sm tracking-widest">
              Men
            </Link>
            <Link to="/collections/all?gender=Women" onClick={toggleNavDrawer} className="block px-4 py-2 text-zephyr-umber hover:text-zephyr-gold hover:bg-zephyr-sand/30 rounded-sm transition-colors duration-200 uppercase text-sm tracking-widest">
              Women
            </Link>
            <Link to="/collections/all?gender=Unisex" onClick={toggleNavDrawer} className="block px-4 py-2 text-zephyr-umber hover:text-zephyr-gold hover:bg-zephyr-sand/30 rounded-sm transition-colors duration-200 uppercase text-sm tracking-widest">
              Unisex
            </Link>
            <Link to="/collections/all?category=Gift Set" onClick={toggleNavDrawer} className="block px-4 py-2 text-zephyr-umber hover:text-zephyr-gold hover:bg-zephyr-sand/30 rounded-sm transition-colors duration-200 uppercase text-sm tracking-widest">
              Gift Sets
            </Link>
          </nav>
        </div>
      </div>

      {navDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleNavDrawer} />
      )}
    </>
  );
};

export default Navbar;
