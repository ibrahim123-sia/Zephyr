import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    category: "",
    gender: "",
    concentration: "",
    volume: [],
    scentFamily: [],
    brand: [],
    minPrice: 0,
    maxPrice: 15000,
  });
  const [priceRange, setPriceRange] = useState([0, 15000]);

  const categories = ["Perfume", "Attar", "Gift Set", "Body Mist"];
  const concentrations = ["Eau de Parfum", "Eau de Toilette", "Parfum", "Eau de Cologne"];
  const volumes = ["12ml", "30ml", "50ml", "100ml"];
  const scentFamilies = ["Floral", "Woody", "Oriental", "Citrus", "Chypre"];
  const brands = ["Zephyr"];
  const genders = ["Men", "Women", "Unisex"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilter({
      category: params.category || "",
      gender: params.gender || "",
      concentration: params.concentration || "",
      volume: params.volume ? params.volume.split(",") : [],
      scentFamily: params.scentFamily ? params.scentFamily.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 15000,
    });
    setPriceRange([0, params.maxPrice || 15000]);
  }, [searchParams]);

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    const newFilters = { ...filter };

    if (checked) {
      newFilters[name] = [...(newFilters[name] || []), value];
    } else {
      newFilters[name] = newFilters[name].filter((item) => item !== value);
    }

    setFilter(newFilters);
    updateURLParams(newFilters);
  };

  const handleSingleSelect = (name, value) => {
    const newFilters = { ...filter, [name]: value };
    setFilter(newFilters);
    updateURLParams(newFilters);
  };

  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPriceRange([0, newPrice]);
    const newFilters = { ...filter, minPrice: 0, maxPrice: newPrice };
    setFilter(newFilters);
    updateURLParams(newFilters);
  };

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key]) {
        params.append(key, newFilters[key]);
      }
    });
    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const FilterSection = ({ title, children }) => (
    <div className="mb-8 pb-6 border-b border-zephyr-sand last:border-0">
      <h4 className="text-xs font-semibold text-zephyr-umber uppercase tracking-widest mb-4">
        {title}
      </h4>
      {children}
    </div>
  );

  const radioOption = (selected) =>
    `flex items-center justify-center h-4 w-4 rounded-full border ${
      selected ? "border-zephyr-gold bg-zephyr-gold" : "border-zephyr-sand"
    }`;

  const chipOption = (selected) =>
    `px-3 py-1.5 text-xs rounded-sm border transition-all ${
      selected
        ? "bg-zephyr-noir text-zephyr-ivory border-zephyr-noir"
        : "bg-white text-zephyr-umber border-zephyr-sand hover:border-zephyr-gold"
    }`;

  return (
    <div className="p-6 bg-white rounded-sm border border-zephyr-sand">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-xl text-zephyr-noir">Filters</h3>
        <button
          onClick={() => {
            setFilter({
              category: "",
              gender: "",
              concentration: "",
              volume: [],
              scentFamily: [],
              brand: [],
              minPrice: 0,
              maxPrice: 500,
            });
            setPriceRange([0, 500]);
            navigate(window.location.pathname);
          }}
          className="text-xs uppercase tracking-widest text-zephyr-gold hover:text-zephyr-umber"
        >
          Clear all
        </button>
      </div>

      <FilterSection title="Category">
        <div className="space-y-3">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => handleSingleSelect("category", category)}
            >
              <div className={radioOption(filter.category === category)}>
                {filter.category === category && <div className="h-2 w-2 rounded-full bg-zephyr-noir"></div>}
              </div>
              <span className="text-sm text-zephyr-umber">{category}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Gender">
        <div className="space-y-3">
          {genders.map((gender) => (
            <label
              key={gender}
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => handleSingleSelect("gender", gender)}
            >
              <div className={radioOption(filter.gender === gender)}>
                {filter.gender === gender && <div className="h-2 w-2 rounded-full bg-zephyr-noir"></div>}
              </div>
              <span className="text-sm text-zephyr-umber">{gender}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Concentration">
        <div className="flex flex-wrap gap-2">
          {concentrations.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSingleSelect("concentration", option)}
              className={chipOption(filter.concentration === option)}
            >
              {option}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Volume">
        <div className="grid grid-cols-3 gap-2">
          {volumes.map((volume) => (
            <label key={volume} className="flex items-center justify-center cursor-pointer">
              <input
                type="checkbox"
                name="volume"
                value={volume}
                checked={filter.volume.includes(volume)}
                onChange={handleCheckboxChange}
                className="hidden"
              />
              <div className={`w-full py-2 text-center text-sm rounded-sm border ${
                filter.volume.includes(volume)
                  ? "border-zephyr-gold bg-zephyr-sand/40 text-zephyr-noir"
                  : "border-zephyr-sand hover:border-zephyr-gold text-zephyr-umber"
              }`}>
                {volume}
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Scent Family">
        <div className="space-y-3">
          {scentFamilies.map((scentFamily) => (
            <label key={scentFamily} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                name="scentFamily"
                value={scentFamily}
                checked={filter.scentFamily.includes(scentFamily)}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-zephyr-gold focus:ring-zephyr-gold border-zephyr-sand rounded"
              />
              <span className="text-sm text-zephyr-umber">{scentFamily}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Brand">
        <div className="space-y-3">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                name="brand"
                value={brand}
                checked={filter.brand.includes(brand)}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-zephyr-gold focus:ring-zephyr-gold border-zephyr-sand rounded"
              />
              <span className="text-sm text-zephyr-umber">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="15000"
            value={priceRange[1]}
            onChange={handlePriceChange}
            className="w-full h-1.5 bg-zephyr-sand rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-zephyr-gold"
          />
          <div className="flex justify-between mt-3 text-sm text-zephyr-umber/70">
            <span>Rs. 0</span>
            <span>Rs. {priceRange[1]}</span>
          </div>
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterSidebar;
