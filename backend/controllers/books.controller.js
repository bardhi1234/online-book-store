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
