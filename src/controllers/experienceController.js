const { pool } = require("../config/db");
const {
  isNonEmptyString,
  cleanOptional,
  handleServerError,
} = require("../utils/helpers");

async function findExperienceById(id) {
  const [rows] = await pool.query("SELECT * FROM experience WHERE id = ?", [
    id,
  ]);
  return rows[0] || null;
}

async function getAllExperience(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM experience ORDER BY id DESC",
    );
    return res.status(200).json(rows);
  } catch (err) {
    return handleServerError(res, err, "getAllExperience");
  }
}

async function getExperienceById(req, res) {
  try {
    const item = await findExperienceById(req.id);
    if (!item) {
      return res.status(404).json({ message: "Experience not found" });
    }
    return res.status(200).json(item);
  } catch (err) {
    return handleServerError(res, err, "getExperienceById");
  }
}

async function createExperience(req, res) {
  const { role, company, duration, description } = req.body || {};

  if (!isNonEmptyString(role) || !isNonEmptyString(company)) {
    return res.status(400).json({ message: "Role and company are required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO experience (role, company, duration, description) VALUES (?, ?, ?, ?)",
      [
        role.trim(),
        company.trim(),
        cleanOptional(duration) ?? null,
        cleanOptional(description) ?? null,
      ],
    );
    const item = await findExperienceById(result.insertId);
    return res.status(201).json(item);
  } catch (err) {
    return handleServerError(res, err, "createExperience");
  }
}

async function updateExperience(req, res) {
  const { role, company, duration, description } = req.body || {};

  if ([role, company, duration, description].every((v) => v === undefined)) {
    return res.status(400).json({ message: "No fields provided to update" });
  }
  if (
    (role !== undefined && !isNonEmptyString(role)) ||
    (company !== undefined && !isNonEmptyString(company))
  ) {
    return res
      .status(400)
      .json({ message: "Role and company cannot be empty" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE experience SET
         role        = COALESCE(?, role),
         company     = COALESCE(?, company),
         duration    = COALESCE(?, duration),
         description = COALESCE(?, description)
       WHERE id = ?`,
      [
        role?.trim() ?? null,
        company?.trim() ?? null,
        cleanOptional(duration) ?? null,
        cleanOptional(description) ?? null,
        req.id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Experience not found" });
    }

    const item = await findExperienceById(req.id);
    return res.status(200).json(item);
  } catch (err) {
    return handleServerError(res, err, "updateExperience");
  }
}

async function deleteExperience(req, res) {
  try {
    const [result] = await pool.query("DELETE FROM experience WHERE id = ?", [
      req.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Experience not found" });
    }
    return res.status(200).json({ message: "Experience deleted successfully" });
  } catch (err) {
    return handleServerError(res, err, "deleteExperience");
  }
}

module.exports = {
  getAllExperience,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
};
