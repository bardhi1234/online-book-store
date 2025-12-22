const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.status(200).send("Backend OK 🚀");
});

// Books routes
app.use("/api/books", bookRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
