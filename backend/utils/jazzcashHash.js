const crypto = require("crypto");

// JazzCash requires every pp_* value (excluding ppmpf_* custom fields and
// pp_SecureHash itself) sorted alphabetically by field name, joined with '&',
// prefixed with the Integrity Salt, then HMAC-SHA256'd with that same salt
// as the key. The result is uppercased hex. This must only ever run
// server-side — the Integrity Salt is a secret.
const buildHashString = (fields, integritySalt) => {
  const values = Object.keys(fields)
    .filter((key) => key.startsWith("pp_") && key !== "pp_SecureHash")
    .sort()
    .map((key) => fields[key]);

  return [integritySalt, ...values].join("&");
};

const generateSecureHash = (fields, integritySalt) => {
  const hashString = buildHashString(fields, integritySalt);
  return crypto
    .createHmac("sha256", integritySalt)
    .update(hashString)
    .digest("hex")
    .toUpperCase();
};

const verifySecureHash = (fields, integritySalt) => {
  const receivedHash = fields.pp_SecureHash;
  if (!receivedHash) return false;

  const expectedHash = generateSecureHash(fields, integritySalt);

  const receivedBuffer = Buffer.from(receivedHash);
  const expectedBuffer = Buffer.from(expectedHash);

  if (receivedBuffer.length !== expectedBuffer.length) return false;

  return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
};

module.exports = { generateSecureHash, verifySecureHash };
