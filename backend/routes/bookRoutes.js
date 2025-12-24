const express = require("express");
const router = express.Router();

const {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/books.controller");

const { protect } = require("../middleware/auth.middleware");

// PUBLIC – kushdo mund t'i shoh librat
router.get("/", getAllBooks);

// PROTECTED – duhet JWT
router.post("/", protect, createBook);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);

module.exports = router;

const authMiddleware = require("../middlewares/auth.middleware");
