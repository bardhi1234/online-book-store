const express = require("express");
const router = express.Router();

const {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/books.controller");

const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");



router.get("/", getAllBooks);

router.post("/", authMiddleware, isAdmin, createBook);
router.put("/:id", authMiddleware, isAdmin, updateBook);
router.delete("/:id", authMiddleware, isAdmin, deleteBook);

module.exports = router;
