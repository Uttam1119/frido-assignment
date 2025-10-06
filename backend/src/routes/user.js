const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");
const userController = require("../controllers/userController.js");

// GET /api/user
router.get("/", authMiddleware, userController.getUsers);

module.exports = router;
