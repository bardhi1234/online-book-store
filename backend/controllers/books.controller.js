const db = require("../config/db");

// GET ALL BOOKS
exports.getAllBooks = (req, res) => {
  db.query("SELECT * FROM books", (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(results);
  });
};

// CREATE BOOK
exports.createBook = (req, res) => {
  const { title, author, price } = req.body;

  const sql =
    "INSERT INTO books (title, author, price) VALUES (?, ?, ?)";

  db.query(sql, [title, author, price], (err) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.status(201).json({ message: "Book created" });
  });
};

// UPDATE BOOK
exports.updateBook = (req, res) => {
  const { title, author, price } = req.body;

  const sql =
    "UPDATE books SET title=?, author=?, price=? WHERE id=?";

  db.query(sql, [title, author, price, req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json({ message: "Book updated" });
  });
};

// DELETE BOOK
exports.deleteBook = (req, res) => {
  db.query(
    "DELETE FROM books WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ message: "Book deleted" });
    }
  );
};
