import React from "react";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const Topbar = () => {
  return (
    <div className="bg-zephyr-noir text-zephyr-ivory">
      <div className="container mx-auto flex justify-between items-center px-4 py-2">
        <div className="hidden md:flex items-center space-x-4">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-zephyr-gold transition-colors duration-200" aria-label="Facebook">
            <TbBrandMeta className="h-4 w-4" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-zephyr-gold transition-colors duration-200" aria-label="Instagram">
            <IoLogoInstagram className="h-4 w-4" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-zephyr-gold transition-colors duration-200" aria-label="Twitter">
            <RiTwitterXLine className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="text-xs text-center flex-grow uppercase tracking-widest text-zephyr-ivory/70">
          Free shipping on orders over $75 · JazzCash & Cash on Delivery
        </div>

        <div className="text-xs hidden md:block">
          <a href="tel:+923000000000" className="hover:text-zephyr-gold transition-colors duration-200">
            +92 3XX XXXXXXX
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
