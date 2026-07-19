import React, { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Product/GenderCollectionSection";
import NewArrivals from "../components/Product/NewArrivals";
import ProductDetails from "../components/Product/ProductDetail";
import ProductGrid from "../components/Product/ProductGrid";
import FeaturedCollection from "../components/Product/FeaturedCollection";
import FeaturesSection from "../components/Product/FeaturesSection";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchProductsByFilters } from "../redux/slices/productSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        limit: 8,
      })
    );

    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBestSeller();
  }, [dispatch]);

  return (
    <div className="bg-zephyr-ivory">
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      <div className="text-center py-4">
        <h2 className="font-display text-3xl text-zephyr-noir mb-4">Best Seller</h2>
      </div>
      {bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center text-zephyr-umber/60 pb-12">Loading best seller...</p>
      )}

      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl text-zephyr-noir">Women's Fragrances</h2>
        </div>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>

      <FeaturedCollection />
      <FeaturesSection />
    </div>
  );
};

export default Home;
