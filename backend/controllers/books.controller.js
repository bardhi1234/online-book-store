const db = require("../config/db");

// GET all books
exports.getAllBooks = (req, res) => {
  const sql = "SELECT * FROM books";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results);
  });
};

// POST new book
exports.createBook = (req, res) => {
  const { title, author, description, price, stock, image_url } = req.body;

  const sql = `
    INSERT INTO books (title, author, description, price, stock, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, author, description, price, stock || 0, image_url],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to create book" });
      }

      res.status(201).json({
        message: "Book created successfully",
        bookId: result.insertId,
      });
    }
  );
};

// DELETE book by ID
exports.deleteBook = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM books WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to delete book" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  });
};

// UPDATE book
exports.updateBook = (req, res) => {
  const { id } = req.params;
  const { title, author, description, price, stock, image_url } = req.body;

  const sql = `
    UPDATE books
    SET title = ?, author = ?, description = ?, price = ?, stock = ?, image_url = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [title, author, description, price, stock, image_url, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to update book" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.status(200).json({ message: "Book updated successfully" });
    }
  );
};
