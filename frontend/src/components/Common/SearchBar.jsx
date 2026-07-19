import React, { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFilters, fetchProductsByFilters } from "../../redux/slices/productSlice";

const SearchBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchProductsByFilters({ search: searchTerm }));
    navigate(`/collections/all?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleClear = () => setSearchTerm("");

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder="Search fragrances..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full py-2 pl-4 pr-16 text-sm bg-white border border-zephyr-sand rounded-sm focus:outline-none focus:ring-1 focus:ring-zephyr-gold focus:border-zephyr-gold transition-all text-zephyr-umber"
      />
      <button
        type="submit"
        className="absolute right-9 top-1/2 transform -translate-y-1/2 text-zephyr-umber/60 hover:text-zephyr-gold transition-colors duration-200"
        aria-label="Search"
      >
        <HiMagnifyingGlass className="h-4 w-4" />
      </button>
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zephyr-umber/40 hover:text-zephyr-umber transition-colors duration-200"
          aria-label="Clear search"
        >
          <HiMiniXMark className="h-4 w-4" />
        </button>
      )}
    </form>
  );
};

export default SearchBar;
