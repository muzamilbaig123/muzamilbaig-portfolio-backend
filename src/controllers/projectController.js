const { pool } = require("../config/db");
const {
  isNonEmptyString,
  cleanOptional,
  handleServerError,
} = require("../utils/helpers");

function techToString(tech) {
  if (tech === undefined) return undefined;
  if (tech === null) return "";
  const list = Array.isArray(tech) ? tech : String(tech).split(",");
  return list
    .map((t) => String(t).trim())
    .filter(Boolean)
    .join(",");
}

function formatProject(row) {
  return { ...row, tech: row.tech ? row.tech.split(",") : [] };
}

async function findProjectById(id) {
  const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [id]);
  return rows[0] ? formatProject(rows[0]) : null;
}

async function getAllProjects(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM projects ORDER BY created_at DESC, id DESC",
    );
    return res.status(200).json(rows.map(formatProject));
  } catch (err) {
    return handleServerError(res, err, "getAllProjects");
  }
}

async function getProjectById(req, res) {
  try {
    const project = await findProjectById(req.id); // req.id validateId middleware se aata hai
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json(project);
  } catch (err) {
    return handleServerError(res, err, "getProjectById");
  }
}

async function createProject(req, res) {
  const { title, description, tech, image_url, project_link } = req.body || {};

  if (!isNonEmptyString(title)) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO projects (title, description, tech, image_url, project_link)
       VALUES (?, ?, ?, ?, ?)`,
      [
        title.trim(),
        cleanOptional(description) ?? null, // ?? null: undefined ko NULL bana do
        techToString(tech) ?? "",
        cleanOptional(image_url) ?? null,
        cleanOptional(project_link) ?? null,
      ],
    );

    const project = await findProjectById(result.insertId);
    return res.status(201).json(project);
  } catch (err) {
    return handleServerError(res, err, "createProject");
  }
}

async function updateProject(req, res) {
  const { title, description, tech, image_url, project_link } = req.body || {};

  // Kam se kam ek field to honi chahiye
  if (
    [title, description, tech, image_url, project_link].every(
      (v) => v === undefined,
    )
  ) {
    return res.status(400).json({ message: "No fields provided to update" });
  }

  // Title bheja hai to khaali nahi hona chahiye
  if (title !== undefined && !isNonEmptyString(title)) {
    return res.status(400).json({ message: "Title cannot be empty" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE projects SET
         title        = COALESCE(?, title),
         description  = COALESCE(?, description),
         tech         = COALESCE(?, tech),
         image_url    = COALESCE(?, image_url),
         project_link = COALESCE(?, project_link)
       WHERE id = ?`,
      [
        title?.trim() ?? null,
        cleanOptional(description) ?? null,
        techToString(tech) ?? null,
        cleanOptional(image_url) ?? null,
        cleanOptional(project_link) ?? null,
        req.id,
      ],
    );

    // affectedRows 0 = is id ka koi row hi nahi tha
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const project = await findProjectById(req.id);
    return res.status(200).json(project);
  } catch (err) {
    return handleServerError(res, err, "updateProject");
  }
}

async function deleteProject(req, res) {
  try {
    const [result] = await pool.query("DELETE FROM projects WHERE id = ?", [
      req.id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    return handleServerError(res, err, "deleteProject");
  }
}

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
