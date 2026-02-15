// backend/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const mysql = require("mysql2/promise");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MySQL Connection ---
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});
app.locals.db = db;

// --- MongoDB Connection ---
require("./config/db-mongo"); // ky është skedari ku kam mongoose.connect()

// --- Routes ---
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/books", require("./routes/books.Routes"));
app.use("/api/orders", require("./routes/orders.routes"));
app.use("/api/users", require("./routes/users.routes"));

// --- Serve uploads ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Test Route ---
app.get("/", (req, res) => {
  res.send("Backend po funksionon me MySQL dhe MongoDB!");
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));