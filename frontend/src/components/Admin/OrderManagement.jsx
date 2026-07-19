import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders, updateOrderStatus } from "../../redux/slices/adminOrderSlice";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [user, navigate, dispatch]);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
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
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-sm text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="font-display text-2xl text-zephyr-noir mb-6">Order Management</h2>

      <div className="overflow-x-auto rounded-sm border border-zephyr-sand bg-white">
        <table className="min-w-full divide-y divide-zephyr-sand">
          <thead className="bg-zephyr-noir">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zephyr-ivory uppercase tracking-wider">Order ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zephyr-ivory uppercase tracking-wider">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zephyr-ivory uppercase tracking-wider">Total Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zephyr-ivory uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zephyr-ivory uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zephyr-sand">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-zephyr-ivory transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zephyr-noir">
                    #{order._id.substring(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zephyr-umber/70">
                    {order.user?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zephyr-umber/70">
                    Rs. {order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="bg-zephyr-ivory border border-zephyr-sand text-zephyr-umber text-sm rounded-sm focus:ring-zephyr-gold focus:border-zephyr-gold block p-2"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleStatusChange(order._id, "Delivered")}
                      className="border border-zephyr-gold text-zephyr-gold hover:bg-zephyr-gold hover:text-zephyr-noir px-4 py-2 rounded-sm transition-all duration-200"
                    >
                      Mark as Delivered
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-zephyr-umber/60">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
