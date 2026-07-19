import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../redux/slices/orderSlice";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const contentWrapper = "w-full bg-white p-4 sm:p-8 rounded-sm shadow-sm border border-zephyr-sand";
  const headingPrimary = "font-display text-xl sm:text-2xl text-zephyr-noir mb-6 sm:mb-8";
  const statusBadge = "px-2 py-1 rounded-sm text-xs font-medium uppercase tracking-wide";

  const statusClasses = (status) =>
    status === "Delivered"
      ? "bg-green-100 text-green-700"
      : status === "Pending"
      ? "bg-zephyr-sand text-zephyr-umber"
      : status === "Processing"
      ? "bg-zephyr-sand text-zephyr-umber"
      : "bg-red-100 text-red-700";

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zephyr-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4 bg-red-50 rounded-sm max-w-md mx-auto my-8">
        Error: {error}
      </div>
    );
  }

  return (
    <div className={contentWrapper}>
      <h1 className={headingPrimary}>My Orders</h1>

      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              onClick={() => handleRowClick(order._id)}
              className="border border-zephyr-sand rounded-sm p-4 hover:border-zephyr-gold cursor-pointer transition-colors duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={order.orderItems[0]?.image}
                    alt={order.orderItems[0]?.name || "Order item"}
                    className="w-12 h-12 object-cover rounded-sm border border-zephyr-sand"
                  />
                  <div>
                    <p className="font-medium text-zephyr-umber text-sm">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-zephyr-umber/60">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`${statusBadge} ${statusClasses(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-zephyr-umber/60 text-xs">Items</p>
                  <p className="font-medium">{order.orderItems.length}</p>
                </div>
                <div>
                  <p className="text-zephyr-umber/60 text-xs">Total</p>
                  <p className="font-semibold text-zephyr-gold">Rs. {order.totalPrice?.toFixed(2)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-zephyr-umber/60 text-xs">Shipping</p>
                  <p className="text-sm">
                    {order.shippingAddress
                      ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 px-6 text-zephyr-umber/60">
            <div className="flex flex-col items-center justify-center">
              <svg className="w-16 h-16 text-zephyr-sand mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <p className="text-lg text-zephyr-umber mb-2">You have no orders yet</p>
              <button
                onClick={() => navigate("/collections/all")}
                className="bg-zephyr-noir text-zephyr-ivory hover:bg-zephyr-gold py-2 px-6 rounded-sm font-medium uppercase text-xs tracking-widest transition duration-200"
              >
                Start Shopping
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block relative overflow-hidden rounded-sm border border-zephyr-sand">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-zephyr-umber min-w-[800px]">
            <thead className="bg-zephyr-sand/50 text-xs uppercase font-semibold text-zephyr-umber tracking-wide">
              <tr>
                <th className="py-4 px-6">Image</th>
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Created</th>
                <th className="py-4 px-6">Shipping Address</th>
                <th className="py-4 px-6">Items</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 && orders.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="border-b border-zephyr-sand hover:bg-zephyr-ivory cursor-pointer transition-colors duration-200"
                >
                  <td className="py-4 px-6">
                    <img
                      src={order.orderItems[0]?.image}
                      alt={order.orderItems[0]?.name || "Order item"}
                      className="w-12 h-12 object-cover rounded-sm border border-zephyr-sand"
                    />
                  </td>
                  <td className="py-4 px-6 font-medium text-zephyr-umber">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="py-4 px-6 text-sm text-zephyr-umber/70">
                    {new Date(order.createdAt).toLocaleDateString()}
                    <br />
                    <span className="text-xs text-zephyr-umber/50">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-zephyr-umber/70">
                    {order.shippingAddress
                      ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                      : "N/A"}
                  </td>
                  <td className="py-4 px-6 text-center text-zephyr-umber font-medium">
                    {order.orderItems.length}
                  </td>
                  <td className="py-4 px-6 font-semibold text-zephyr-gold">
                    Rs. {order.totalPrice?.toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`${statusBadge} ${statusClasses(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {orders.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-zephyr-umber/60">
            Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
