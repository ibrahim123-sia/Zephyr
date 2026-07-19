import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import axios from "axios";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
        setError(error.message || "Failed to load new arrivals");
        setNewArrivals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft + container.clientWidth < container.scrollWidth);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      updateScrollButtons();
      container.addEventListener("scroll", updateScrollButtons);
    }
    return () => {
      if (container) container.removeEventListener("scroll", updateScrollButtons);
    };
  }, [newArrivals]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollStart(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const walk = e.pageX - startX;
    scrollRef.current.scrollLeft = scrollStart - walk;
  };

  const handleMouseUpOrLeave = () => setIsDragging(false);

  const arrowBtn = (enabled) =>
    `p-2 rounded-full ${
      enabled ? "bg-white text-zephyr-gold border border-zephyr-sand hover:border-zephyr-gold" : "bg-zephyr-sand/40 text-zephyr-umber/30 cursor-not-allowed"
    } transition-colors duration-200`;

  if (loading || error || !newArrivals || newArrivals.length === 0) {
    return (
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl text-zephyr-noir mb-4">New Arrivals</h2>
          {loading && <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-zephyr-gold mx-auto"></div>}
          {error && <p className="text-red-600">Error: {error}</p>}
          {!loading && !error && <p className="text-zephyr-umber/60">No new arrivals available at the moment.</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 relative">
          <h2 className="font-display text-3xl md:text-4xl text-zephyr-noir mb-4">New Arrivals</h2>
          <p className="text-lg text-zephyr-umber/70 max-w-2xl mx-auto">
            The latest fragrances added to the collection.
          </p>

          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden md:flex space-x-2">
            <button onClick={() => scroll("left")} disabled={!canScrollLeft} className={arrowBtn(canScrollLeft)} aria-label="Scroll left">
              <FiChevronLeft className="text-xl" />
            </button>
            <button onClick={() => scroll("right")} disabled={!canScrollRight} className={arrowBtn(canScrollRight)} aria-label="Scroll right">
              <FiChevronRight className="text-xl" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className={`relative overflow-x-auto flex gap-6 pb-6 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          {newArrivals.map((product) => {
            const productId = product?._id;
            if (!productId) return null;
            const mainImage = product.images?.[0] || {};

            return (
              <div key={productId} className="flex-shrink-0 w-64 sm:w-72 relative group">
                <div className="relative overflow-hidden rounded-sm aspect-[4/5] bg-zephyr-sand/30">
                  {mainImage.url ? (
                    <img
                      src={mainImage.url}
                      alt={mainImage.altText || product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      draggable="false"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-zephyr-umber/40">No Image</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <Link to={`/product/${productId}`} className="block group-hover:text-zephyr-gold transition-colors duration-200">
                    <h3 className="font-display text-sm uppercase tracking-wide text-zephyr-noir">{product.name}</h3>
                    <p className="text-zephyr-gold mt-1">${product.price?.toFixed(2)}</p>
                  </Link>
                </div>
                <Link to={`/product/${productId}`} className="absolute inset-0 z-10" aria-label={`View ${product.name}`} />
              </div>
            );
          })}
        </div>

        <div className="flex justify-center space-x-4 mt-6 md:hidden">
          <button onClick={() => scroll("left")} disabled={!canScrollLeft} className={arrowBtn(canScrollLeft)} aria-label="Scroll left">
            <FiChevronLeft className="text-xl" />
          </button>
          <button onClick={() => scroll("right")} disabled={!canScrollRight} className={arrowBtn(canScrollRight)} aria-label="Scroll right">
            <FiChevronRight className="text-xl" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
