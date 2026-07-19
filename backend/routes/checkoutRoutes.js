const express = require("express");
const Checkout = require("../models/Checkout");
const { protect } = require("../middleware/authMiddleware");
const { markCheckoutPaidAndFinalize } = require("../utils/checkoutHelpers");

const router = express.Router();

//@route POST /api/checkout
//@desc create a new checkout session
//@access private

router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "no item in checkout" });
  }
  try {
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });

    res.status(201).json(newCheckout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

//@route PUT /api/checkout/:id/pay
//@desc update checkout to mark as paid after successful payment (Cash on Delivery flow)
//@access private

router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();
      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid Payment Status" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route POST /api/checkout/:id/finalize
//@desc Finalize checkout and convert to an order after payment confirmation (Cash on Delivery flow)
//@access private

router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "checkout not found" });
    }

    if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout already Finalized" });
    }

    if (!checkout.isPaid) {
      return res.status(400).json({ message: "Checkout is not paid" });
    }

    const { order } = await markCheckoutPaidAndFinalize(
      checkout._id,
      checkout.paymentDetails
    );

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
