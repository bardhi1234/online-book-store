const db = require("../config/db");

// GET ALL USERS
exports.getAllUsers = (req, res) => {
  db.query("SELECT id, name, email, role FROM users", (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(results);
  });
};

// UPDATE USER
exports.updateUser = (req, res) => {
  const { name, role } = req.body;
  const userId = req.params.id;

  db.query("UPDATE users SET name=?, role=? WHERE id=?", [name, role, userId], (err) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json({ message: "User updated" });
  });
};
// CREATE USER (admin only)
exports.createUser = (req, res) => {
  const { name, email, password, role } = req.body;
  const bcrypt = require("bcryptjs");
  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, hashedPassword, role || "user"], (err) => {
    if (err) return res.status(400).json({ message: "User already exists" });
    res.status(201).json({ message: "User created successfully" });
  });
};


// DELETE USER
exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  db.query("DELETE FROM users WHERE id=?", [userId], (err) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json({ message: "User deleted" });
  });
};
