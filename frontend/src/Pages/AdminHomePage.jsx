import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts);
  const {
    orders,
    totalOrders,
    totalSales,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const statCard = "p-6 bg-white border border-zephyr-sand rounded-sm";

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="font-display text-3xl text-zephyr-noir mb-6">Admin Dashboard</h1>
      {productsLoading || ordersLoading ? (
        <p className="text-zephyr-umber/70">Loading...</p>
      ) : productsError ? (
        <p className="text-red-600">Error fetching products: {productsError}</p>
      ) : ordersError ? (
        <p className="text-red-600">Error fetching orders: {ordersError}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className={statCard}>
            <h2 className="text-sm uppercase tracking-widest text-zephyr-umber/60">Revenue</h2>
            <p className="text-2xl font-display text-zephyr-gold">Rs. {totalSales.toFixed(2)}</p>
          </div>

          <div className={statCard}>
            <h2 className="text-sm uppercase tracking-widest text-zephyr-umber/60">Total Orders</h2>
            <p className="text-2xl font-display text-zephyr-noir">{totalOrders}</p>
            <Link to="/admin/orders" className="text-zephyr-gold hover:underline text-sm">
              Manage Orders
            </Link>
          </div>

          <div className={statCard}>
            <h2 className="text-sm uppercase tracking-widest text-zephyr-umber/60">Total Products</h2>
            <p className="text-2xl font-display text-zephyr-noir">{products.length}</p>
            <Link to="/admin/products" className="text-zephyr-gold hover:underline text-sm">
              Manage Products
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="font-display text-2xl text-zephyr-noir mb-4">Recent Orders</h2>
        <div className="overflow-x-auto rounded-sm border border-zephyr-sand">
          <table className="min-w-full text-left text-zephyr-umber bg-white">
            <thead className="bg-zephyr-sand/40 text-xs uppercase text-zephyr-umber tracking-wide">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="border-b border-zephyr-sand hover:bg-zephyr-ivory">
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">{order.user?.name || order.userId || "N/A"}</td>
                    <td className="p-4">{order.totalPrice.toFixed(2)}</td>
                    <td className="p-4">{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-zephyr-umber/60">
                    No recent orders found
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

export default AdminHomePage;
