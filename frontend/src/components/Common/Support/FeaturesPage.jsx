import React from "react";
import { Link } from "react-router-dom";

const FeaturesPage = () => {
  const features = [
    {
      title: "Real Materials",
      description:
        "No shortcuts — genuine oud, sandalwood, and rare florals in every formulation, disclosed down to the note.",
    },
    {
      title: "Full Scent Pyramid",
      description:
        "Every product page lists top, heart, and base notes so you know exactly what you're buying before it arrives.",
    },
    {
      title: "Fast Delivery",
      description:
        "Reliable courier partners get most orders to your door within 2-3 business days across Pakistan.",
    },
    {
      title: "Easy Returns",
      description:
        "A straightforward 14-day return policy on unopened bottles — no runaround.",
    },
    {
      title: "Flexible Payment",
      description:
        "Pay by JazzCash mobile wallet or Cash on Delivery — whichever is easier for you.",
    },
    {
      title: "Responsive Support",
      description:
        "Real answers from a real team for order, sizing, or fragrance questions.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-zephyr-ivory">
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl md:text-5xl text-zephyr-noir mb-4">Why Choose Zephyr</h1>
        <div className="zephyr-divider mb-6">
          <span className="zephyr-divider-mark"></span>
        </div>
        <p className="text-lg text-zephyr-umber/80 max-w-2xl mx-auto">
          What sets our fragrance house apart from the rest.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-sm border border-zephyr-sand hover:border-zephyr-gold transition-all duration-300"
          >
            <h3 className="font-display text-xl text-zephyr-noir mb-4">{feature.title}</h3>
            <p className="text-zephyr-umber/80 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-zephyr-sand rounded-sm p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl text-zephyr-noir mb-6">Experience the Zephyr Difference</h2>
          <p className="text-zephyr-umber/80 mb-8 text-lg">
            A catalog built on scent quality first, with a checkout that respects
            how you actually want to shop.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/collections/all"
              className="bg-zephyr-noir text-zephyr-ivory hover:bg-zephyr-gold px-8 py-4 rounded-sm font-medium uppercase text-sm tracking-widest transition-all duration-200"
            >
              Shop Our Collections
            </Link>
            <Link
              to="/about"
              className="bg-white text-zephyr-umber px-8 py-4 rounded-sm font-medium border border-zephyr-sand hover:border-zephyr-gold uppercase text-sm tracking-widest transition-all duration-200"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
