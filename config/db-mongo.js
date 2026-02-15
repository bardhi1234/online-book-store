// backend/db-mongo.js
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/onlineBookStore")
.then(() => console.log("MongoDB u lidh me sukses!"))
.catch((err) => console.error("MongoDB gabim:", err));

module.exports = mongoose;