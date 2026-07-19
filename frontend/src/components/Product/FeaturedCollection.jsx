import React from "react";
import { Link } from "react-router-dom";
import feature from "../../assets/featured.jpg";

const FeaturedCollection = () => {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center bg-white border border-zephyr-sand rounded-sm overflow-hidden">
        <div className="lg:w-1/2 p-8 md:p-12 lg:p-16 text-center lg:text-left">
          <span className="inline-block text-xs font-semibold text-zephyr-gold uppercase tracking-widest mb-3">
            Real Oud, Honest Notes
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-zephyr-noir mb-6 leading-tight">
            Fragrance Built to Last, Not Just to Impress
          </h2>
          <p className="text-lg text-zephyr-umber/80 mb-8 max-w-lg mx-auto lg:mx-0">
            Every bottle in our Signature range is composed with genuine oud,
            rare florals, and honest materials — disclosed down to the note.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to="/collections/all"
              className="bg-zephyr-noir hover:bg-zephyr-gold text-zephyr-ivory px-8 py-3 rounded-sm font-medium uppercase text-sm tracking-widest transition-all duration-300"
            >
              Shop Collection
            </Link>
            <Link
              to="/collections/all?category=Gift Set"
              className="border border-zephyr-sand hover:border-zephyr-gold text-zephyr-umber px-8 py-3 rounded-sm font-medium uppercase text-sm tracking-widest transition-all duration-300"
            >
              Gift Sets
            </Link>
          </div>
        </div>

        <div className="lg:w-1/2 h-full">
          <img
            src={feature}
            alt="Featured Zephyr fragrance"
            className="w-full h-full max-h-[500px] object-cover object-center"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
