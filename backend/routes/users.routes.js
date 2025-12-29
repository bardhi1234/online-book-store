const express = require("express");
const router = express.Router();

const { getAllUsers, updateUser, deleteUser, createUser } = require("../controllers/users.controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");


// Vetëm admin mund të përdorë këto ruterë
router.get("/", authMiddleware, isAdmin, getAllUsers);
router.put("/:id", authMiddleware, isAdmin, updateUser);
router.delete("/:id", authMiddleware, isAdmin, deleteUser);
router.post("/", authMiddleware, isAdmin, createUser);


module.exports = router;
