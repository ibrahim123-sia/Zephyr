import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProductPage = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    volumes: [],
    concentration: [],
    topNotes: [],
    heartNotes: [],
    baseNotes: [],
    images: [],
    brand: "",
    scentFamily: "",
    category: "Perfume",
    collections: "",
    gender: "Unisex",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const formWrapper = "w-full max-w-5xl bg-white p-8 rounded-sm border border-zephyr-sand mx-auto";
  const inputClass = "w-full p-3 border border-zephyr-sand rounded-sm focus:outline-none focus:ring-1 focus:ring-zephyr-gold focus:border-zephyr-gold transition duration-200 bg-zephyr-ivory";
  const buttonPrimary = "w-full bg-zephyr-noir hover:bg-zephyr-gold text-zephyr-ivory p-3 rounded-sm font-medium uppercase text-sm tracking-widest transition duration-200";
  const labelClass = "block text-sm font-medium mb-2 text-zephyr-umber";
  const uploadArea = "border-2 border-dashed border-zephyr-sand rounded-sm p-6 text-center hover:border-zephyr-gold transition duration-200 cursor-pointer bg-zephyr-ivory";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleListChange = (field) => (e) => {
    setProductData((prev) => ({
      ...prev,
      [field]: e.target.value.split(",").map((item) => item.trim()),
    }));
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsSubmitting(true);
      const uploadedImages = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("image", files[i]);

        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
            },
          }
        );

        uploadedImages.push({ url: data.imageUrl, altText: "" });
      }

      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));

      alert(`${uploadedImages.length} image(s) uploaded successfully!`);
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Failed to upload images: " + err.message);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = (index) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("userToken");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        productData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product created successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Failed to create product:", err.response?.data || err.message);
      alert("Failed to create product: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zephyr-ivory py-12 px-4 sm:px-6 lg:px-8">
      <div className={formWrapper}>
        <h2 className="font-display text-2xl text-zephyr-noir mb-8">Add New Product</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={labelClass}>Product Name</label>
            <input type="text" name="name" value={productData.name} onChange={handleChange} className={inputClass} required />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea name="description" value={productData.description} onChange={handleChange} className={inputClass} rows={4} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Price ($)</label>
              <input type="number" name="price" value={productData.price} onChange={handleChange} className={inputClass} min="0" step="0.01" required />
            </div>

            <div>
              <label className={labelClass}>Count in Stock</label>
              <input type="number" name="countInStock" value={productData.countInStock} onChange={handleChange} className={inputClass} min="0" required />
            </div>

            <div>
              <label className={labelClass}>Brand</label>
              <input type="text" name="brand" value={productData.brand} onChange={handleChange} className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>SKU</label>
              <input type="text" name="sku" value={productData.sku} onChange={handleChange} className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <select name="category" value={productData.category} onChange={handleChange} className={inputClass}>
                <option value="Perfume">Perfume</option>
                <option value="Attar">Attar</option>
                <option value="Gift Set">Gift Set</option>
                <option value="Body Mist">Body Mist</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Gender</label>
              <select name="gender" value={productData.gender} onChange={handleChange} className={inputClass}>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Scent Family</label>
              <input type="text" name="scentFamily" value={productData.scentFamily} onChange={handleChange} className={inputClass} placeholder="e.g. Woody, Floral, Oriental" required />
            </div>

            <div>
              <label className={labelClass}>Collection</label>
              <input type="text" name="collections" value={productData.collections} onChange={handleChange} className={inputClass} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Volumes (comma-separated, e.g., 30ml, 50ml, 100ml)</label>
              <input type="text" value={productData.volumes.join(", ")} onChange={handleListChange("volumes")} className={inputClass} required />
            </div>

            <div>
              <label className={labelClass}>Concentration (comma-separated, e.g., Eau de Parfum, Parfum)</label>
              <input type="text" value={productData.concentration.join(", ")} onChange={handleListChange("concentration")} className={inputClass} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Top Notes</label>
              <input type="text" value={productData.topNotes.join(", ")} onChange={handleListChange("topNotes")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Heart Notes</label>
              <input type="text" value={productData.heartNotes.join(", ")} onChange={handleListChange("heartNotes")} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Base Notes</label>
              <input type="text" value={productData.baseNotes.join(", ")} onChange={handleListChange("baseNotes")} className={inputClass} />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelClass}>Product Images</label>
            <div className={uploadArea}>
              <label className="cursor-pointer">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <p className="text-sm text-zephyr-umber">
                    <span className="font-medium text-zephyr-gold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-zephyr-umber/60">PNG, JPG, WEBP up to 5MB</p>
                </div>
                <input type="file" onChange={handleImageUpload} multiple accept="image/*" className="hidden" disabled={isSubmitting} />
              </label>

              {uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="w-full bg-zephyr-sand rounded-full h-2.5">
                    <div className="bg-zephyr-gold h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <p className="text-sm text-center mt-1 text-zephyr-umber/70">Uploading: {uploadProgress}%</p>
                </div>
              )}
            </div>

            <div className="mt-4">
              <p className="font-medium mb-2 text-zephyr-umber">Preview Images:</p>
              <div className="flex flex-wrap gap-4">
                {productData.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img.url}
                      alt={img.altText || `Product image ${idx + 1}`}
                      className="w-24 h-24 object-cover rounded-sm border border-zephyr-sand"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {productData.images.length === 0 && (
                  <p className="text-zephyr-umber/50 italic text-sm">No images added yet</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={isSubmitting} className={`${buttonPrimary} ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}>
              {isSubmitting ? "Creating Product..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
