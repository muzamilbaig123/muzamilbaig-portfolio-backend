const { pool } = require("../config/db");
const { isNonEmptyString, handleServerError } = require("../utils/helpers");

async function findSkillById(id) {
  const [rows] = await pool.query("SELECT * FROM skills WHERE id = ?", [id]);
  return rows[0] || null;
}

async function getAllSkills(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM skills ORDER BY category, id",
    );
    return res.status(200).json(rows);
  } catch (err) {
    return handleServerError(res, err, "getAllSkills");
  }
}

async function getSkillById(req, res) {
  try {
    const skill = await findSkillById(req.id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }
    return res.status(200).json(skill);
  } catch (err) {
    return handleServerError(res, err, "getSkillById");
  }
}

async function createSkill(req, res) {
  const { name, category } = req.body || {};

  if (!isNonEmptyString(name) || !isNonEmptyString(category)) {
    return res.status(400).json({ message: "Name and category are required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO skills (name, category) VALUES (?, ?)",
      [name.trim(), category.trim()],
    );
    const skill = await findSkillById(result.insertId);
    return res.status(201).json(skill);
  } catch (err) {
    return handleServerError(res, err, "createSkill");
  }
}

async function updateSkill(req, res) {
  const { name, category } = req.body || {};

  if (name === undefined && category === undefined) {
    return res.status(400).json({ message: "No fields provided to update" });
  }
  if (
    (name !== undefined && !isNonEmptyString(name)) ||
    (category !== undefined && !isNonEmptyString(category))
  ) {
    return res
      .status(400)
      .json({ message: "Name and category cannot be empty" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE skills SET
         name     = COALESCE(?, name),
         category = COALESCE(?, category)
       WHERE id = ?`,
      [name?.trim() ?? null, category?.trim() ?? null, req.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Skill not found" });
    }

    const skill = await findSkillById(req.id);
    return res.status(200).json(skill);
  } catch (err) {
    return handleServerError(res, err, "updateSkill");
  }
}

async function deleteSkill(req, res) {
  try {
    const [result] = await pool.query("DELETE FROM skills WHERE id = ?", [
      req.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Skill not found" });
    }
    return res.status(200).json({ message: "Skill deleted successfully" });
  } catch (err) {
    return handleServerError(res, err, "deleteSkill");
  }
}

module.exports = {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};
