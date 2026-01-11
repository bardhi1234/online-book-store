const path = require("path");
const fs = require("fs");

// GET ALL BOOKS
exports.getAllBooks = async (req, res) => {
  const db = req.app.locals.db;
  try {
    const [rows] = await db.execute("SELECT * FROM books");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE BOOK
exports.createBook = async (req, res) => {
  const db = req.app.locals.db;
  let { title, author, price, stock } = req.body;
  let image = req.file?.filename || null;

  price = Number(price);
  stock = Number(stock);

  try {
    const [result] = await db.execute(
      "INSERT INTO books (title, author, price, stock, image) VALUES (?, ?, ?, ?, ?)",
      [title, author, price, stock, image]
    );
    res.status(201).json({ id: result.insertId, title, author, price, stock, image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE BOOK
exports.updateBook = async (req, res) => {
  const db = req.app.locals.db;
  let { title, author, price, stock } = req.body;
  const { id } = req.params;

  price = Number(price);
  stock = Number(stock);

  try {
    const [result] = await db.execute(
      "UPDATE books SET title=?, author=?, price=?, stock=? WHERE id=?",
      [title, author, price, stock, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book updated", book: { id, title, author, price, stock } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE BOOK
exports.deleteBook = async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const [rows] = await db.execute("SELECT image FROM books WHERE id=?", [id]);
    if (rows[0]?.image) {
      const imagePath = path.join(__dirname, "..", "uploads", rows[0].image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    const [result] = await db.execute("DELETE FROM books WHERE id=?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
