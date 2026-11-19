const express = require("express");
const auth = require("../middleware/auth");
const validateId = require("../middleware/validateId");
const {
  createMessage,
  getAllMessages,
  deleteMessage,
} = require("../controllers/messageController");

const router = express.Router();

router.post("/", createMessage);

router.get("/", auth, getAllMessages);
router.delete("/:id", auth, validateId, deleteMessage);

module.exports = router;
