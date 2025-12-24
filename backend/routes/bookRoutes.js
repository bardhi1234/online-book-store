const express = require("express");
const router = express.Router();

const {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/books.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// PUBLIC – kushdo mund t'i shoh librat
router.get("/", getAllBooks);

// PROTECTED – duhet JWT
router.post("/", authMiddleware, createBook);
router.put("/:id", authMiddleware, updateBook);
router.delete("/:id", authMiddleware, deleteBook);

module.exports = router;
