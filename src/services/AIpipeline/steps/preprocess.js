// Step: preprocess
const crypto = require("crypto");

function limitText(text, maxChars) {
  if (!text) return "";
  if (!maxChars || maxChars <= 0) return text;
  return text.length > maxChars ? text.slice(0, maxChars) : text;
}

function preprocess(rawText, lang = "en") {
  const cleanText = (rawText || "").replace(/\s+/g, " ").trim();
  const checksum = crypto.createHash("sha256").update(cleanText, "utf8").digest("hex");
  const maxChars = Number(process.env.MAX_INPUT_CHARS || 20000); // ~5k tokens @4 chars/token
  const llmText = limitText(cleanText, maxChars);
  return { cleanText, llmText, checksum, lang, maxChars };
}

module.exports = { preprocess, limitText };
