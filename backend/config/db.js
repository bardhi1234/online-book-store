// backend/config/db.js
const mysql = require("mysql2/promise"); // përdor promise për async/await

const connectDB = async () => {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
    });

    console.log("✅ MySQL connected");
    return db;
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1); // ndal server-in nëse nuk lidhet DB
  }
};

module.exports = connectDB;
