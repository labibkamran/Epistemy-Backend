// Step: preprocess
const crypto = require("crypto");

function preprocess(rawText, lang = "en") {
  const cleanText = (rawText || "").replace(/\s+/g, " ").trim();
  const checksum = crypto.createHash("sha256").update(cleanText, "utf8").digest("hex");
  return { cleanText, checksum, lang };
}

module.exports = { preprocess };
