const express = require("express");
const Checkout = require("../models/Checkout");
const { protect } = require("../middleware/authMiddleware");
const jazzcashConfig = require("../config/jazzcash");
const { generateSecureHash, verifySecureHash } = require("../utils/jazzcashHash");
const { markCheckoutPaidAndFinalize } = require("../utils/checkoutHelpers");

const router = express.Router();

// yyyyMMddHHmmss, the format JazzCash's API requires for date fields
const formatJazzCashDate = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
};

//@route GET /api/jazzcash/config-status
//@desc  lets the frontend know whether JazzCash is configured, so it can
//       hide the option entirely instead of erroring when it isn't
//@access public
router.get("/config-status", (req, res) => {
  res.json({ enabled: jazzcashConfig.isConfigured });
});

//@route POST /api/jazzcash/initiate
//@desc  build the signed JazzCash hosted-checkout form fields for a checkout
//@access private
router.post("/initiate", protect, async (req, res) => {
  if (!jazzcashConfig.isConfigured) {
    return res.status(503).json({ message: "JazzCash is not configured" });
  }

  const { checkoutId } = req.body;

  try {
    const checkout = await Checkout.findById(checkoutId);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (!checkout.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized for this checkout" });
    }

    if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout already finalized" });
    }

    const now = new Date();
    const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const txnRefNo = `T${Date.now()}${checkout._id.toString().slice(-6)}`;

    const fields = {
      pp_Version: "1.1",
      pp_TxnType: "MWALLET",
      pp_Language: "EN",
      pp_MerchantID: jazzcashConfig.merchantId,
      pp_Password: jazzcashConfig.password,
      pp_TxnRefNo: txnRefNo,
      pp_Amount: String(Math.round(checkout.totalPrice * 100)),
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: formatJazzCashDate(now),
      pp_BillReference: checkout._id.toString(),
      pp_Description: `Zephyr Order ${checkout._id}`,
      pp_TxnExpiryDateTime: formatJazzCashDate(expiry),
      pp_ReturnURL: jazzcashConfig.returnUrl,
    };

    fields.pp_SecureHash = generateSecureHash(fields, jazzcashConfig.integritySalt);

    checkout.paymentMethod = "JazzCash";
    checkout.paymentDetails = { txnRefNo };
    await checkout.save();

    res.json({ actionUrl: jazzcashConfig.envUrl, fields });
  } catch (error) {
    console.error("JazzCash initiate error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route POST /api/jazzcash/callback
//@desc  JazzCash posts the transaction result here (x-www-form-urlencoded)
//@access public (verified via pp_SecureHash, not auth)
router.post("/callback", async (req, res) => {
  const frontendUrl = jazzcashConfig.frontendUrl || "/";

  try {
    if (!jazzcashConfig.isConfigured) {
      return res.redirect(`${frontendUrl}/jazzcash-return?status=error&reason=not-configured`);
    }

    const isValid = verifySecureHash(req.body, jazzcashConfig.integritySalt);
    if (!isValid) {
      console.error("JazzCash callback: secure hash verification failed");
      return res.redirect(`${frontendUrl}/jazzcash-return?status=error&reason=hash-mismatch`);
    }

    const checkout = await Checkout.findOne({
      "paymentDetails.txnRefNo": req.body.pp_TxnRefNo,
    });

    if (!checkout) {
      return res.redirect(`${frontendUrl}/jazzcash-return?status=error&reason=checkout-not-found`);
    }

    if (req.body.pp_ResponseCode === "000") {
      const { order } = await markCheckoutPaidAndFinalize(checkout._id, {
        method: "JazzCash",
        ...req.body,
      });
      return res.redirect(
        `${frontendUrl}/jazzcash-return?status=success&orderId=${order ? order._id : checkout._id}`
      );
    }

    return res.redirect(
      `${frontendUrl}/jazzcash-return?status=failed&reason=${encodeURIComponent(
        req.body.pp_ResponseMessage || "Payment failed"
      )}`
    );
  } catch (error) {
    console.error("JazzCash callback error:", error);
    return res.redirect(`${frontendUrl}/jazzcash-return?status=error&reason=server-error`);
  }
});

module.exports = router;
