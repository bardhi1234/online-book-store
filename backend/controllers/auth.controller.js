const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
const register = (req, res) => {
  const { name, email, password } = req.body;

  // kontrollo user ekzistues
  const checkQuery = "SELECT id FROM users WHERE email = ?";
  db.query(checkQuery, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

    db.query(
      insertQuery,
      [name, email, hashedPassword, "user"],
      (err) => {
        if (err) return res.status(500).json({ message: err.message });

        res.status(201).json({ message: "User registered successfully" });
      }
    );
  });
};

// LOGIN
const login = (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  });
};

module.exports = { register, login };
