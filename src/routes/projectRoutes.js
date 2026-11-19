const express = require("express");
const auth = require("../middleware/auth");
const validateId = require("../middleware/validateId");
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", validateId, getProjectById);

router.post("/", auth, createProject);
router.put("/:id", auth, validateId, updateProject);
router.delete("/:id", auth, validateId, deleteProject);

module.exports = router;
