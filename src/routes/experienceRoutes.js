const express = require("express");
const auth = require("../middleware/auth");
const validateId = require("../middleware/validateId");
const {
  getAllExperience,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");

const router = express.Router();

// Public
router.get("/", getAllExperience);
router.get("/:id", validateId, getExperienceById);

// Protected
router.post("/", auth, createExperience);
router.put("/:id", auth, validateId, updateExperience);
router.delete("/:id", auth, validateId, deleteExperience);

module.exports = router;
