exports.getAllBooks = async (req, res) => {
  const db = req.app.locals.db;
  try {
    const [books] = await db.execute("SELECT * FROM books");
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBook = async (req, res) => {
  const db = req.app.locals.db;
  const { title, author, price } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const [result] = await db.execute(
      "INSERT INTO books (title, author, price, image) VALUES (?, ?, ?, ?)",
      [title, author, price || null, image]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      author,
      price,
      image,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateBook = async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { title, author, price } = req.body;

  try {
    await db.execute(
      "UPDATE books SET title = ?, author = ?, price = ? WHERE id = ?",
      [title, author, price, id]
    );
    res.json({ message: "Book updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM books WHERE id = ?", [id]);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
