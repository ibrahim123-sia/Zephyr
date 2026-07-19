const Checkout = require("../models/Checkout");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

// Marks a checkout as paid, converts it into an Order, and clears the user's cart.
// Shared by the COD flow (checkoutRoutes) and the JazzCash callback (jazzcashRoutes).
const markCheckoutPaidAndFinalize = async (checkoutId, paymentDetails) => {
  const checkout = await Checkout.findById(checkoutId);

  if (!checkout) {
    throw new Error("Checkout not found");
  }

  if (checkout.isFinalized) {
    return { checkout, order: null, alreadyFinalized: true };
  }

  checkout.isPaid = true;
  checkout.paymentStatus = "Paid";
  checkout.paymentDetails = paymentDetails;
  checkout.paidAt = checkout.paidAt || Date.now();
  checkout.isFinalized = true;
  checkout.finalizedAt = Date.now();
  await checkout.save();

  const order = await Order.create({
    user: checkout.user,
    orderItems: checkout.checkoutItems,
    shippingAddress: checkout.shippingAddress,
    paymentMethod: checkout.paymentMethod,
    totalPrice: checkout.totalPrice,
    isPaid: true,
    paidAt: checkout.paidAt,
    isDelivered: false,
    paymentStatus: "Paid",
    paymentDetails,
  });

  await Cart.findOneAndDelete({ user: checkout.user });

  return { checkout, order, alreadyFinalized: false };
};

module.exports = { markCheckoutPaidAndFinalize };
