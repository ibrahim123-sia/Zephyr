import React from "react";
import { Link } from "react-router-dom";

const AboutUsPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-zephyr-ivory">
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl md:text-5xl text-zephyr-noir mb-6">Our Story</h1>
        <div className="zephyr-divider mb-8">
          <span className="zephyr-divider-mark"></span>
        </div>
        <p className="text-lg text-zephyr-umber/80 max-w-2xl mx-auto">
          Zephyr began with a simple idea: fragrance should feel considered, not
          mass-produced. Every bottle we sell is chosen for its character, not
          just its name.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="font-display text-3xl text-zephyr-noir mb-6">Who We Are</h2>
          <p className="text-zephyr-umber/80 mb-6 leading-relaxed">
            Founded to bring a more considered approach to fragrance retail, Zephyr
            curates perfumes, attars, and gift sets that reward a closer look —
            complex compositions built from real oud, rare florals, and honest
            materials.
          </p>
          <p className="text-zephyr-umber/80 mb-6 leading-relaxed">
            Each listing carries its full scent pyramid — top, heart, and base
            notes — so you know exactly what you're choosing, not just a name on
            a bottle.
          </p>
          <Link
            to="/collections/all"
            className="inline-block bg-zephyr-noir text-zephyr-ivory hover:bg-zephyr-gold px-6 py-3 rounded-sm font-medium uppercase text-sm tracking-widest transition-all duration-200"
          >
            Explore the Collection
          </Link>
        </div>
        <div className="bg-zephyr-sand h-96 rounded-sm overflow-hidden">
          <img
            src="https://images.pexels.com/photos/8796322/pexels-photo-8796322.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Zephyr fragrance studio"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="bg-white p-8 rounded-sm border border-zephyr-sand">
          <h3 className="font-display text-xl text-zephyr-noir mb-4">Our Mission</h3>
          <p className="text-zephyr-umber/80 leading-relaxed">
            To make well-made fragrance approachable — clear notes, honest
            pricing, and a catalog built on scent quality first.
          </p>
        </div>
        <div className="bg-white p-8 rounded-sm border border-zephyr-sand">
          <h3 className="font-display text-xl text-zephyr-noir mb-4">Sourcing</h3>
          <p className="text-zephyr-umber/80 leading-relaxed">
            We work directly with fragrance houses to bring real oud, sandalwood,
            and rare florals into every formulation, not synthetic shortcuts.
          </p>
        </div>
        <div className="bg-white p-8 rounded-sm border border-zephyr-sand">
          <h3 className="font-display text-xl text-zephyr-noir mb-4">Customer First</h3>
          <p className="text-zephyr-umber/80 leading-relaxed">
            Straightforward returns, real support, and a checkout that respects
            how you actually want to pay — card, wallet, or cash on delivery.
          </p>
        </div>
      </div>

      <div className="bg-zephyr-noir rounded-sm p-10 text-center text-zephyr-ivory">
        <h2 className="font-display text-3xl mb-4">Ready to Find Your Signature Scent?</h2>
        <p className="text-zephyr-ivory/70 mb-8 max-w-2xl mx-auto">
          Browse the full collection and find a fragrance built around notes you
          actually recognize.
        </p>
        <Link
          to="/collections/all"
          className="inline-block bg-zephyr-gold text-zephyr-noir px-8 py-3 rounded-sm font-semibold uppercase text-sm tracking-widest hover:bg-zephyr-ivory transition-colors duration-200"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default AboutUsPage;
