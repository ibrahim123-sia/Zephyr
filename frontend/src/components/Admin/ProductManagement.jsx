import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, fetchAdminProducts } from "../../redux/slices/adminProductSlice";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.adminProducts);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zephyr-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <p className="text-sm text-red-700">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display text-2xl text-zephyr-noir">Product Management</h2>
        <Link
          to="/admin/product/new"
          className="flex items-center bg-zephyr-noir hover:bg-zephyr-gold text-zephyr-ivory px-4 py-2 rounded-sm text-sm font-medium uppercase tracking-widest transition-all duration-200"
        >
          <FiPlus className="mr-2" />
          Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-sm border border-zephyr-sand overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zephyr-sand">
            <thead className="bg-zephyr-sand/40">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zephyr-umber uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zephyr-umber uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zephyr-umber uppercase tracking-wider">SKU</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zephyr-umber uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zephyr-sand">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-zephyr-ivory transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {product.images?.[0]?.url ? (
                            <img className="h-10 w-10 rounded-sm object-cover" src={product.images[0].url} alt={product.name} />
                          ) : (
                            <div className="h-10 w-10 rounded-sm bg-zephyr-sand flex items-center justify-center">
                              <span className="text-xs text-zephyr-umber/50">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-zephyr-noir">{product.name}</div>
                          <div className="text-sm text-zephyr-umber/60">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zephyr-umber/70">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zephyr-umber/70">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/product/${product._id}/edit`}
                          className="flex items-center text-zephyr-gold hover:text-zephyr-noir bg-zephyr-sand/40 px-3 py-1 rounded-sm transition-colors"
                        >
                          <FiEdit2 className="mr-1" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="flex items-center text-red-600 hover:text-red-800 bg-red-50 px-3 py-1 rounded-sm transition-colors"
                        >
                          <FiTrash2 className="mr-1" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-zephyr-umber/60">
                    No products found. Create your first product.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
