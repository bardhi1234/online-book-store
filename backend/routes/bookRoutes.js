const express = require("express");
const router = express.Router();

const {
  getAllBooks,
  createBook,
} = require("../controllers/books.controller");

// GET books
router.get("/", getAllBooks);

// POST book
router.post("/", createBook);

module.exports = router;
