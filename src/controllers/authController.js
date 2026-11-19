const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");
const { isNonEmptyString, handleServerError } = require("../utils/helpers");

async function login(req, res) {
  const { username, password } = req.body || {};

  // validation
  if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT id, username, password_hash FROM admin WHERE username = ?",
      [username.trim()],
    );
    const admin = rows[0];

    // 3) bcrypt
    const isMatch = admin
      ? await bcrypt.compare(password, admin.password_hash)
      : false;

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      admin: { id: admin.id, username: admin.username },
    });
  } catch (err) {
    return handleServerError(res, err, "login");
  }
}

module.exports = { login };
