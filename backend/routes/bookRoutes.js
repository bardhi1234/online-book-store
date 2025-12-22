const express = require("express");
const router = express.Router();

const {
  getAllBooks,
  createBook,
  deleteBook,
} = require("../controllers/books.controller");

// GET all books
router.get("/", getAllBooks);

// POST new book
router.post("/", createBook);

// DELETE book by id
router.delete("/:id", deleteBook);

module.exports = router;
