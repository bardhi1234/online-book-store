const db = require("../config/db");
const bcrypt = require("bcryptjs");

// ===============================
// GET ALL USERS (Admin only)
// ===============================
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email, role FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Gabim në DB", error: err.message });
  }
};

// ===============================
// CREATE USER (Admin only)
// ===============================
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email dhe password janë të detyrueshme" });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role || "user"]
    );
    res.status(201).json({ message: "User u krijua me sukses", userId: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "User me këtë email ekziston" });
    }
    res.status(500).json({ message: "Gabim në DB", error: err.message });
  }
};

// ===============================
// UPDATE USER (Admin only)
// ===============================
exports.updateUser = async (req, res) => {
  const { name, role } = req.body;
  const userId = req.params.id;

  if (!name || !role) {
    return res.status(400).json({ message: "Name dhe role janë të detyrueshme" });
  }

  try {
    const [result] = await db.query("UPDATE users SET name=?, role=? WHERE id=?", [name, role, userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User nuk u gjet" });
    }
    res.json({ message: "User u përditësua me sukses" });
  } catch (err) {
    res.status(500).json({ message: "Gabim në DB", error: err.message });
  }
};

// ===============================
// DELETE USER (Admin only)
// ===============================
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  if (req.user.id == userId) {
    return res.status(400).json({ message: "Nuk mund të fshiheni vetë" });
  }

  try {
    const [result] = await db.query("DELETE FROM users WHERE id=?", [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User nuk u gjet" });
    }
    res.json({ message: "User u fshi me sukses" });
  } catch (err) {
    res.status(500).json({ message: "Gabim në DB", error: err.message });
  }
};
