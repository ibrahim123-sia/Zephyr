import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Product/FilterSidebar";
import SortOptions from "../components/Product/SortOptions";
import ProductGrid from "../components/Product/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <div className="flex flex-col lg:flex-row bg-zephyr-ivory min-h-screen">
      <button
        onClick={toggleSidebar}
        className="lg:hidden border border-zephyr-sand p-3 flex justify-center items-center text-zephyr-umber uppercase text-sm tracking-widest"
      >
        <FaFilter className="mr-2" />
        Filters
      </button>

      <div
        ref={sidebarRef}
        className={`
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 z-50 left-0 w-72 bg-zephyr-ivory overflow-y-auto transition-transform duration-300
          lg:static lg:translate-x-0 lg:flex-shrink-0 lg:w-80 p-4
        `}
      >
        <FilterSidebar />
      </div>

      <div className="flex-grow p-4 sm:p-8">
        <h2 className="font-display text-2xl text-zephyr-noir mb-4">All Fragrances</h2>
        <SortOptions />
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;
