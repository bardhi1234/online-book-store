require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const authRoutes = require("./routes/auth.routes");   // supozon që e ke
const bookRoutes = require("./routes/bookRoutes");    // supozon që e ke
const ordersRoutes = require("./routes/orders.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection (mysql2 pool)
const initDB = async () => {
  try {
    const db = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    app.locals.db = db;
    console.log("DB Connected");
  } catch (err) {
    console.error("DB connection error:", err);
  }
};

initDB();

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", ordersRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
