import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails } from "../redux/slices/orderSlice";

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading) {
    return <p className="text-center py-20 text-zephyr-umber">Loading...</p>;
  }
  if (error) {
    return <p className="text-center py-20 text-red-600">Error: {error}</p>;
  }

  return (
    <div className="min-h-screen bg-zephyr-ivory py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl text-zephyr-noir mb-6">Order Details</h2>
        {!orderDetails ? (
          <p className="text-zephyr-umber/70">No Order Detail Found</p>
        ) : (
          <div className="p-4 sm:p-6 rounded-sm border border-zephyr-sand bg-white">
            <div className="flex flex-col sm:flex-row justify-between mb-8">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-zephyr-noir">
                  Order ID: #{orderDetails._id}
                </h3>
                <p className="text-zephyr-umber/60 text-sm">
                  {new Date(orderDetails.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0 gap-2">
                <span
                  className={`${
                    orderDetails.isPaid
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  } px-3 py-1 rounded-sm text-sm font-medium`}
                >
                  {orderDetails.isPaid ? "Approved" : "Pending"}
                </span>

                <span
                  className={`${
                    orderDetails.isDelivered
                      ? "bg-green-100 text-green-700"
                      : "bg-zephyr-sand text-zephyr-umber"
                  } px-3 py-1 rounded-sm text-sm font-medium`}
                >
                  {orderDetails.isDelivered ? "Delivered" : "Pending Delivery"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-semibold mb-2 text-zephyr-noir">Payment Info</h4>
                <p className="text-zephyr-umber/80">Payment Method: {orderDetails.paymentMethod}</p>
                <p className="text-zephyr-umber/80">Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 text-zephyr-noir">Shipping Info</h4>
                <p className="text-zephyr-umber/80">
                  Address: {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <h4 className="text-lg font-semibold mb-4 text-zephyr-noir">Products</h4>
              <table className="min-w-full text-zephyr-umber mb-4">
                <thead className="bg-zephyr-sand/40">
                  <tr>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Unit Price</th>
                    <th className="py-2 px-4 text-left">Quantity</th>
                    <th className="py-2 px-4 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.orderItems.map((item) => (
                    <tr key={item.productId} className="border-b border-zephyr-sand">
                      <td className="py-2 px-4 flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-sm mr-4"
                        />
                        <Link
                          to={`/product/${item.productId}`}
                          className="text-zephyr-gold hover:underline"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="py-2 px-4">Rs. {item.price}</td>
                      <td className="py-2 px-4">{item.quantity}</td>
                      <td className="py-2 px-4">Rs. {item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Link to="/my-orders" className="text-zephyr-gold hover:underline">
              Back To My Orders
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
