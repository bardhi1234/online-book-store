const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/books.controller");

const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

// Config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
router.get("/", getAllBooks);
router.post("/", authMiddleware, isAdmin, upload.single("image"), createBook);
router.put("/:id", authMiddleware, isAdmin, updateBook);
router.delete("/:id", authMiddleware, isAdmin, deleteBook);

module.exports = router;
