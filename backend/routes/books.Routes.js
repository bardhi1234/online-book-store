const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { createBook, getAllBooks, updateBook, deleteBook } = require("../controllers/books.controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

// SET UP MULTER (upload images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ROUTES
router.get("/", getAllBooks);
router.post("/", authMiddleware, isAdmin, upload.single("image"), createBook);
router.put("/:id", authMiddleware, isAdmin, updateBook);
router.delete("/:id", authMiddleware, isAdmin, deleteBook);

module.exports = router;
