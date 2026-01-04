require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const bookRoutes = require("./routes/bookRoutes");
const usersRoutes = require("./routes/users.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", usersRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Server running");
});

const ordersRouter = require("./routes/orders.routes");
app.use("/orders", ordersRouter);
