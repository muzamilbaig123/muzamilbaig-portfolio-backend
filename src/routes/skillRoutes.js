const express = require("express");
const auth = require("../middleware/auth");
const validateId = require("../middleware/validateId");
const {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");

const router = express.Router();

// Public
router.get("/", getAllSkills);
router.get("/:id", validateId, getSkillById);

// Protected
router.post("/", auth, createSkill);
router.put("/:id", auth, validateId, updateSkill);
router.delete("/:id", auth, validateId, deleteSkill);

module.exports = router;
