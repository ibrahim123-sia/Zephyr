import React from "react";
import HeroImg from "../../assets/hero-perfume.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-zephyr-noir">
      <div className="relative w-full h-[75vh] min-h-[520px] max-h-[800px]">
        <img
          src={HeroImg}
          alt="Zephyr Fragrance"
          className="w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zephyr-noir via-zephyr-noir/40 to-zephyr-noir/10" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-6 text-center">
          <span className="block text-zephyr-gold text-xs uppercase tracking-[0.3em] mb-6">
            The Signature Collection
          </span>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-zephyr-ivory mb-6 leading-tight">
            Fragrance, Considered
          </h1>
          <div className="zephyr-divider mb-8">
            <span className="zephyr-divider-mark"></span>
          </div>
          <p className="text-lg md:text-xl text-zephyr-ivory/70 mb-10 max-w-2xl mx-auto">
            Real oud, honest notes, no shortcuts. Discover a fragrance built
            around what you actually smell.
          </p>

          <Link
            to="/collections/all"
            className="inline-block border border-zephyr-gold text-zephyr-gold hover:bg-zephyr-gold hover:text-zephyr-noir px-8 py-3 rounded-sm font-medium uppercase text-sm tracking-widest transition-all duration-300"
          >
            Explore the Collection
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
