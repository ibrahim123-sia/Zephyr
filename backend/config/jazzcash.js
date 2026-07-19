const merchantId = process.env.JAZZCASH_MERCHANT_ID;
const password = process.env.JAZZCASH_PASSWORD;
const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT;
const returnUrl = process.env.JAZZCASH_RETURN_URL;
const envUrl = process.env.JAZZCASH_ENV_URL;
const frontendUrl = process.env.FRONTEND_URL;

const isConfigured = Boolean(
  merchantId && password && integritySalt && returnUrl && envUrl
);

module.exports = {
  merchantId,
  password,
  integritySalt,
  returnUrl,
  envUrl,
  frontendUrl,
  isConfigured,
};
