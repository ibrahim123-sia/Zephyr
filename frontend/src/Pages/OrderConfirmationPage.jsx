import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [dispatch, checkout, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  const pageWrapper = "min-h-screen bg-zephyr-ivory py-12 px-4 sm:px-6 lg:px-8";
  const contentWrapper = "w-full max-w-4xl bg-white p-8 rounded-sm shadow-sm border border-zephyr-sand mx-auto";
  const headingPrimary = "font-display text-3xl sm:text-4xl text-center text-zephyr-noir mb-8";
  const headingSecondary = "text-xl font-semibold text-zephyr-noir mb-4";
  const textMuted = "text-zephyr-umber/70 text-sm";
  const successText = "text-zephyr-gold text-sm font-medium";

  return (
    <div className={pageWrapper}>
      <div className={contentWrapper}>
        <h1 className={headingPrimary}>Thank You For Your Order</h1>

        {checkout && (
          <div className="space-y-8">
            <div className="zephyr-divider">
              <span className="zephyr-divider-mark"></span>
            </div>

            <div className="flex justify-between items-start flex-wrap gap-6 p-6 bg-zephyr-ivory rounded-sm border border-zephyr-sand">
              <div>
                <h2 className="text-lg font-semibold text-zephyr-noir">Order ID: {checkout._id}</h2>
                <p className={textMuted}>
                  Order Date: {new Date(checkout.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className={successText}>
                  Estimated Delivery: {calculateEstimatedDelivery(checkout.createdAt)}
                </p>
              </div>
            </div>

            <div>
              <h3 className={headingSecondary}>Ordered Items</h3>
              <div className="space-y-4">
                {checkout.checkoutItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between p-4 border border-zephyr-sand rounded-sm bg-white hover:border-zephyr-gold transition duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-sm border border-zephyr-sand"
                      />
                      <div>
                        <h4 className="text-md font-medium text-zephyr-noir">{item.name}</h4>
                        <p className="text-sm text-zephyr-umber/60">
                          {item.concentration} | {item.volume}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-md font-medium text-zephyr-gold">Rs. {item.price}</p>
                      <p className="text-sm text-zephyr-umber/60">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-sm border border-zephyr-sand">
                <h4 className="text-lg font-semibold mb-3 text-zephyr-noir">Payment</h4>
                <p className={textMuted}>
                  {checkout.paymentMethod === "JazzCash" ? "JazzCash" : "Cash on Delivery"}
                </p>
              </div>

              <div className="p-6 bg-white rounded-sm border border-zephyr-sand">
                <h4 className="text-lg font-semibold mb-3 text-zephyr-noir">Delivery Address</h4>
                <p className={textMuted}>{checkout.shippingAddress.address}</p>
                <p className={textMuted}>
                  {checkout.shippingAddress.city}, {checkout.shippingAddress.country}
                </p>
                {checkout.shippingAddress.postalCode && (
                  <p className={textMuted}>Postal Code: {checkout.shippingAddress.postalCode}</p>
                )}
              </div>
            </div>

            <div className="p-6 bg-zephyr-ivory rounded-sm border border-zephyr-sand">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-zephyr-noir">Total Amount</h4>
                <p className="text-xl font-bold text-zephyr-gold">Rs. {checkout.totalPrice}</p>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => navigate("/collections/all")}
                className="bg-zephyr-noir text-zephyr-ivory hover:bg-zephyr-gold py-3 px-8 rounded-sm font-medium uppercase text-sm tracking-widest transition duration-200"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
