// ============================================================
// utils/helpers.js
// Chhote reusable functions jo saare controllers use karte hain.
// Ek hi jagah likhne se code repeat nahi hota.
// ============================================================

/**
 * Check karta hai ke value ek string hai aur trim karne ke baad khaali nahi.
 * Required fields (title, name, etc.) ke liye use hota hai.
 */
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Simple email format check: kuch@kuch.kuch
 * (Perfect email validation regex se mumkin nahi, lekin ye common galtiyan pakad leta hai.)
 */
function isValidEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Optional text field ko DB ke liye tayyar karta hai.
 *   undefined -> undefined  (field bheja hi nahi gaya, PUT me purani value rahegi)
 *   null      -> null
 *   string    -> trimmed string
 *   kuch aur  -> String() me convert
 */
function cleanOptional(value) {
  if (value === undefined || value === null) return value;
  return String(value).trim();
}

/**
 * Controllers ke catch block me use hota hai.
 * - Agar MySQL bole ke koi value column ke size se lambi hai -> 400 (client ki galti)
 * - Baaki har error -> 500 (server ki galti), aur error terminal me log hota hai
 *
 * Client ko asli error detail nahi bhejte, kyunki usme DB ki andar ki info ho sakti hai.
 */
function handleServerError(res, err, context) {
  if (err.code === "ER_DATA_TOO_LONG") {
    return res.status(400).json({ message: "One of the fields is too long" });
  }
  console.error(`[${context}]`, err);
  return res.status(500).json({ message: "Internal server error" });
}

module.exports = { isNonEmptyString, isValidEmail, cleanOptional, handleServerError };
