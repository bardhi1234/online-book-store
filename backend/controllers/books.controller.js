const db = require("../config/db");

exports.getAllBooks = (req, res) => {
  const sql = "SELECT * FROM books";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};
