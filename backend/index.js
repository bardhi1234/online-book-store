require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db"); 
const authRoutes = require("./routes/auth.routes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Imazhet statikisht
app.use("/uploads", express.static("uploads"));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.status(200).send("API is running...");
});

// START SERVER me DB
const startServer = async () => {
  const db = await connectDB(); 
  app.locals.db = db; // ruaj lidhjen në app.locals që mund ta përdorësh në controllers

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
