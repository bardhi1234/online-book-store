const express = require("express");
const router = express.Router();
const { getAllUsers, createUser, updateUser, deleteUser } = require("../controllers/users.controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

// Vetëm admin mund të hyjë këto ruterë
router.get("/", authMiddleware, isAdmin, getAllUsers);
router.post("/", authMiddleware, isAdmin, createUser);
router.put("/:id", authMiddleware, isAdmin, updateUser);
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

module.exports = router;
