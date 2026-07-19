import React from "react";
import { Link } from "react-router-dom";
import MenCollectionImage from "../../assets/mens-collection.jpg";
import WomenCollectionImage from "../../assets/womens-collection.jpg";

const GenderCollectionSection = () => {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="relative group overflow-hidden rounded-sm">
            <img
              src={WomenCollectionImage}
              alt="Women's Collection"
              className="w-full h-[500px] md:h-[600px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zephyr-noir/80 via-zephyr-noir/10 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="font-display text-2xl md:text-3xl text-zephyr-ivory mb-3">Women's Collection</h2>
              <Link
                to="/collections/all?gender=Women"
                className="inline-flex items-center text-zephyr-gold hover:text-zephyr-ivory font-medium uppercase text-sm tracking-widest transition-colors duration-200"
              >
                Shop Now →
              </Link>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-sm">
            <img
              src={MenCollectionImage}
              alt="Men's Collection"
              className="w-full h-[500px] md:h-[600px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zephyr-noir/80 via-zephyr-noir/10 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="font-display text-2xl md:text-3xl text-zephyr-ivory mb-3">Men's Collection</h2>
              <Link
                to="/collections/all?gender=Men"
                className="inline-flex items-center text-zephyr-gold hover:text-zephyr-ivory font-medium uppercase text-sm tracking-widest transition-colors duration-200"
              >
                Shop Now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
