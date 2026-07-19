import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { FiMinus, FiPlus, FiLoader } from "react-icons/fi";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetail = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState("");
  const [selectedVolume, setSelectedVolume] = useState("");
  const [selectedConcentration, setSelectedConcentration] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "increment") setQuantity((prev) => prev + 1);
    if (action === "decrement" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!selectedVolume) {
      toast.error("Please select a volume");
      return;
    }
    if (!selectedConcentration) {
      toast.error("Please select a concentration");
      return;
    }

    setIsButtonDisabled(true);
    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        volume: selectedVolume,
        concentration: selectedConcentration,
        guestId,
        userId: user?._id,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Added to bag");
      })
      .catch((error) => {
        toast.error(error.message || "Failed to add to bag");
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <FiLoader className="animate-spin h-10 w-10 text-zephyr-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!selectedProduct) {
    return null;
  }

  const notesPyramid = [
    { label: "Top Notes", notes: selectedProduct.topNotes },
    { label: "Heart Notes", notes: selectedProduct.heartNotes },
    { label: "Base Notes", notes: selectedProduct.baseNotes },
  ].filter((tier) => tier.notes && tier.notes.length > 0);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-zephyr-ivory">
      <div className="bg-white rounded-sm border border-zephyr-sand overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-12">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-6">
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {selectedProduct.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(image.url)}
                  className={`flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border-2 transition-all ${
                    mainImage === image.url
                      ? "border-zephyr-gold"
                      : "border-transparent hover:border-zephyr-sand"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.altText || `Product thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            <div className="relative w-full">
              <div className="aspect-[4/5] bg-zephyr-sand/30 rounded-sm overflow-hidden flex items-center justify-center">
                <img
                  src={mainImage || selectedProduct.images?.[0]?.url}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-zephyr-gold mb-2">
                {selectedProduct.scentFamily}
              </p>
              <h1 className="font-display text-3xl md:text-4xl text-zephyr-noir mb-3">
                {selectedProduct.name}
              </h1>
              <div className="flex items-center gap-3">
                {selectedProduct.discountPrice && (
                  <span className="text-lg text-zephyr-umber/40 line-through">
                    Rs. {selectedProduct.price.toFixed(2)}
                  </span>
                )}
                <span className="text-2xl font-semibold text-zephyr-gold">
                  Rs. {(selectedProduct.discountPrice || selectedProduct.price).toFixed(2)}
                </span>
              </div>

              <p className="text-zephyr-umber/80 mt-6 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* Fragrance Notes Pyramid */}
            {notesPyramid.length > 0 && (
              <div className="mb-8 border-t border-b border-zephyr-sand py-6">
                <h3 className="text-sm font-medium text-zephyr-noir mb-4 uppercase tracking-widest">
                  Fragrance Notes
                </h3>
                <div className="space-y-3">
                  {notesPyramid.map((tier) => (
                    <div key={tier.label} className="flex gap-4">
                      <span className="text-xs text-zephyr-umber/50 uppercase tracking-wide w-24 flex-shrink-0 pt-0.5">
                        {tier.label}
                      </span>
                      <span className="text-sm text-zephyr-umber">
                        {tier.notes.join(", ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Concentration Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-zephyr-noir mb-3 uppercase tracking-widest">
                Concentration
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.concentration?.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedConcentration(option)}
                    className={`px-4 py-2 text-sm rounded-sm border transition-all ${
                      selectedConcentration === option
                        ? "bg-zephyr-noir text-zephyr-ivory border-zephyr-noir"
                        : "bg-white text-zephyr-umber border-zephyr-sand hover:border-zephyr-gold"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-zephyr-noir mb-3 uppercase tracking-widest">
                Volume
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.volumes?.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedVolume(option)}
                    className={`px-4 py-2 text-sm rounded-sm border transition-all ${
                      selectedVolume === option
                        ? "bg-zephyr-noir text-zephyr-ivory border-zephyr-noir"
                        : "bg-white text-zephyr-umber border-zephyr-sand hover:border-zephyr-gold"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-zephyr-noir mb-3 uppercase tracking-widest">
                Quantity
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange("decrement")}
                  disabled={quantity <= 1}
                  className="p-2 rounded-sm border border-zephyr-sand text-zephyr-umber hover:border-zephyr-gold disabled:opacity-50 transition-colors"
                >
                  <FiMinus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-medium text-zephyr-noir">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("increment")}
                  className="p-2 rounded-sm border border-zephyr-sand text-zephyr-umber hover:border-zephyr-gold transition-colors"
                >
                  <FiPlus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled || !selectedVolume || !selectedConcentration}
              className={`w-full py-4 px-6 rounded-sm font-medium uppercase tracking-widest transition-all ${
                isButtonDisabled
                  ? "bg-zephyr-umber/40 cursor-not-allowed text-zephyr-ivory"
                  : "bg-zephyr-noir hover:bg-zephyr-gold text-zephyr-ivory"
              } ${
                !selectedVolume || !selectedConcentration ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isButtonDisabled ? "Adding..." : "Add to Bag"}
            </button>

            <div className="mt-12 border-t border-zephyr-sand pt-8">
              <h3 className="text-xl font-display text-zephyr-noir mb-6">Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-zephyr-umber/50 mb-1">Brand</p>
                  <p className="text-zephyr-umber">{selectedProduct.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-zephyr-umber/50 mb-1">Scent Family</p>
                  <p className="text-zephyr-umber">{selectedProduct.scentFamily}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="border-t border-zephyr-sand px-8 py-12 bg-zephyr-ivory">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-2xl text-zephyr-noir mb-8">
              You May Also Like
            </h2>
            <ProductGrid products={similarProducts} loading={false} error={error} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
