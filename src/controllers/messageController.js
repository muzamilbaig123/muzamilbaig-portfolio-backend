const { pool } = require("../config/db");
const {
  isNonEmptyString,
  isValidEmail,
  handleServerError,
} = require("../utils/helpers");

const LIMITS = { name: 100, email: 255, message: 5000 };

async function createMessage(req, res) {
  const { name, email, message } = req.body || {};
  const errors = {};

  if (!isNonEmptyString(name)) {
    errors.name = "Name is required";
  } else if (name.trim().length > LIMITS.name) {
    errors.name = `Name must be at most ${LIMITS.name} characters`;
  }

  if (!isNonEmptyString(email)) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email format";
  } else if (email.trim().length > LIMITS.email) {
    errors.email = `Email must be at most ${LIMITS.email} characters`;
  }

  if (!isNonEmptyString(message)) {
    errors.message = "Message is required";
  } else if (message.trim().length > LIMITS.message) {
    errors.message = `Message must be at most ${LIMITS.message} characters`;
  }

  // Koi bhi error ho to save mat karo
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
      [name.trim(), email.trim().toLowerCase(), message.trim()],
    );
    return res
      .status(201)
      .json({ message: "Message sent successfully", id: result.insertId });
  } catch (err) {
    return handleServerError(res, err, "createMessage");
  }
}

async function getAllMessages(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM messages ORDER BY created_at DESC, id DESC",
    );
    return res.status(200).json(rows);
  } catch (err) {
    return handleServerError(res, err, "getAllMessages");
  }
}

async function deleteMessage(req, res) {
  try {
    const [result] = await pool.query("DELETE FROM messages WHERE id = ?", [
      req.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Message not found" });
    }
    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    return handleServerError(res, err, "deleteMessage");
  }
}

module.exports = { createMessage, getAllMessages, deleteMessage };
