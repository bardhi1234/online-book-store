const express = require("express");
const router = express.Router();

const {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/books.controller");

const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

// GET ALL BOOKS - open for all
router.get("/", getAllBooks);

// CREATE, UPDATE, DELETE - only admin
router.post("/", authMiddleware, isAdmin, createBook);
router.put("/:id", authMiddleware, isAdmin, updateBook);
router.delete("/:id", authMiddleware, isAdmin, deleteBook);

module.exports = router;
