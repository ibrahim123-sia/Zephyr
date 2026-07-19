import React from "react";
import { Link } from "react-router-dom";
import { FiLoader, FiAlertCircle } from "react-icons/fi";

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px] py-12">
        <div className="flex flex-col items-center text-zephyr-gold">
          <FiLoader className="animate-spin h-10 w-10 mb-4" />
          <p className="text-lg text-zephyr-umber">Loading fragrances...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[300px] py-12">
        <div className="flex flex-col items-center text-red-600 max-w-md text-center">
          <FiAlertCircle className="h-10 w-10 mb-4" />
          <p className="text-lg mb-4">Error loading products: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-zephyr-noir hover:bg-zephyr-gold text-zephyr-ivory rounded-sm text-sm uppercase tracking-widest transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px] py-12">
        <div className="text-center">
          <p className="text-zephyr-umber/60 text-lg mb-4">No products found</p>
          <Link
            to="/collections/all"
            className="inline-block px-6 py-2 bg-zephyr-noir hover:bg-zephyr-gold text-zephyr-ivory rounded-sm text-sm uppercase tracking-widest transition-colors"
          >
            Browse All Fragrances
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {products.map((product) => (
        <Link
          key={product._id}
          to={`/product/${product._id}`}
          className="group block outline-none"
        >
          <div className="bg-zephyr-sand/40 rounded-sm overflow-hidden border border-transparent group-hover:border-zephyr-gold transition-colors duration-300">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={product.images?.[0]?.url}
                alt={product.images?.[0]?.altText || product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {product.discountPrice && (
                <div className="absolute top-3 left-3 bg-zephyr-noir text-zephyr-ivory text-xs uppercase tracking-wide px-2 py-1 rounded-sm">
                  Sale
                </div>
              )}
            </div>

            <div className="p-4 text-center">
              <h3 className="font-display text-sm uppercase tracking-wide text-zephyr-noir mb-1 line-clamp-1">
                {product.name}
              </h3>
              <p className="text-xs text-zephyr-umber/60 mb-2">
                {product.concentration?.[0]}
                {product.volumes?.[0] ? ` · ${product.volumes[0]}` : ""}
              </p>
              <div className="flex items-center justify-center gap-2">
                {product.discountPrice && (
                  <span className="text-xs text-zephyr-umber/40 line-through">
                    Rs. {product.price.toFixed(2)}
                  </span>
                )}
                <span className="text-zephyr-gold font-medium">
                  Rs. {(product.discountPrice || product.price).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
